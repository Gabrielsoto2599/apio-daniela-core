# ====================================================================
# APIO BACKEND CONFIGURATION - SOTO SYSTEM GENERAL SETTINGS (2026)
# Ubicación: apio_backend/settings.py (Versión Híbrida de Producción)
# ====================================================================
import os
import dj_database_url  # 🚀 LLAVE MAESTRA: Traduce las URLs de bases de datos de la nube
from pathlib import Path

# Base del directorio de Django
BASE_DIR = Path(__file__).resolve().parent.parent

# ====================================================================
# ENRUTAMIENTO INTELIGENTE DE VARIABLES (REGLA DE GABRIEL CLOUD)
# ====================================================================
# Si Railway ya inyectó las variables en el entorno global de Linux, las toma directo de la RAM.
# Si estás en tu PC, viaja a la carpeta local a buscar el archivo de configuración.
if "GEMINI_PRO_KEY" in os.environ:
    SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "django-insecure-cloud-production-key-soto-system")
    DEBUG = os.environ.get("DEBUG", "False") == "True"
    GEMINI_PRO_KEY = os.environ.get("GEMINI_PRO_KEY")
else:
    # Soporte de respaldo para tu entorno de desarrollo local en Windows
    import environ
    env = environ.Env()
    environ.Env.read_env(str(BASE_DIR / 'apio-conciencia' / '.env'))
    SECRET_KEY = "django-insecure-local-development-key"
    DEBUG = True
    GEMINI_PRO_KEY = env("GEMINI_PRO_KEY", default="")

# Asegura que quede inyectada en la RAM global para tus views.py
os.environ["GEMINI_PRO_KEY"] = GEMINI_PRO_KEY

# ====================================================================
# CONFIGURACIÓN DE RED AMPLIVOLTAICA (ALLOWED HOSTS)
# ====================================================================
# Abrimos las compuertas para tu localhost, tu IP de Wi-Fi y los dominios de Railway
ALLOWED_HOSTS = ['127.0.0.1', 'localhost', 'soto_system_app', '.railway.app', '*']

# ====================================================================
# APPLICATION DEFINITION (INSTALLED APPS REFORZADO CON WEBSOCKETS)
# ====================================================================
INSTALLED_APPS = [
    'daphne',  # 🚀 CRÍTICO: Debe ser el primero absoluto para domar el puerto de producción
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',  
    'chat', 
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # 🚀 DEBE IR DE PRIMERO ABSOLUTO para interceptar a Expo y Node
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

WSGI_APPLICATION = 'apio_backend.wsgi.application'
ASGI_APPLICATION = 'apio_backend.asgi.application'

CORS_ALLOW_ALL_ORIGINS = True  
CORS_ALLOW_CREDENTIALS = True

# ====================================================================
# DATABASE - CONFIGURACIÓN POSTGRESQL AUTOCONFIGURABLE DESDE LA NUBE
# ====================================================================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'postgres',
        'USER': 'postgres',
        'PASSWORD': 'Daniela.14',
        'HOST': '127.0.0.1',
        'PORT': '5433', 
    }
}

# 🚀 INTERCEPTOR INDUSTRIAL DE RED: Si Railway inyecta una base de datos en el panel,
# Django borra la configuración de arriba y se conecta al Postgres eterno de internet automáticamente.
if os.environ.get("DATABASE_URL"):
    DATABASES["default"] = dj_database_url.config(conn_max_age=600, ssl_require=False)

# ====================================================================
# CONFIGURACIÓN DE MEDIOS Y ALMACENAMIENTO DE AUDIO (BLOQUE MULTIMEDIA)
# ====================================================================
STATIC_URL = 'static/'
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

LANGUAGE_CODE = 'es-ve'
TIME_ZONE = 'America/Caracas'
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
