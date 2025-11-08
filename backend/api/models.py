from django.db import models

# Create your models here.
class Course(models.Model):
    owner = models.CharField(max_length=200)
    description = models.TextField(blank=True)


class Chapter(models.Model):
    course = models.ForeignKey(Course, on_delete= models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField(blank=True)
    is_public = models.BooleanField(default=False)


