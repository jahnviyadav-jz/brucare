from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Reminder
from .serializers import ReminderSerializer

class ReminderList(APIView):
    permission_classes = [IsAuthenticated]  # Only authenticated users can access

    def get(self, request):
        # Fetch all reminders for the logged-in user
        reminders = Reminder.objects.filter(user=request.user)
        serializer = ReminderSerializer(reminders, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Create a new reminder
        serializer = ReminderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)  # Automatically associate the user
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class ReminderDetail(APIView):
    permission_classes = [IsAuthenticated]  # Only authenticated users can access

    def get(self, request, pk):
        # Fetch a specific reminder
        reminder = get_object_or_404(Reminder, pk=pk, user=request.user)
        serializer = ReminderSerializer(reminder)
        return Response(serializer.data)

    def put(self, request, pk):
        # Update a specific reminder
        reminder = get_object_or_404(Reminder, pk=pk, user=request.user)
        serializer = ReminderSerializer(reminder, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        # Delete a specific reminder
        reminder = get_object_or_404(Reminder, pk=pk, user=request.user)
        reminder.delete()
        return Response({"message": "Reminder deleted successfully"}, status=204)

