from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from core.models import User
from categories.models import Categoria


class CategoriaAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Crear usuarios
        self.user1 = User.objects.create_user(
            email='user1@example.com',
            password='pass123'
        )
        self.user2 = User.objects.create_user(
            email='user2@example.com',
            password='pass123'
        )

        # Autenticar cliente con user1 por defecto
        self.client.force_authenticate(user=self.user1)

        # Crear categorías para user1 y user2
        self.cat1 = Categoria.objects.create(
            nombre='Comida',
            tipo='Gasto',
            descripcion='Gastos en comida',
            usuario=self.user1
        )
        self.cat2 = Categoria.objects.create(
            nombre='Salario',
            tipo='Ingreso',
            descripcion='Ingreso mensual',
            usuario=self.user2
        )

        # URLs
        self.list_url = reverse('categoria-list-create')
        self.detail_url = lambda pk: reverse('categoria-detail', args=[pk])

    def test_list_categorias_usuario_autenticado(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Solo categorías de user1
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['nombre'], 'Comida')

    def test_no_ver_categorias_de_otros_usuarios(self):
        response = self.client.get(self.list_url)
        nombres = [cat['nombre'] for cat in response.data]
        self.assertNotIn('Salario', nombres)

    def test_crear_categoria_correctamente(self):
        data = {
            'nombre': 'Transporte',
            'tipo': 'Gasto',
            'descripcion': 'Gasto en transporte'
        }
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            Categoria.objects.filter(usuario=self.user1).count(),
            2
        )

    def test_crear_categoria_falla_si_nombre_repetido_mismo_usuario(self):
        data = {
            'nombre': 'Comida',
            'tipo': 'Gasto',
            'descripcion': 'Duplicado'
        }
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('nombre', response.data)

    def test_categoria_permite_nombre_igual_entre_usuarios_distintos(self):
        # Cambiar autenticación a user2
        self.client.force_authenticate(user=self.user2)
        data = {
            'nombre': 'Comida',
            'tipo': 'Gasto',
            'descripcion': 'No importa'
        }
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_obtener_categoria(self):
        url = self.detail_url(self.cat1.pk)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nombre'], 'Comida')

    def test_actualizar_categoria(self):
        url = self.detail_url(self.cat1.pk)
        data = {
            'nombre': 'Supermercado',
            'tipo': 'Gasto',
            'descripcion': 'Actualizado'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.cat1.refresh_from_db()
        self.assertEqual(self.cat1.nombre, 'Supermercado')

    def test_eliminar_categoria(self):
        url = self.detail_url(self.cat1.pk)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Categoria.objects.filter(pk=self.cat1.pk).exists())

    def test_usuario_no_puede_ver_categoria_ajena(self):
        url = self.detail_url(self.cat2.pk)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_usuario_no_puede_modificar_categoria_ajena(self):
        url = self.detail_url(self.cat2.pk)
        data = {
            'nombre': 'No autorizado',
            'tipo': 'Ingreso',
            'descripcion': 'Modificación prohibida'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_usuario_no_puede_eliminar_categoria_ajena(self):
        url = self.detail_url(self.cat2.pk)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_anonymous_user_no_accede_api(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.list_url)
        self.assertIn(
            response.status_code,
            [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN]
        )

    def test_crear_categoria_falla_si_faltan_campos(self):
        data = {'nombre': '', 'descripcion': ''}
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('nombre', response.data)
        self.assertIn('tipo', response.data)
