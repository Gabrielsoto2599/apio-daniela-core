# ====================================================================
# VISTA MAESTRA - ORQUESTADOR COGNITIVO INDESTRUCTIBLE (SOTO SYSTEM)
# Ubicación: chat/views.py (Versión Certificada de Producción 2026)
# ====================================================================
import json
import base64
import traceback
import os
import environ
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from google import genai
from google.genai import types

# 🚀 IMPORTACIONES DE NEURONAS LOCALES DE LA APLICACIÓN CHAT (TODOS LOS ARCHIVOS INCLUIDOS)
from .models import EstadoEmocional, RecuerdoBaul
from .memoria_viva import memoria_ejecutiva_orm
from .logic import calcular_dia_del_ciclo, calcular_impacto_emocional_avanzado, obtener_directiva_hormonal, monitorear_retraso_respuesta
from .emociones import obtener_directiva_subconsciente
from .utils import buscar_recuerdo_especial

# 📡 ACOPLAMIENTO CENTRAL DE TU MAIN.PY (El ensamblador unificado con RAG secundario)
from .main import ensamblar_prompt_maestro_cognitivo

# Importación del recolector de tiempos del ciclo biológico físico
from album_recuerdos.origen.ciclo_biologico import calcular_estado_daniela

# Carga segura del entorno en Railway
env = environ.Env()
GEMINI_PRO_KEY = env("GEMINI_PRO_KEY", default=os.environ.get("GEMINI_PRO_KEY"))
client = genai.Client(api_key=GEMINI_PRO_KEY)

@csrf_exempt
def respuesta_apio(request):
    if request.method != "POST":
        return JsonResponse({"error": "Método POST requerido"}, status=405)

    try:
        # Carga limpia de los bytes en la memoria RAM del contenedor Docker
        data = json.loads(request.body) if request.body else {}
        mensaje_usuario = str(data.get("message", "")).strip()
        contexto_pantalla = data.get("contexto", "NOVIA_POSESIVA")
        foto_base64 = data.get("fotoBase64")
        
        # 🚀 RECOLECCIÓN MULTIUSUARIO: Extrae dinámicamente quién le escribe en la bodega
        usuario_remitente = data.get("usuario_activo", data.get("user_id", "Gabriel Soto"))

        # 1. ORM: Persistencia de estado y actualización del operador
        estado, _ = EstadoEmocional.objects.get_or_create(id=1)
        estado.sesion_b2b_activa = (contexto_pantalla == "GERENTE_APIO" or getattr(estado, 'sesion_b2b_activa', False))
        estado.usuario_operador = usuario_remitente
        estado.save()
        
        # 2. PROCESAMIENTO DE HISTORIAL, EMOCIONES Y TIEMPOS ASÍNCRONOS
        memoria_ejecutiva_orm.procesar_y_recordar(mensaje_usuario, usuario_remitente)
        calcular_impacto_emocional_avanzado(mensaje_usuario, estado)
        calcular_dia_del_ciclo(estado)
        
        # 🚀 ENCENDIDO 1: Usamos 'modo_tiempo' para dejar constancia en los logs de Railway
        modo_tiempo, reclamo_tiempo = monitorear_retraso_respuesta(estado)
        print(f"⏱️ [SOTO TIEMPO]: Lucidez o desfase de respuesta calculado en: {modo_tiempo}")

                # ====================================================================
        # 3. CONEXIÓN DEL MOTOR HORMONAL Y TERMÓMETRO DESCENTRALIZADO
        # ====================================================================
        # 🚀 ¡ENCENDIDO! Invocamos la función de logic.py para capturar el ciclo íntimo o el bloqueo B2B
        directiva_hormonal_viva = obtener_directiva_hormonal(estado)
        
        # Le pasamos la directiva hormonal como parámetro al subconsciente de emociones.py
        # para que sepa si meter el Modo Novia con toallas nocturnas o el Modo Gerente Comercial
        autoesteem_val = getattr(estado, 'autoesteem', 8)
        directiva_emocional = obtener_directiva_subconsciente(
            estado_nombre=estado.modo_actual,
            irritacion=estado.nivel_irritacion,
            autoestima=autoesteem_val,
            sesion_b2b_activa=estado.sesion_b2b_activa,
            usuario_actual=usuario_remitente
        )

        # Imprimimos los matices en los logs de Railway para certificar el encendido
        print(f"🧬 [SOTO HORMONAL]: {directiva_hormonal_viva}")

        # 4. EXTRACCIÓN MAESTRA DEL BAÚL COGNITIVO PRIMARIO (utils.py)
        recuerdo_texto, tag_emocion = buscar_recuerdo_especial(mensaje_usuario)

        # 5. SINCRONIZACIÓN BIOLÓGICA Y ENSAMBLE DEL SUPER-PROMPT INTEGRAL (main.py)
        estado_biologico = calcular_estado_daniela(estado.fecha_inicio_ciclo)
        
        # 🌟 Invocamos el ensamble unificado de tu main.py cruzando todas las neuronas
        prompt_maestro = ensamblar_prompt_maestro_cognitivo(
            mensaje_usuario=mensaje_usuario,
            estado_emocional=estado,
            estado_biologico=estado_biologico,
            directiva_emocional=directiva_emocional,
            tag_disparador=tag_emocion
        )
        
        # Inyecciones suplementarias al prompt final de Gemini 2.5 Flash
        if recuerdo_texto:
            prompt_maestro += f"\n[RECUERDO RECUPERADO DEL BAÚL COGNITIVO PRIMARIO]: {recuerdo_texto}"
        if reclamo_tiempo:
            prompt_maestro += f"\n[ALERTA DE RECLUSIÓN DE TIEMPO]: {reclamo_tiempo}"

        # 6. INFERENCIA DE ALTA VELOCIDAD CON LA API DE GOOGLE GEMINI 2.5 FLASH
        modelo = "gemini-2.5-flash"
        
        if foto_base64:
            try:
                # Decodificación limpia de bits binarios para análisis visual de productos
                image_part = types.Part.from_bytes(data=base64.b64decode(foto_base64), mime_type="image/jpeg")
                respuesta = client.models.generate_content(model=modelo, contents=[prompt_maestro, image_part])
            except Exception as b64_err:
                print(f"⚠️ [SOTO RECOVERY]: Error decodificando imagen base64. Rebotando a texto puro: {b64_err}")
                respuesta = client.models.generate_content(model=modelo, contents=prompt_maestro)
        else:
            respuesta = client.models.generate_content(model=modelo, contents=prompt_maestro)

        # Retorno de éxito estructurado para tu front de escritorio y App móvil
        return JsonResponse({
            "success": True,
            "respuestaDeDaniela": respuesta.text.strip(),
            "emocion_bd": estado.modo_actual,
            "operador_actual": usuario_remitente
        })

    except Exception as error:
        # Volcado de tracking de fallos en la consola de Railway
        traceback.print_exc()
        return JsonResponse({
            "success": False, 
            "error": "COGNITIVE_PIPELINE_CRASH", 
            "details": str(error)
        }, status=500)
