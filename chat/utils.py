# ====================================================================
# SOTO SYSTEM - BUSCADOR DE RECUERDOS Y LÓGICA DE UTILIDADES
# Ubicación: chat/utils.py
# ====================================================================

def buscar_recuerdo_especial(mensaje_usuario):
    """
    Escanea palabras clave en el mensaje de Gabriel e intercepta la base de datos
    para inyectar recuerdos en el RAG dinámico de Gemini 2.5 Flash.
    """
    # 🛡️ IMPORTACIÓN DIFERIDA: Rompe el bucle circular de Django
    from .models import Recuerdo 
    
    mensaje = mensaje_usuario.lower()
    
    disparadores = {
        "comida": ["torta", "cena", "almuerzo", "cocinaste", "caraotas", "tajadas", "5 am", "dulces"],
        "familia": ["kira", "perrita", "hija", "negro", "suéter", "primos", "thiago", "abuela"],
        "hormonal_picara": ["colchoneta", "escapaste", "2 am", "espejo", "beso", "abrazo", "dormir abrazaditos"],
        "negocios_saas": ["saas", "software", "proyecto", "shopify", "amazon", "apio", "factura", "inventario", "caja"],
        "general": ["unearte", "coto paul", "universidad", "estudios", "pintura", "dibujo", "diseño"]
    }

    tag_encontrado = None
    
    for tag, palabras in disparadores.items():
        if any(p in mensaje for p in palabras):
            tag_encontrado = tag
            break
    
    if tag_encontrado:
        recuerdo_db = Recuerdo.objects.filter(tag=tag_encontrado).order_by('?').first()
        if recuerdo_db:
            return recuerdo_db.contenido, recuerdo_db.tag
            
    return None, "neutral"

def procesar_impacto_emocional(mensaje_usuario, estado):
    """
    Calcula y actualiza el impacto emocional en el estado del usuario.
    """
    # Lógica de procesamiento de impacto basada en la interacción
    # Se ajusta el nivel de irritación del estado (modelo)
    impacto = 1 
    estado.nivel_irritacion = min(max(estado.nivel_irritacion + impacto, 0), 10)
    estado.save()
    return estado.nivel_irritacion

def obtener_estado_tiempo(estado):
    """
    Obtiene el modo de tiempo actual.
    """
    # Lógica base para mantener la estructura de respuesta de vistas
    return "estabilidad", None
