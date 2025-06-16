from django.db import models

from pets.models import Pet 

class Remainder(models.Model): 
    title = models.CharField(max_length= 100)  #title of remainder 
    pet = models.ForeignKey(Pet,on_delete=models.CASCADE) #linking to a pet 
    date = models.DateTimeField()
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.title} for {self.pet}'
