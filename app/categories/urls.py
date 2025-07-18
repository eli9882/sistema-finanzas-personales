from django.urls import path
from .views import CategoriaListCreateView

urlpatterns = [
    path('categorias/', CategoriaListCreateView.as_view(), name='categoria-list-create'),
]