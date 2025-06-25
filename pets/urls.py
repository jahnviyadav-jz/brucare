from django.urls import path
from . import views

urlpatterns = [
    path('', views.PetList.as_view(), name='pet_list'),  # List or create pets
    path('<int:pk>/', views.PetDetail.as_view(), name='pet_detail'),  # Retrieve, update, or delete a specific pet
]
