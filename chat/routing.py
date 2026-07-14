# ====================================================================
# SOTO SYSTEM LOCAL ASYNC ROUTING (CORREGIDO Y ALINEADO CON CONSUMERS)
# Ubicación: chat/routing.py
# ====================================================================
from django.urls import re_path
from .consumers import ApioVinculacionConsumer # 🚀 Apunta a tu antena real de vinculación

websocket_urlpatterns = [
    # Usamos 'caja_id' para que machee al 100% con tu consumidor asíncrono
    re_path(r'^ws/chat/(?P<caja_id>[\w-]+)/$', ApioVinculacionConsumer.as_asgi()),
]
