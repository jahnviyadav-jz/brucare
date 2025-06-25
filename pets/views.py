from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Pet
from .serializers import PetSerializer
from django.shortcuts import get_object_or_404

class PetList(APIView):
    permission_classes = [IsAuthenticated] 
    
    def get(self,request): #fetch all pets for logged in user
        pets = Pet.objects.filter(owner=request.user) #filter pets acc to user 
        serializer = PetSerializer(pets,many=True)
        return Response(serializer.data)

    def post(self,request): #add a new pet
        serializer = PetSerializer(data=request.data)
        if serializer.is_valid(): 
            serializer.save(owner=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors,status=400)
    

class PetDetail(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self,request,pk):#fetch a specific pet
        pet = get_object_or_404(Pet,pk=pk, owner=request.user)
        serializer = PetSerializer(pet)
        return Response(serializer.data)
    
    def put(self,request, pk):#update a specific pet 
        pet = get_object_or_404(Pet,pk=pk,owner=request.user)
        serializer = PetSerializer(pet,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors,status=400)

    def delete(self,request,pk):#delete a specific pet 
        pet = get_object_or_404(Pet,pk=pk , owner=request.user)
        pet.delete()
        return Response({'message':'Pet deleted successfully'},status=204)
