from django.contrib.auth.apps import AuthConfig

class CustomAuthConfig(AuthConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    verbose_name = 'Users'