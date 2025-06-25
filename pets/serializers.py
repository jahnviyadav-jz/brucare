from rest_framework import serializers
from .models import Pet

class PetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pet
        fields = '__all__' #include all field from pet model
        read_only_fields = ['owner']#ensure owner is not required in request data 
        