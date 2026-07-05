# ====================================================================
# ENRUTADOR COGNITIVO LOCAL - PUENTE FRONTEND EXPO (SOTO SYSTEM 2026)
# Ubicación: cerebro/urls.py o chat/urls.py
# ====================================================================
from django.urls import path
from . import views  # Importamos el módulo completo de tus vistas unificadas

urlpatterns = [
    # 🚀 RUTA DEFINITIVA UNIFICADA: Procesa texto, notas de voz y fotos en un solo endpoint
    # Coincide exactamente con la llamada HTTP fetch del orquestador App.js
    path('api/chat/', views.respuesta_apio, name='chat_maestro'),
]

