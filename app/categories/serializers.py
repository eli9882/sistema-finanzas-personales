from rest_framework import serializers
from .models import Categoria


class CategoriaSerializer(serializers.ModelSerializer):
    """
    Serializador para crear, listar, actualizar y eliminar categorías.
    Valida que el nombre sea único por usuario y automáticamente asocia
    la categoría al usuario autenticado en el método `create`.
    """

    class Meta:
        model = Categoria
        # Campos expuestos en la API
        fields = ["id", "nombre", "descripcion"]
        read_only_fields = ["id"]  # el ID lo maneja la BD

    # --- Validación de nombre único por usuario -------------------------
    def validate_nombre(self, value: str) -> str:
        """
        Evita que el usuario cree dos categorías con el mismo nombre.
        """
        user = self.context["request"].user
        # Para operaciones de actualización, excluye la propia instancia
        qs = Categoria.objects.filter(nombre=value, usuario=user)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)

        if qs.exists():
            raise serializers.ValidationError(
                "Ya tienes una categoría con este nombre."
            )
        return value

    # --- Creación: vincular categoría al usuario -------------------------
    def create(self, validated_data):
        """
        Asocia la nueva categoría con el usuario que hace la petición
        sin que el cliente tenga que enviar el campo `usuario`.
        """
        validated_data["usuario"] = self.context["request"].user
        return super().create(validated_data)
from .models import Categoria


class CategoriaSerializer(serializers.ModelSerializer):
    """
    Serializador para crear, listar, actualizar y eliminar categorías.
    Valida que el nombre sea único por usuario y automáticamente asocia
    la categoría al usuario autenticado en el método `create`.
    """

    class Meta:
        model = Categoria
        # Campos expuestos en la API
        fields = ["id", "nombre", "descripcion"]
        read_only_fields = ["id"]  # el ID lo maneja la BD

    # --- Validación de nombre único por usuario -------------------------
    def validate_nombre(self, value: str) -> str:
        """
        Evita que el usuario cree dos categorías con el mismo nombre.
        """
        user = self.context["request"].user
        # Para operaciones de actualización, excluye la propia instancia
        qs = Categoria.objects.filter(nombre=value, usuario=user)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)

        if qs.exists():
            raise serializers.ValidationError(
                "Ya tienes una categoría con este nombre."
            )
        return value

    # --- Creación: vincular categoría al usuario -------------------------
    def create(self, validated_data):
        """
        Asocia la nueva categoría con el usuario que hace la petición
        sin que el cliente tenga que enviar el campo `usuario`.
        """
        validated_data["usuario"] = self.context["request"].user
        return super().create(validated_data)