# events/models.py
from django.db import models
from core.models import User
from categories.models import Categoria

class EventoFinanciero(models.Model):
    TIPO_CHOICES = [
        ('Ingreso', 'Ingreso'),
        ('Gasto', 'Gasto'),
        # puedes añadir más tipos si quieres
    ]

    tipo = models.CharField(max_length=45, choices=TIPO_CHOICES)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    fecha = models.DateField()
    descripcion = models.CharField(max_length=150)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='eventos')
    categorias = models.ManyToManyField(Categoria, through='CategoriaEvento', related_name='eventos')

    def __str__(self):
        return f"{self.tipo} - {self.monto} ({self.fecha})"

class CategoriaEvento(models.Model):
    evento = models.ForeignKey(EventoFinanciero, on_delete=models.CASCADE)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('evento', 'categoria')

    def __str__(self):
        return f"{self.evento} - {self.categoria}"
