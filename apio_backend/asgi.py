# ====================================================================
# SOTO SYSTEM CENTRAL ASYNC INTEGRATION (ASGI APP BLINDADA)
# Ubicación: apio_backend/asgi.py
# ====================================================================
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'apio_backend.settings')

# Inicializamos la aplicación HTTP básica de Django
django_asgi_app = get_asgi_application()

# Importaremos las rutas de sockets locales de tu aplicación de chat
import chat.routing

# Enrutador maestro por protocolo
application = ProtocolTypeRouter({
    # Canal convencional para peticiones HTTP
    "http": django_asgi_app,
    
    # Canal en tiempo real para el control remoto y emparejamiento QR
    "websocket": AuthMiddlewareStack(
        URLRouter(
            chat.routing.websocket_urlpatterns
        )
    ),
})
