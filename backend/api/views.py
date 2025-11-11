from django.shortcuts import render
from .models import Course, Chapter
from .serializers import CourseSerializer, ChapterSerializer
from rest_framework import viewsets
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response




# Create your views here.
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().order_by('-id')
    serializer_class = CourseSerializer

class ChapterViewSet(viewsets.ModelViewSet):
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer


def home(request):
    return HttpResponse("<h2>LMS Backend Running </h2><p>Use /api/courses/ or /api/chapters/ to view data.</p>")

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