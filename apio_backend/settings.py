# ====================================================================
# APIO BACKEND CONFIGURATION - SOTO SYSTEM GENERAL SETTINGS (2026)
# ====================================================================
import os
import dj_database_url
from pathlib import Path

# Base del directorio: /apio-ia/
BASE_DIR = Path(__file__).resolve().parent.parent

# ====================================================================
# ENRUTAMIENTO INTELIGENTE (REGLA DE GABRIEL CLOUD)
# ====================================================================
if "GEMINI_PRO_KEY" in os.environ:
    SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "django-insecure-cloud-production-key-soto-system")
    DEBUG = os.environ.get("DEBUG", "False") == "True"
    GEMINI_PRO_KEY = os.environ.get("GEMINI_PRO_KEY")
else:
    import environ
    env = environ.Env()
    env_path = BASE_DIR / 'apio-conciencia' / '.env'
    if env_path.exists():
        environ.Env.read_env(str(env_path))
    SECRET_KEY = "django-insecure-local-development-key"
    DEBUG = True
    GEMINI_PRO_KEY = env("GEMINI_PRO_KEY", default="")

os.environ["GEMINI_PRO_KEY"] = GEMINI_PRO_KEY

# ====================================================================
# CONFIGURACIÓN DE RED Y SEGURIDAD
# ====================================================================
ALLOWED_HOSTS = ['apio-daniela-core-production.up.railway.app', 'apio-backend-core-production.up.railway.app', '127.0.0.1', 'localhost', '*']

# ====================================================================
# APLICACIONES E INTEGRACIÓN ASGI/DAPHNE
# ====================================================================
INSTALLED_APPS = [
    'daphne',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',  
    'channels', 
    'chat', 
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware', 
    'django.contrib.messages.middleware.MessageMiddleware',       
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'apio_backend.urls'

# ====================================================================
# PLANTILLAS (CORREGIDO PARA EL PANEL ADMIN)
# ====================================================================
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request', # 🚀 CORRECCIÓN: Soluciona error admin.E403
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
# DATABASE - POSTGRESQL (LOCAL / NUBE HÍBRIDA)
# ====================================================================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'apio_bodega', 
        'USER': 'postgres',
        'PASSWORD': 'Daniela.14',
        'HOST': '127.0.0.1',
        'PORT': '5433', 
    }
}

if os.environ.get("DATABASE_URL"):
    DATABASES["default"] = dj_database_url.config(conn_max_age=600, ssl_require=False)

# ====================================================================
# CONFIGURACIÓN DE MEDIOS Y AUDIO
# ====================================================================
STATIC_URL = 'static/'
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

LANGUAGE_CODE = 'es-ve'
TIME_ZONE = 'America/Caracas'
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
