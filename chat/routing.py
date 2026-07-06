# ====================================================================
# SOTO SYSTEM LOCAL ASYNC ROUTING (ENRUTADOR DE ENDPOINTS WEBSOCKET)
# Ubicación: chat/routing.py (Solución Final Absoluta)
# ====================================================================
from django.urls import re_path
from .consumers import ApioBrainConsumer # 🚀 IMPORTACIÓN DIRECTA

websocket_urlpatterns = [
    # Asegúrate de que esta expresión regular coincida con lo que esperas en tu frontend
    re_path(r'ws/chat/(?P<session_id>[\w-]+)/$', ApioBrainConsumer.as_asgi()),
]
