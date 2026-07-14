# ====================================================================
# SOTO SYSTEM CENTRAL ASYNC INTEGRATION (ASGI APP BLINDADA - REPARADA)
# Ubicación: apio_backend/asgi.py
# ====================================================================
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'apio_backend.settings')

# 🚀 PASO 1: Inicializamos la aplicación HTTP y forzamos a Django a cargar todos sus módulos y modelos primero
django_asgi_app = get_asgi_application()

# 🚀 PASO 2: Importación diferida segura. Ahora que Django está listo, podemos importar las rutas sin romper la RAM
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

