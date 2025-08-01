from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import send_mail
from django.dispatch import receiver


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, **kwargs):
    email = reset_password_token.user.email
    token = reset_password_token.key
    reset_url = f"http://localhost:5173/reset-password?token={token}"

    send_mail(
        subject="Recuperar contraseña",
        message=(
            "Hola, usa este enlace para restablecer tu contraseña:\n\n"
            f"{reset_url}"
        ),
        from_email="pruebapruebaemail74@gmail.com",
        recipient_list=[email],
        fail_silently=False,
    )
