from django.urls import path
from . import views # Importamos el módulo completo para usar views.nombre_funcion

urlpatterns = [
    # Esta es la ruta exacta que Node.js está consultando desde el puerto 3001
    # Asegúrate de que termine en '/' para evitar redirecciones 301 que causen errores
    path('api/chat/preguntar/', views.respuesta_apio, name='preguntar'),
]
