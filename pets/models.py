from django.db import models

from django.contrib.auth.models import User

class Pet(models.Model):
    name = models.CharField(max_length=50)
    age = models.PositiveIntegerField()
    breed = models.CharField(max_length=50)
    health_info = models.TextField(blank=True)
    owner = models.ForeignKey(User,on_delete=models.CASCADE)                     

    def __str__(self):
        return self.name
