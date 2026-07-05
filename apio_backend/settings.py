# ====================================================================
# APIO BACKEND CONFIGURATION - SOTO SYSTEM GENERAL SETTINGS (2026)
# Ubicación: apio_backend/settings.py (Versión Final de Producción)
# ====================================================================
import os
import environ # 🚀 INYECCIÓN MAESTRA: Activa el lector de variables
from pathlib import Path

# Base del directorio de Django (apio-ia/)
BASE_DIR = Path(__file__).resolve().parent.parent

# 🚀 ENRUTAMIENTO INDESTRUCTIBLE CON PATH (REGLA DE GABRIEL)
# Le dice de forma nativa a Python: "Busca la carpeta apio-conciencia y abre el .env"
env = environ.Env()
environ.Env.read_env(str(BASE_DIR / 'apio-conciencia' / '.env'))

# Setea la variable en el entorno global de la RAM
os.environ["GEMINI_PRO_KEY"] = env("GEMINI_PRO_KEY", default="")

# ====================================================================
# CONFIGURACIÓN DE RED AMPLIVOLTAICA (ALLOWED HOSTS)
# ====================================================================
# Permite que la IP local de tu computadora en la red Wi-Fi y tu APK de Android se conecten sin rechazo
ALLOWED_HOSTS = ['127.0.0.1', 'localhost', 'soto_system_app', '*']

# ====================================================================
# APPLICATION DEFINITION (INSTALLED APPS REFORZADO CON WEBSOCKETS)
# ====================================================================
INSTALLED_APPS = [
    'daphne',  # 🚀 CRÍTICO: Debe ser el primero absoluto en la lista para domar el puerto 8000
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',  
    'chat', 
]

# ====================================================================
# MIDDLEWARE CON INTERCEPTOR DE CORS (REVISIÓN DE FLUJO)
# ====================================================================
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # 🚀 DEBE IR DE PRIMERO ABSOLUTO para interceptar peticiones de Expo
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware', 
    'django.contrib.messages.middleware.MessageMiddleware',       
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'apio_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# 🚀 SECCIÓN DE APLICACIÓN ASÍNCRONA UNIFICADA (SIN DUPLICADOS)
WSGI_APPLICATION = 'apio_backend.wsgi.application'
ASGI_APPLICATION = 'apio_backend.asgi.application' # Enrutador maestro para los WebSockets de Apio SaaS

# ====================================================================
# POLÍTICAS DE PERMISOS CORS (SOTO SYSTEM DIRECTIVE)
# ====================================================================
CORS_ALLOW_ALL_ORIGINS = True  # Abre los canales para que tu frontend móvil de Expo hable directo con el backend
CORS_ALLOW_CREDENTIALS = True

# ====================================================================
# DATABASE - CONFIGURACIÓN POSTGRESQL (SINCRONIZADA CON EL PUERTO REAL DOCKER)
# ====================================================================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'postgres',
        'USER': 'postgres',
        'PASSWORD': 'Daniela.14',
        'HOST': '127.0.0.1',
        'PORT': '5433', # 🚀 CORRECCIÓN CRÍTICA: Mapeo exacto de tu Docker Desktop
    }
}

# ====================================================================
# CONFIGURACIÓN DE MEDIOS Y ALMACENAMIENTO DE AUDIO (BLOQUE MULTIMEDIA)
# ====================================================================
STATIC_URL = 'static/'
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Configuración de Idioma y Zona Horaria para el Reloj Emocional de Daniela en Venezuela
LANGUAGE_CODE = 'es-ve'
TIME_ZONE = 'America/Caracas'
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
