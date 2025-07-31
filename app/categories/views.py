from rest_framework import permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.generics import ListCreateAPIView
from .models import Categoria
from .serializers import CategoriaSerializer

class CategoriaListCreateView(ListCreateAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Esto asegura que cada usuario vea solo sus categorías
        return Categoria.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        # Asocia automáticamente la categoría al usuario autenticado
        serializer.save(usuario=self.request.user)

class CategoriaRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [IsAuthenticated]