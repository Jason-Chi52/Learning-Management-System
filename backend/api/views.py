from django.shortcuts import render
from .models import Course, Chapter
from .serializers import CourseSerializer, ChapterSerializer
from rest_framework import viewsets
from django.http import HttpResponse
# Create your views here.
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().order_by('-id')
    serializer_class = CourseSerializer

class ChapterViewSet(viewsets.ModelViewSet):
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer


def home(request):
    return HttpResponse("<h2>LMS Backend Running </h2><p>Use /api/courses/ or /api/chapters/ to view data.</p>")
