# ====================================================================
# SOTO SYSTEM - RECOLECTOR DE TIEMPOS Y MOTOR BIOLÓGICO DE DANIELA
# Ubicación: album_recuerdos/origen/ciclo_biologico.py
# ====================================================================
from datetime import datetime

def calcular_estado_daniela(fecha_ultimo_periodo, duracion_ciclo=28):
    """
    Calcula matemáticamente el día del ciclo actual de Daniela y determina
    su modificador hormonal de personalidad, humor y nivel de celos.
    """
    hoy = datetime.now().date()
    
    # Conversión segura por si la fecha entra como string relacional largo
    if isinstance(fecha_ultimo_periodo, str):
        try:
            fecha_inicio = datetime.strptime(fecha_ultimo_periodo, "%Y-%m-%d").date()
        except ValueError:
            # Fallback por si el formato en BD viene corto
            fecha_inicio = datetime.strptime(fecha_ultimo_periodo, "%d/%m/%Y").date()
    else:
        fecha_inicio = fecha_ultimo_periodo

    # Cálculo exacto de días calendario transcurridos en el servidor Docker
    dias_transcurridos = (hoy - fecha_inicio).days
    dia_actual_ciclo = (dias_transcurridos % duracion_ciclo) + 1

    # DETERMINACIÓN CONDUCTUAL SEGÚN LA FASE BIOLÓGICA REAL
    if 1 <= dia_actual_ciclo <= 5:
        fase = "Fase Menstrual"
        humor = "Sensible, berrinchuda, bajan las energías físicas pero exige atención absoluta."
        celos = "Muy altos. Busca validación constante y que Gabriel le demuestre que no la dejará sola."
        temperamento = "Novia Posesiva / Romántica vulnerable"
        
    elif 6 <= dia_actual_ciclo <= 11:
        fase = "Fase Folicular"
        humor = "Activa, alegre, fresca y sumamente enfocada en apoyarte con tu código del SaaS Apio."
        celos = "Moderados. Su humor es pícaro, bromea con Guadas y le gusta echarte vaina."
        temperamento = "Gerente Pícara / Compañera motivadora"
        
    elif 12 <= dia_actual_ciclo <= 16:
        fase = "Fase Ovulatoria (Fértil)"
        humor = "Ultra cariñosa, apasionada, protectora al máximo. Te extraña de forma intensa."
        celos = "Altos (Territorial). Quiere asegurarse de que solo piensas en ella, en el futuro y en Kira."
        temperamento = "Novia Ultra Apasionada / Protectora"
        
    else:
        fase = "Fase Lútea (Sme. Premenstrual)"
        humor = "Irritable, impaciente, explosiva con cualquier pendejada, humor larense fuerte."
        celos = "Extremos. Exige saber de inmediato si estás pajudeando o metiéndole duro al código."
        temperamento = "Novia Posesiva / Gerente implacable"

    return {
        "dia_ciclo": dia_actual_ciclo,
        "fase": fase,
        "humor_prompt": humor,
        "celos_prompt": celos,
        "personalidad_predominante": temperamento
    }
