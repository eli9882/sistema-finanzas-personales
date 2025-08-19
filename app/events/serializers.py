from rest_framework import serializers
from .models import EventoFinanciero
from categories.models import Categoria


class EventoFinancieroSerializer(serializers.ModelSerializer):
    categoria = serializers.PrimaryKeyRelatedField(
        queryset=Categoria.objects.all()
    )

    class Meta:
        model = EventoFinanciero
        fields = [
            'id',
            'tipo',
            'monto',
            'fecha',
            'descripcion',
            'usuario',
            'categoria',
        ]
        read_only_fields = ['usuario']

    def create(self, validated_data):
        return EventoFinanciero.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
