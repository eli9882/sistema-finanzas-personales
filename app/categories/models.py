# categories/models.py
from django.db import models
from core.models import User  # importas tu modelo personalizado


class Categoria(models.Model):
    TIPO_CHOICES = [
        ('Ingreso', 'Ingreso'),
        ('Gasto', 'Gasto'),
        # puedes añadir más tipos si quieres
    ]

    tipo = models.CharField(max_length=45, choices=TIPO_CHOICES)
    nombre = models.CharField(max_length=45)
    descripcion = models.CharField(max_length=150)
    usuario = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='categorias'
    )

    def __str__(self):
        return self.nombre
