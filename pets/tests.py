from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User
from .models import Pet


class PetAPITestCase(TestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(username='testuser', password='testpass')

        # Log in the test client
        self.client = APIClient()
        self.client.login(username='testuser', password='testpass')

        # Create a sample pet
        self.pet = Pet.objects.create(name='Buddy', breed='Golden Retriever', age=3, owner=self.user)

        # Define API URLs
        self.pet_list_url = '/api/pets/'
        self.pet_detail_url = f'/api/pets/{self.pet.id}/'

    def test_get_all_pets(self):
        response = self.client.get(self.pet_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Buddy')

    def test_create_pet(self):
        data = {'name': 'Max', 'breed': 'Labrador', 'age': 4, 'health_info': 'healthy and vaccinated'}
        response = self.client.post(self.pet_list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'Max')
        self.assertEqual(response.data['breed'], 'Labrador')
        self.assertEqual(response.data['age'], 4)
        self.assertEqual(response.data['health_info'], 'healthy and vaccinated')

    def test_get_pet_details(self):
        response = self.client.get(self.pet_detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Buddy')

    def test_update_pet(self):
        data = {'name': 'Buddy Updated', 'breed': 'Golden Retriever', 'age': 5, 'health_info': 'Recently vaccinated'}
        response = self.client.put(self.pet_detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Buddy Updated')
        self.assertEqual(response.data['age'], 5)

    def test_delete_pet(self):
        response = self.client.delete(self.pet_detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Pet.objects.filter(id=self.pet.id).exists())
