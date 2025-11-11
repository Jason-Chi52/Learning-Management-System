from .models import Course, Chapter
from .serializers import CourseSerializer, ChapterSerializer
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User, Group
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken


# Create your views here.
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().order_by('-id')
    serializer_class = CourseSerializer

class ChapterViewSet(viewsets.ModelViewSet):
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    groups = set(request.user.groups.values_list('name', flat=True))
    role = 'Instructor' if 'Instructor' in groups else ('Student' if 'Student' in groups else 'Student')
    return Response({
        'id': request.user.id,
        'username': request.user.username,
        'role': role,
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    """
    Body: { "username": "...", "password": "...", "role": "Instructor" | "Student" }
    Creates a user, assigns the role Group, and returns JWT tokens.
    """
    username = (request.data.get('username') or '').strip()
    password = (request.data.get('password') or '').strip()
    role     = (request.data.get('role') or 'Student').strip()

    if not username or not password:
        return Response({"error": "username and password required"}, status=status.HTTP_400_BAD_REQUEST)
    if role not in ("Instructor", "Student"):
        return Response({"error": "role must be Instructor or Student"}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exists():
        return Response({"error": "username already taken"}, status=status.HTTP_400_BAD_REQUEST)

    # Create user
    user = User.objects.create_user(username=username, password=password)

    # Ensure groups exist, then assign
    instr_group, _ = Group.objects.get_or_create(name="Instructor")
    stud_group,  _ = Group.objects.get_or_create(name="Student")
    user.groups.add(instr_group if role == "Instructor" else stud_group)

    # Issue JWT
    refresh = RefreshToken.for_user(user)
    access  = str(refresh.access_token)

    return Response({
        "user": {"id": user.id, "username": user.username, "role": role},
        "access": access,
        "refresh": str(refresh),
    }, status=status.HTTP_201_CREATED)
