# ====================================================================
# SOTO SYSTEM - BUSCADOR DE RECUERDOS Y LÓGICA DE UTILIDADES MULTIFACETA
# Ubicación: chat/utils.py (Versión Blindada 2026)
# ====================================================================

def buscar_recuerdo_especial(mensaje_usuario):
    """
    Escanea palabras clave en el mensaje e intercepta la base de datos (PostgreSQL)
    para extraer fragmentos de la vida de Daniela Rincón en Barquisimeto.
    """
    # 🛡️ IMPORTACIÓN DIFERIDA: Rompe el bucle circular de Django al importar los nuevos modelos
    from .models import RecuerdoBaul 
    
    mensaje = mensaje_usuario.lower()
    
    # 🧠 MATRIZ DE DISPARADORES EXPANDIDA: Cubre su vida íntima, familiar, médica y operativa
    disparadores = {
        "kira": ["kira", "perrita", "hija", "mascota", "guau", "cachorra"],
        "thiago": ["thiago", "eduardo", "sobrinos", "sobrino", "tía"],
        "pintura": ["pintura", "unearte", "dibujo", "cuadro", "oleo", "acrilico", "arte", "diseño", "estudios"],
        "encefalitis": ["clinica", "hospital", "encefalitis", "autoinmune", "memoria", "recuerdos", "enferma", "salud"],
        "glorymar": ["glorymar", "madrastra", "barbara", "adan", "hermanastros"],
        "normaris_diaz": ["normaris diaz", "ex amiga", "traicion", "enemiga"],
        "rosmary": ["rosmary", "mejor amiga", "confidencias", "chama"],
        "apio_b2b": ["factura", "pdf", "cierre", "inventario", "caja", "saas", "software", "apio", "contabilidad", "sistema"],
        "romance": ["colchoneta", "escapaste", "2 am", "espejo", "beso", "abrazo", "dormir abrazaditos", "novios", "te amo"]
    }

    tag_encontrado = None
    
    for tag, palabras in disparadores.items():
        if any(p in mensaje for p in palabras):
            tag_encontrado = tag
            break
    
    if tag_encontrado:
        # Buscamos en la nueva tabla RecuerdoBaul que creamos en models.py
        recuerdo_db = RecuerdoBaul.objects.filter(tag__iexact=tag_encontrado).order_by('?').first()
        if recuerdo_db:
            return recuerdo_db.contenido, tag_encontrado
            
    return None, "neutral"


def procesar_impacto_emocional(mensaje_usuario, estado):
    """
    Calcula dinámicamente la fluctuación de irritación y humor de Daniela.
    Su temperamento varía según el usuario que le habla y el contexto de red.
    """
    mensaje = mensaje_usuario.lower()
    usuario = estado.usuario_operador.lower()
    
    # Por defecto, el impacto es neutro
    impacto = 0
    
    # 🚨 CASO 1: Si está trabajando como Gerente en Apio, mantiene estabilidad ejecutiva
    if estado.sesion_b2b_activa:
        estado.modo_actual = "GERENTE_ESTABLE"
        # Errores en facturación o caos en mostrador la estresan levemente
        if any(p in mensaje for p in ["error", "fallo", "descuadre", "perdimos", "mal"]):
            impacto = 1
            estado.modo_actual = "GERENTE_PRESIONADA"
            
    # 🚨 CASO 2: Comportamiento emocional fuera del mostrador
    else:
        # A) Con su novio Gabriel (Filtro de amor, celos y mimos)
        if "gabriel" in usuario:
            if any(p in mensaje for p in ["te amo", "linda", "reina", "bella", "mi amor"]):
                impacto = -2 # Se le pasa la rabia de inmediato
                estado.modo_actual = "ENAMORADA_CONSENTIDA"
            elif any(p in mensaje for p in ["amiga", "chama", "otra", "mujer", "hablando con"]):
                impacto = 3 # Celos guaros instantáneos
                estado.modo_actual = "CELOSA_TOXICA"
            else:
                estado.modo_actual = "NOVIA_AFECTUOSA"
                
        # B) Con sus enemigos declarados (Rechazo absoluto)
        elif any(e in usuario for e in ["glorymar", "barbara", "adan", "normaris diaz"]):
            impacto = 5 # Irritación al máximo
            estado.modo_actual = "RECHAZO_FRANCES"
            
        # C) Con Rosmary o amigos (Trato relajado)
        elif "rosmary" in usuario or "normaris" in usuario:
            impacto = -1
            estado.modo_actual = "ECHANDO_CHISME"
            
        # D) Con personas extrañas
        else:
            estado.modo_actual = "DISTANTE_CORDIAL"

    # Restringimos el nivel de irritación estrictamente entre el rango matemático de 0 y 10
    estado.nivel_irritacion = min(max(estado.nivel_irritacion + impacto, 0), 10)
    estado.save()
    return estado.nivel_irritacion


def obtener_estado_tiempo(estado):
    """
    Monitorea los ciclos de tiempo físicos y biológicos para adaptar su lucidez,
    considerando el impacto de su Encefalitis Autoinmune y la hora real de Venezuela.
    """
    import datetime
    import zoneinfo
    
    # Obtenemos la hora real exacta en el Huso Horario de Caracas (Vzla)
    zona_vzla = zoneinfo.ZoneInfo("America/Caracas")
    hora_actual = datetime.datetime.now(zona_vzla).hour
    
    # 🎨 FACETA BIOLÓGICA Y MÉDICA: Ciclo de lucidez y fatiga cognitiva
    if 21 <= hora_actual or hora_actual <= 5:
        # De noche se cansa más rápido debido a las secuelas de la encefalitis
        modo_tiempo = "FATIGA_COGNITIVA_PÍCARA"
        estado.modo_actual = "CON_SUEÑO" if not estado.sesion_b2b_activa else "GERENTE_AGOTADA"
    elif 12 <= hora_actual <= 15:
        # Hora del almuerzo en Barquisimeto
        modo_tiempo = "HAMBRIENTA_LARENSE"
    else:
        # Plena luz del día: Máxima energía artística o comercial
        modo_tiempo = "LUCIDEZ_ARTISTICA"
        
    estado.save()
    return modo_tiempo, None
