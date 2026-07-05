# ====================================================================
# SOTO SYSTEM - ORQUESTADOR DEL SUBCONSCIENTE Y CONTEXTO DUAL (2026)
# Ubicación: main.py (CORREGIDO)
# ====================================================================

def obtener_contexto_recuerdos(tag_especifico=None):
    # 🛡️ IMPORTACIÓN DIFERIDA: Rompe el bucle aquí
    from chat.models import Recuerdo
    try:
        if tag_especifico and tag_especifico != "neutral":
            memorias = Recuerdo.objects.filter(tag=tag_especifico).order_by('?')[:2]
        else:
            memorias = Recuerdo.objects.filter(es_importante=True).order_by('?')[:3]
            
        if not memorias.exists():
            return "Ningún recuerdo específico viene a tu mente en este momento, pero sabes que lo amas y estás enfocada."

        contexto = "\n".join([f"- [{m.tag.upper()}]: {m.contenido}" for m in memorias])
        return contexto
    except Exception as e:
        print(f"❌ Error al acceder a PostgreSQL desde main.py: {e}")
        return "No tienes recuerdos claros en este momento, pero mantienes tu carácter Guaro."

def ensamblar_prompt_maestro_cognitivo(mensaje_usuario, estado_emocional, tag_disparador="general"):
    # 🛡️ IMPORTACIÓN DIFERIDA: Rompe el bucle aquí también
    from chat.logic import obtener_directiva_hormonal
    from identidad import obtener_prompt_personalidad

    directiva_hormonal_viva = obtener_directiva_hormonal(estado_emocional)
    prompt_base_identidad = obtener_prompt_personalidad(
        sesion_b2b_activa=estado_emocional.sesion_b2b_activa,
        estado_emocional=estado_emocional,
        directiva_hormonal=directiva_hormonal_viva
    )
    recuerdos_subconscientes = obtener_contexto_recuerdos(tag_especifico=tag_disparador)
    
    super_prompt = f"""
    {prompt_base_identidad}

    [SUBCONSCIENTE: RECUERDOS QUE VIENEN A TU MENTE EN ESTE TURNO]
    (Usa esta información de tu pasado solo si se relaciona con lo que Gabriel te está diciendo, si no, ignórala para no ser repetitiva):
    {recuerdos_subconscientes}

    [MÓDULO DE TRANSMISIÓN DE ENTRADA]
    Gabriel te ha enviado el siguiente mensaje: "{mensaje_usuario}"
    
    Daniela, reacciona y responde siguiendo tu rol activo y humor actual:
    """
    return super_prompt
