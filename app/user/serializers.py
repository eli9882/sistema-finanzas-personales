"""Serializers para API View Usuarios."""
from django.contrib.auth import (
    get_user_model,
    authenticate,
)

from django.utils.translation import gettext as _

from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    """Serializer para el objeto usuario."""

    class Meta:
        model = get_user_model()
        fields = ['email', 'password', 'name']
        extra_kwargs = {'password': {'write_only': True, 'min_length': 5}}

    def create(self, validated_data):
        """Crea y devuelve un usuario con contraseña encriptada.."""
        return get_user_model().objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        """Actualizar y devolver usuario."""
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)

        if password:
            user.set_password(password)
            user.save()

        return user


class AuthTokenSerializer(serializers.Serializer):
    """Serializador del token de autenticación del usuario."""
    email = serializers.EmailField()
    password = serializers.CharField(
        style={'input_type': 'password'},
        trim_whitespace=False,
    )

    def validate(self, attrs):
        """Validar y autenticar al usuario."""
        email = attrs.get('email')
        password = attrs.get('password')

        # Buscamos si existe el usuario
        UserModel = get_user_model()
        try:
            user_obj = UserModel.objects.get(email=email)
        except UserModel.DoesNotExist:
            user_obj = None

        if user_obj and not user_obj.is_active:
            msg = _(
                'Su cuenta está desactivada. '
                'Por favor comuníquese con soporte.'
            )

            raise serializers.ValidationError(msg, code='authorization')

        # Si no está desactivada, intentamos autenticar normalmente
        user = authenticate(
            request=self.context.get('request'),
            username=email,
            password=password,
        )

        if not user:
            msg = _('Unable to authenticate with provided credentials.')
            raise serializers.ValidationError(msg, code='authorization')

        attrs['user'] = user
        return attrs
