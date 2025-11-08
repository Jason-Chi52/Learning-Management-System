from django.db import models

# Create your models here.

#A Course has a title and description.
class Course(models.Model):
    owner = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    def __str__(self):
        return self.title

#A Chapter belongs to a course and can be marked as public or not.
class Chapter(models.Model):
    course = models.ForeignKey(Course, on_delete= models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField(blank=True)
    is_public = models.BooleanField(default=False)
    def __str__(self):
        return f"{self.title} (Course {self.course_id})"

