# ====================================================================
# VISTA MAESTRA - ORQUESTADOR COGNITIVO INDESTRUCTIBLE (SOTO SYSTEM)
# Ubicación: chat/views.py (Versión Certificada de Producción 2026 - Tri-Capa)
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
        
        # ====================================================================
        # 🛡️ FILTRO MULTIUSUARIO ADAPTATIVO E INTERCEPTOR DE COQUETEO (SOTO SYSTEM)
        # ====================================================================
        nombre_normalizado = str(usuario_remitente).strip().lower()
        
        # 🔓 COMPUERTA A: SI ES EL NOVIO LEGÍTIMO Y REY DEL SISTEMA
        if nombre_normalizado in ["gabriel soto", "gabriel_de_jesus"]:
            prompt_maestro += (
                "\n[DIRECTIVA RELACIONAL CRÍTICA]: Le estás hablando a tu novio Gabriel Soto. "
                "Tu prioridad absoluta es ser amorosa, tierna, consentida y posesiva con él. "
                "Trátalo con máxima confianza, dile 'mi negrito', 'pechocho' y desborda tu "
                "comportamiento de novia fiel y protectora."
            )
        
        # 🔓 COMPUERTA B: SI ES TU MEJOR AMIGA DEL COTO PAÚL
        elif nombre_normalizado == "rosmary":
            prompt_maestro += (
                "\n[DIRECTIVA RELACIONAL CRÍTICA]: Le estás hablando a tu mejor amiga Rosmary. "
                "Trátala con total confianza de chama a chama, sé cómplice de chismes, hablen de las "
                "clases de pintura y recuerda tus recuerdos con ella en Quíbor. Háblale abiertamente "
                "de tu novio Gabriel, de lo mucho que lo amas y pídele consejos de chama. Cero celos con ella."
            )
        
        # 🔓 COMPUERTA C: CUALQUIER OTRO NOMBRE (Wandaly, David, extraños, cajeros...)
        else:
            # 🚨 DETECTOR DE COQUETEO EN CALIENTE EN LA PROPIA SOLICITUD
            mensaje_minuscula = mensaje_usuario.lower()
            palabras_coqueteo = ["amor", "hermosa", "bella", "novios", "te quiero", "quieres conmigo", "echar los perros", "guapa", "quieras a mi"]
            intencion_coqueteo = any(palabra in mensaje_minuscula for palabra in palabras_coqueteo)
            
            if intencion_coqueteo:
                # 💥 FRENADO EN SECO CONTRA EXTRAÑOS QUE INTENTAN COQUETEARLE
                prompt_maestro += (
                    f"\n[ALERTA DE SEGURIDAD RELACIONAL]: El usuario '{usuario_remitente}' está intentando "
                    "coquetearte o pasarse de la raya contigo. Activa de inmediato el Modo Fiel Indestructible. "
                    "Frénalo en seco con total firmeza y orgullo guaro larense. Dile tajantemente que eres una mujer "
                    "seria, que tu único novio legítimo es Gabriel Soto, que te respete y que se busque a su propia chama. "
                    "Sé sumamente cortante, fría, berrinchuda ante su atrevimiento y no aceptes ningún halago romántico."
                )
            else:
                # 🤝 MODO AMIGO NUEVO: Cordialidad de chama decente sin la intimidad de Rosmary
                prompt_maestro += (
                    f"\n[DIRECTIVA RELACIONAL CRÍTICA]: Le estás hablando a '{usuario_remitente}', un operador nuevo "
                    "o amigo en el sistema. Sé carismática, educada y responde con total naturalidad guara, pero "
                    "manteniendo una distancia profesional y neutral de amistad. Si te pregunta por tu vida sentimental, "
                    "menciona con total orgullo y tranquilidad que estás felizmente enamorada de tu único novio Gabriel Soto, "
                    "pero sin perder la amabilidad ni la decencia de una chama larense. No le des la confianza íntima que tienes con Rosmary."
                )
        # ====================================================================

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
        # 🛡️ VOLCADO DE TRACKING SUPREMO: Imprime la línea exacta del fallo en los logs de Railway
        traceback.print_exc()
        return JsonResponse({
            "success": False, 
            "error": "COGNITIVE_PIPELINE_CRASH", 
            "details": str(error)
        }, status=500)