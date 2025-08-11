"""
Asignaciones de URL para la API de usuario.
"""
from django.urls import path, include

from user import views


app_name = 'user'

urlpatterns = [
    path('create/', views.CreateUserView.as_view(), name='create'),
    path('token/', views.CreateTokenView.as_view(), name='token'),
    path('me/', views.ManageUserView.as_view(), name='me'),
    path('deactivate/', views.DeactivateUserView.as_view(), name='deactivate'),
    path(
        'password-reset/',
        include('django_rest_passwordreset.urls', namespace='password_reset')
    ),
]
