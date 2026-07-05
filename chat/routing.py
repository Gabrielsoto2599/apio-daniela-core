# ====================================================================
# SOTO SYSTEM LOCAL ASYNC ROUTING (ENRUTADOR DE ENDPOINTS WEBSOCKET)
# Ubicación: chat/routing.py (Solución Final Absoluta)
# ====================================================================
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    # 🚀 CORRECCIÓN MAESTRA: Se cambió '.as_view()' por '.as_asgi()'
    # Mapea de forma legítima el flujo asíncrono para el código QR
    re_path(r'ws/apio/(?P<session_id>[\w-]+)/$', consumers.ApioBrainConsumer.as_asgi()),
]
