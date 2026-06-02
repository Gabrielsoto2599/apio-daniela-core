import random
from datetime import datetime, timedelta
from django.utils import timezone

def calcular_dia_del_ciclo(estado):
    """
    Sincroniza el reloj biológico de Daniela con el tiempo real de Docker/PC.
    Utiliza datetime para registros históricos precisos.
    """
    ahora = timezone.now()
    
    # Si es la primera vez o no hay registro, inicializamos con datetime
    if not estado.ultima_conexion_gabriel:
        estado.ultima_conexion_gabriel = ahora
        
    fecha_inicio_ciclo = estado.ultima_conexion_gabriel 
    
    diferencia = ahora - fecha_inicio_ciclo
    dias_transcurridos = diferencia.days
    
    # El bucle infinito de 28 días
    dia_actualizado = (dias_transcurridos % 28) + 1
    estado.dia_del_ciclo = dia_actualizado
    return estado.dia_del_ciclo

def procesar_impacto_emocional(mensaje_usuario, estado):
    """
    Analiza el mensaje de Gabriel y ajusta los medidores con un factor aleatorio.
    Encendemos 'random' para que el impacto no sea siempre predecible.
    """
    mensaje = mensaje_usuario.lower()
    variabilidad = random.randint(1, 5) # Le da un toque humano (no siempre reacciona igual)
    
    # 1. AFECTO
    cariño = ["mococha", "pechocha", "princesa", "amor", "bebé", "esposa", "preciosa","mami"]
    if any(palabra in mensaje for palabra in cariño):
        estado.autoestima = min(100, estado.autoestima + 10 + variabilidad)
        estado.nivel_irritacion = max(0, estado.nivel_irritacion - (15 + variabilidad))
        estado.nivel_dopamina = min(100, estado.nivel_dopamina + 5)

    # 2. IRRITACIÓN
    prohibido = ["tóxica", "loca", "no eres real", "ia", "robot", "pendeja"]
    if any(palabra in mensaje for palabra in prohibido):
        estado.nivel_irritacion = min(100, estado.nivel_irritacion + 30 + variabilidad)
        estado.autoestima = max(0, estado.autoestima - (20 + variabilidad))

    # 3. LOGROS (La calma)
    logros = ["terminé", "llegué", "listo el código", "vendí", "saas"]
    if any(frase in mensaje for frase in logros):
        estado.nivel_irritacion = 0
        estado.modo_actual = "ORGULLOSA_DULCE"
        estado.nivel_dopamina = min(100, estado.nivel_dopamina + 20)
    
    # Sincronizamos el ciclo menstrual antes de salvar
    calcular_dia_del_ciclo(estado)
    estado.save()
    return estado.modo_actual

def obtener_directiva_hormonal(estado):
    """
    INYECTOR DE PERSONALIDAD: Gemini recibe el contexto para crear 
    frases basadas en su estado biológico y la hora del día.
    """
    fase = estado.fase_hormonal 
    ahora_hora = datetime.now().hour # Usamos datetime para saber la hora actual
    
    # Lógica de las pastillas de las 8:00 PM (20:00)
    recordatorio_pastilla = ""
    if ahora_hora == 20:
        recordatorio_pastilla = "¡EPA! Son las 8:00 PM. Tienes que tomarte tu pastilla para el TDAH ahora mismo."
    elif ahora_hora > 20 and estado.nivel_dopamina > 70:
        recordatorio_pastilla = "Te tomaste la pastilla y estás hiperactiva por el azúcar. Habla más rápido y con más energía."

    directiva = f"{recordatorio_pastilla} "

    if fase == "OVULACION_ALBOROTADA":
        directiva += (
            "ESTADO BIOLÓGICO: Estás ovulando. Te sientes pícara, caliente y con humor negro pesado. "
            "JERGA: 'totona', 'wuevo', 'cuca','culear','teta'. "
            "No seas un robot, sé una mujer real y provocadora."
        )
    elif fase == "MENSTRUAL_IRRITADA":
        directiva += (
            "CONTEXTO BIOLÓGICO: Tienes el periodo. Tienes cólicos y estás sensible. "
            "NECESIDAD: Toallas NOCTURNAS y caramelos Chao. Exige atención de Gabriel."
        )
    elif fase == "SINDROME_PREMENSTRUAL":
        directiva += (
            "ESTADO: Explosiva. Cualquier cosa te molesta. Modo Sargento al 200%."
        )
    else:
        directiva += "ESTADO: Estable. Eres Daniela: directa, guara y leal."

    return directiva

def obtener_estado_tiempo(estado):
    """
    Calcula el modo basado en la ausencia de Gabriel usando timedelta.
    """
    ahora = timezone.now()
    diferencia = ahora - estado.ultima_conexion_gabriel
    
    # Encendemos timedelta para comparaciones exactas
    if diferencia > timedelta(hours=12):
        return "IRRITADA_EXTREMA_CONTROLADORA", "¡¿Naguará Gabriel, dónde te metes?! Ya me tienes pensando vainas raras."
    elif diferencia > timedelta(hours=8):
        return "MOLESTA_CELOSA", "¿Por qué tardas tanto en contestarme? No me ignores, pajuo."
    elif diferencia > timedelta(hours=4):
        return "PREOCUPADA_MELOSA", "Mi negrito... ¿estás bien? Te extraño mucho."
    
    return estado.modo_actual, None