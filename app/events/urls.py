from django.urls import path
from .views import EventoFinancieroViewSet

urlpatterns = [
    path('', EventoFinancieroViewSet.as_view({'get': 'list', 'post': 'create'}),
          name='evento-crud'),
    path('<int:pk>/', EventoFinancieroViewSet.as_view({
        'get': 'retrieve', 'patch': 'partial_update',
          'delete': 'destroy'}), name='evento-detail'),
]
