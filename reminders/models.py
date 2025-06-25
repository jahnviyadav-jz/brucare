from django.db import models
from django.contrib.auth.models import User
from pets.models import Pet 

class Reminder(models.Model): 
    title = models.CharField(max_length= 100)  #title of reminder 
    pet = models.ForeignKey(Pet,on_delete=models.CASCADE) #linking to a pet 
    date = models.DateTimeField()
    is_completed = models.BooleanField(default=False)
    user = models.ForeignKey(User,on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.title} for {self.pet}'
