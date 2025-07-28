from rest_framework import serializers
from .models import EventoFinanciero
from categories.models import Categoria


class EventoFinancieroSerializer(serializers.ModelSerializer):
    categorias = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Categoria.objects.all()
    )

    class Meta:
        model = EventoFinanciero
        fields = ['id', 'tipo', 'monto', 'fecha', 'descripcion', 'usuario', 'categorias']
        read_only_fields = ['usuario']

    def create(self, validated_data):
        categorias = validated_data.pop('categorias', [])
        evento = EventoFinanciero.objects.create(**validated_data)
        evento.categorias.set(categorias)
        return evento

    def update(self, instance, validated_data):
        categorias = validated_data.pop('categorias', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if categorias is not None:
            instance.categorias.set(categorias)
        return instance
