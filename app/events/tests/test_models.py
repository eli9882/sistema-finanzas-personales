from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from datetime import date

from core.models import User
from categories.models import Categoria
from events.models import EventoFinanciero


class EventoFinancieroTests(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()

        # Crear usuario
        cls.user = User.objects.create_user(
            email='test@example.com',
            password='testpass',
            name='Test User'
        )

        # Crear categoría
        cls.categoria = Categoria.objects.create(nombre='Transporte')

    def setUp(self):
        # Autenticación del cliente
        self.client.force_authenticate(user=self.user)

        # Datos base para crear eventos
        self.evento_data = {
            'tipo': 'Gasto',
            'monto': '2500.00',
            'fecha': str(date.today()),
            'descripcion': 'Pago de bus',
            'usuario': self.user.id,
            'categorias': [self.categoria.id]  # Relación ManyToMany
        }

    def test_crear_evento(self):
        """Debe crear un evento financiero con éxito"""
        response = self.client.post(reverse('evento-crud'), self.evento_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(EventoFinanciero.objects.count(), 1)
        evento = EventoFinanciero.objects.first()
        self.assertEqual(evento.descripcion, 'Pago de bus')
        self.assertIn(self.categoria, evento.categorias.all())

    def test_listar_eventos(self):
        """Debe listar los eventos del usuario"""
        evento = EventoFinanciero.objects.create(
            tipo='Ingreso',
            monto=1500.00,
            fecha=date.today(),
            descripcion='Salario',
            usuario=self.user
        )
        evento.categorias.set([self.categoria])

        response = self.client.get(reverse('evento-crud'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_obtener_evento(self):
        """Debe obtener un evento específico"""
        evento = EventoFinanciero.objects.create(
            tipo='Gasto',
            monto=2000.00,
            fecha=date.today(),
            descripcion='Comida',
            usuario=self.user
        )
        evento.categorias.set([self.categoria])

        url = reverse('evento-detail', kwargs={'pk': evento.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['descripcion'], 'Comida')

    def test_actualizar_evento(self):
        """Debe actualizar parcialmente un evento"""
        evento = EventoFinanciero.objects.create(
            tipo='Gasto',
            monto=2000.00,
            fecha=date.today(),
            descripcion='Taxi',
            usuario=self.user
        )
        evento.categorias.set([self.categoria])

        nueva_categoria = Categoria.objects.create(nombre='Salud')

        url = reverse('evento-detail', kwargs={'pk': evento.id})
        patch_data = {
            'descripcion': 'Uber',
            'categorias': [nueva_categoria.id]
        }

        response = self.client.patch(url, patch_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        evento.refresh_from_db()
        self.assertEqual(evento.descripcion, 'Uber')
        self.assertIn(nueva_categoria, evento.categorias.all())

    def test_eliminar_evento(self):
        """Debe eliminar un evento existente"""
        evento = EventoFinanciero.objects.create(
            tipo='Gasto',
            monto=1000.00,
            fecha=date.today(),
            descripcion='Internet',
            usuario=self.user
        )
        evento.categorias.set([self.categoria])

        url = reverse('evento-detail', kwargs={'pk': evento.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(EventoFinanciero.objects.filter(pk=evento.id).exists())
