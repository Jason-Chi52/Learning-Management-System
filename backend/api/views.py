from django.shortcuts import render
from .models import Course, Chapter
from .serializers import CourseSerializer, ChapterSerializer
from rest_framework import viewsets
# Create your views here.
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().order_by('-id')
    serializer_class = CourseSerializer

class ChapterViewSet(viewsets.ModelViewSet):
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer
    
