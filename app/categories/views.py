# views.py
from rest_framework import permissions
from rest_framework.generics import RetrieveUpdateDestroyAPIView, ListCreateAPIView
from .models import Categoria
from .serializers import CategoriaSerializer


class CategoriaListCreateView(ListCreateAPIView):
    serializer_class = CategoriaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Solo categorías del usuario actual
        return Categoria.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)


class CategoriaRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    serializer_class = CategoriaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Esto asegura que solo acceda a categorías propias
        return Categoria.objects.filter(usuario=self.request.user)
