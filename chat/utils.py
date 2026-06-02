# Soto System Igual Blanco - Cerebro de Recuerdos Dinámico
# Ubicación: chat/utils.py

from .models import Recuerdo

def buscar_recuerdo_especial(mensaje_usuario):
    """
    Busca palabras clave en el mensaje y consulta la base de datos PostgreSQL
    para encontrar un relato relacionado.
    """
    mensaje = mensaje_usuario.lower()
    
    # Diccionario de disparadores para identificar de qué habla Gabriel
    disparadores = {
        "comida": ["torta", "cena", "almuerzo", "cocinaste", "caraotas", "5 am"],
        "familia": ["kira", "perrita", "hija", "negro", "suéter", "primos"],
        "romance": ["colchoneta", "escapaste", "2 am", "espejo", "beso", "abrazo"],
        "negocios": ["saas", "software", "proyecto", "shopify", "amazon"],
        "estudios": ["unearte", "coto paul", "ucla", "universidad"]
    }

    tag_encontrado = None
    
    # Identificar el tag según las palabras clave
    for tag, palabras in disparadores.items():
        if any(p in mensaje for p in palabras):
            tag_encontrado = tag
            break
    
    if tag_encontrado:
        recuerdo_db = Recuerdo.objects.filter(tag=tag_encontrado).order_by('?').first()
        if recuerdo_db:
            return recuerdo_db.contenido, recuerdo_db.tag # <-- DEBE RETORNAR EL TAG AQUÍ
            
    return None, "neutral"