from rest_framework import serializers
from .models import Categoria

class CategoriaSerializer(serializers.ModelSerializer):
    # El campo 'tipo' hereda el 'choices' del modelo y es requerido por defecto
    tipo = serializers.ChoiceField(choices=Categoria.TIPO_CHOICES, required=True)

    class Meta:
        model = Categoria
        fields = ['id', 'tipo', 'nombre', 'descripcion']
        read_only_fields = ['id']

    def validate_nombre(self, value):
        user = self.context['request'].user
        qs = Categoria.objects.filter(nombre=value, usuario=user)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Ya tienes una categoría con este nombre.")
        return value

    def create(self, validated_data):
        # Asocia la categoría al usuario autenticado
        validated_data['usuario'] = self.context['request'].user
        return super().create(validated_data)

