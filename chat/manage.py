#!/usr/bin/env python
# ====================================================================
# SOTO SYSTEM - UTILDAD ADMINISTRATIVA INTERNA REUBICADA
# Ubicación: chat/manage.py (Versión Adaptada para Subcarpetas)
# ====================================================================
import os
import sys
import os.path

def main():
    """Ejecuta tareas administrativas de Django desde la carpeta chat."""
    
    # 🚀 ENGRANAJE DE DETECCIÓN SOTO SYSTEM:
    # Calculamos la ruta absoluta de la raíz del proyecto (un nivel arriba de 'chat/')
    ruta_actual = os.path.dirname(os.path.abspath(__file__))
    ruta_raiz_proyecto = os.path.dirname(ruta_actual)
    
    # Inyectamos la raíz en el PYTHONPATH del sistema operativo antes de levantar Django
    if ruta_raiz_proyecto not in sys.path:
        sys.path.insert(0, ruta_raiz_proyecto)

    # Establecemos el puntero hacia tus configuraciones principales
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'apio_backend.settings')
    
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "No se pudo importar Django. ¿Aseguraste su instalación en Railway? "
            "Verifica que el entorno virtual esté activo y el PYTHONPATH alineado."
        ) from exc
        
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
