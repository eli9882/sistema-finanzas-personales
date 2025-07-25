from rest_framework import serializers
from .models import EventoFinanciero
from categories.models import Categoria


class EventoFinancieroSerializer(serializers.ModelSerializer):
    categoria = serializers.PrimaryKeyRelatedField(
        queryset=Categoria.objects.all(), write_only=True
    )

    class Meta:
        model = EventoFinanciero
        fields = ['id', 'tipo', 'monto', 'fecha', 'descripcion', 'usuario', 'categoria']

    def create(self, validated_data):
        categoria = validated_data.pop('categoria')
        evento = EventoFinanciero.objects.create(**validated_data)
        evento.categorias.set([categoria])
        return evento

    def update(self, instance, validated_data):
        categoria = validated_data.pop('categoria', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if categoria:
            instance.categorias.set([categoria])
        return instance
