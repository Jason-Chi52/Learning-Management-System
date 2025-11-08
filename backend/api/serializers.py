from rest_framework import serializers 
from .models import Course, Chapter

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'title', 'description']

class ChapterSerializer(serializers.ModelSerializer):
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())
    class Meta:
        model = Chapter
        fields = ['id', 'course', 'title', 'content', 'is_public']