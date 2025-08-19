from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from datetime import date
from core.models import User
from categories.models import Categoria
from events.models import EventoFinanciero


class EventoFinancieroTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Crear usuario
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass'
        )

        self.client.force_authenticate(user=self.user)

        # Crear categoría
        self.categoria = Categoria.objects.create(
            nombre='Transporte',
            tipo='Gasto',
            descripcion='Movilidad diaria',
            usuario=self.user
        )

        # Datos base para crear eventos
        self.evento_data = {
            'tipo': 'Gasto',
            'monto': '2500.00',
            'fecha': date.today(),
            'descripcion': 'Pago de bus',
            'categoria': self.categoria.id
        }

    def test_crear_evento(self):
        response = self.client.post(
            reverse('evento-crud'),
            self.evento_data,
            format='json'
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(EventoFinanciero.objects.count(), 1)

    def test_listar_eventos(self):
        EventoFinanciero.objects.create(
            tipo='Ingreso',
            monto=1500.00,
            fecha=date.today(),
            descripcion='Salario',
            usuario=self.user,
            categoria=self.categoria
        )
        response = self.client.get(reverse('evento-crud'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_obtener_evento(self):
        evento = EventoFinanciero.objects.create(
            tipo='Gasto',
            monto=2000.00,
            fecha=date.today(),
            descripcion='Comida',
            usuario=self.user,
            categoria=self.categoria
        )
        url = reverse('evento-detail', kwargs={'pk': evento.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['descripcion'], 'Comida')

    def test_actualizar_evento(self):
        evento = EventoFinanciero.objects.create(
            tipo='Gasto',
            monto=2000.00,
            fecha=date.today(),
            descripcion='Taxi',
            usuario=self.user,
            categoria=self.categoria
        )
        url = reverse('evento-detail', kwargs={'pk': evento.id})

        nueva_categoria = Categoria.objects.create(
            nombre='Salud',
            tipo='Gasto',
            descripcion='Visita médica',
            usuario=self.user
        )

        patch_data = {
            'descripcion': 'Uber',
            'categoria': nueva_categoria.id
        }

        response = self.client.patch(url, patch_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        evento.refresh_from_db()
        self.assertEqual(evento.descripcion, 'Uber')
        self.assertEqual(evento.categoria, nueva_categoria)

    def test_eliminar_evento(self):
        evento = EventoFinanciero.objects.create(
            tipo='Gasto',
            monto=1000.00,
            fecha=date.today(),
            descripcion='Internet',
            usuario=self.user,
            categoria=self.categoria
        )
        url = reverse('evento-detail', kwargs={'pk': evento.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(EventoFinanciero.objects.count(), 0)

    def test_user_cannot_access_others_event(self):
        other_user = User.objects.create_user(
            email='other@example.com',
            password='123456'
        )
        other_event = EventoFinanciero.objects.create(
            tipo='Gasto',
            monto=500,
            fecha=date.today(),
            descripcion='Otro evento',
            usuario=other_user,
            categoria=self.categoria
        )
        url = reverse('evento-detail', kwargs={'pk': other_event.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

    def test_anonymous_user_cannot_access_api(self):
        self.client.logout()
        url = reverse('evento-crud')
        response = self.client.get(url)
        self.assertIn(response.status_code, [401, 403])

    def test_create_event_with_empty_data(self):
        response = self.client.post(reverse('evento-crud'), {})
        self.assertEqual(response.status_code, 400)
        for field in ['tipo', 'monto', 'fecha', 'categoria']:
            self.assertIn(field, response.data)

    def test_get_nonexistent_event_returns_404(self):
        url = reverse(
            'evento-detail',
            kwargs={'pk': 99999}
        )

        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

    def test_update_event_with_invalid_data(self):
        event = EventoFinanciero.objects.create(
            tipo='Gasto',
            monto=1000,
            fecha=date.today(),
            descripcion='Prueba inválida',
            usuario=self.user,
            categoria=self.categoria
        )
        url = reverse('evento-detail', kwargs={'pk': event.id})

        data = {
            'monto': ''  # monto vacío no es válido
        }

        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('monto', response.data)
