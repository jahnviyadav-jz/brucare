from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User
from .models import Reminder
from pets.models import Pet

class ReminderAPITestCase(TestCase):
    def setUp(self):
        # Create a test user and a sample pet
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.client = APIClient()
        self.client.login(username='testuser', password='testpass')
        self.pet = Pet.objects.create(name='Buddy', breed='Golden Retriever', age=3, owner=self.user)

        # Create a sample reminder
        self.reminder = Reminder.objects.create(
            title="Vet Appointment",
            pet=self.pet,
            date="2023-06-20T10:30:00Z",
            is_completed=False,
            user=self.user
        )

        # Define API URLs
        self.reminder_list_url = '/api/reminders/'
        self.reminder_detail_url = f'/api/reminders/{self.reminder.id}/'

    def test_get_all_reminders(self):
        response = self.client.get(self.reminder_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Vet Appointment')

    def test_create_reminder(self):
        data = {
            'title': 'Grooming Session',
            'pet': self.pet.id,
            'date': '2023-06-25T15:00:00Z',
            'is_completed': False
        }
        response = self.client.post(self.reminder_list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'Grooming Session')
        self.assertEqual(response.data['pet'], self.pet.id)
        self.assertEqual(response.data['is_completed'], False)

    def test_get_reminder_details(self):
        response = self.client.get(self.reminder_detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Vet Appointment')

    def test_update_reminder(self):
        data = {
            'title': 'Vet Appointment Updated',
            'pet': self.pet.id,
            'date': '2023-06-21T11:00:00Z',
            'is_completed': True
        }
        response = self.client.put(self.reminder_detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Vet Appointment Updated')
        self.assertEqual(response.data['is_completed'], True)

    def test_delete_reminder(self):
        response = self.client.delete(self.reminder_detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Reminder.objects.filter(id=self.reminder.id).exists())
