from django.urls import path
from .views import CategoriaListCreateView, CategoriaRetrieveUpdateDestroyView

urlpatterns = [
    path('', CategoriaListCreateView.as_view(), name='categoria-list-create'),
    path('<int:pk>/', CategoriaRetrieveUpdateDestroyView.as_view(), name="categoria-detail"),
    ]