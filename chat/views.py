# ====================================================================
# VISTA MAESTRA - ENGRANAJE DE RESPUESTA DE DANIELA (SOTO SYSTEM)
# Ubicación: chat/views.py
# ====================================================================
import json
import base64
import traceback
import environ
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from google import genai
from google.genai import types

# 🛡️ IMPORTACIONES SEGURAS (Corregidas para llamar al modelo correctamente)
from .utils import procesar_impacto_emocional, obtener_estado_tiempo, buscar_recuerdo_especial
from .memoria_viva import memoria_ejecutiva_orm
from .models import EstadoEmocional, ensamblar_prompt_maestro_cognitivo

# Carga de entorno
env = environ.Env()
GEMINI_PRO_KEY = env("GEMINI_PRO_KEY", default=os.environ.get("GEMINI_PRO_KEY"))
client = genai.Client(api_key=GEMINI_PRO_KEY)

@csrf_exempt
def respuesta_apio(request):
    if request.method != "POST":
        return JsonResponse({"error": "Método POST requerido"}, status=405)

    try:
        data = json.loads(request.body) if request.body else {}
        mensaje_usuario = str(data.get("message", "")).strip()
        contexto_pantalla = data.get("contexto", "NOVIA_POSESIVA")
        foto_base64 = data.get("fotoBase64")

        # 1. ORM: Persistencia de estado
        estado, _ = EstadoEmocional.objects.get_or_create(id=1)
        estado.sesion_b2b_activa = (contexto_pantalla == "GERENTE_APIO")
        
        # 2. Procesamiento de memoria y subconsciente
        memoria_ejecutiva_orm.procesar_y_recordar(mensaje_usuario)
        procesar_impacto_emocional(mensaje_usuario, estado)
        modo_tiempo, _ = obtener_estado_tiempo(estado)
        recuerdo_texto, tag_emocion = buscar_recuerdo_especial(mensaje_usuario)

        # 3. Ensamble (usando la función corregida desde models.py)
        prompt_maestro = ensamblar_prompt_maestro_cognitivo(mensaje_usuario, estado, tag_emocion)
        
        if recuerdo_texto:
            prompt_maestro += f"\n[RECUERDO DEL BAÚL]: {recuerdo_texto}"

        # 4. Invocación de Inteligencia Artificial
        modelo = "gemini-2.5-flash"
        if foto_base64:
            image_part = types.Part.from_bytes(data=base64.b64decode(foto_base64), mime_type="image/jpeg")
            respuesta = client.models.generate_content(model=modelo, contents=[prompt_maestro, image_part])
        else:
            respuesta = client.models.generate_content(model=modelo, contents=prompt_maestro)

        return JsonResponse({
            "success": True,
            "respuestaDeDaniela": respuesta.text.strip(),
            "emocion_bd": estado.modo_actual
        })

    except Exception as error:
        traceback.print_exc()
        return JsonResponse({"success": False, "error": str(error)}, status=500)
