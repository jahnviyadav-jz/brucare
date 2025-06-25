from django.urls import path
from . import views

urlpatterns = [
    path('', views.ReminderList.as_view(), name='reminder_list'),  # List or create reminders
    path('<int:pk>/', views.ReminderDetail.as_view(), name='reminder_detail'),  # Retrieve, update, or delete a specific reminder
]

