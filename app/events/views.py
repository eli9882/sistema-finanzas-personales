from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import EventoFinanciero
from .serializers import EventoFinancieroSerializer


class EventoFinancieroViewSet(viewsets.ModelViewSet):
    serializer_class = EventoFinancieroSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Solo eventos del usuario autenticado
        return EventoFinanciero.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        # Asigna el usuario autenticado al crear
        serializer.save(usuario=self.request.user)