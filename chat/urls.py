# ====================================================================
# ENRUTADOR COGNITIVO LOCAL - PUENTE FRONTEND EXPO (SOTO SYSTEM 2026)
# Ubicación: chat/urls.py
# ====================================================================
from django.urls import path
from . import views # Importamos las vistas locales

urlpatterns = [
    # 🚀 RUTA DEFINITIVA UNIFICADA: 
    # Asegúrate de incluir la barra diagonal al final (/) para evitar redirecciones 301
    path('api/chat/', views.respuesta_apio, name='chat_maestro'),
]