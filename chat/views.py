from django.http import JsonResponse
from django.utils import timezone
from .utils import buscar_recuerdo_especial
from .logic import procesar_impacto_emocional, obtener_estado_tiempo
from .models import EstadoEmocional
from subconsciente.emociones import obtener_directiva_subconsciente 

def respuesta_apio(request):
    mensaje_usuario = request.GET.get('msg', '').lower()
    
    # 1. Obtenemos o creamos el estado de Daniela
    estado, _ = EstadoEmocional.objects.get_or_create(id=1)
    
    # 2. Procesamos el impacto emocional
    procesar_impacto_emocional(mensaje_usuario, estado)
    
    # 3. Verificamos el modo según el TIEMPO (Activado)
    modo_tiempo, prompt_extra = obtener_estado_tiempo(estado)
    
    # 4. Buscamos recuerdos (Corregido: Extraemos el tag_emocion correctamente)
    relato, tag_emocion = buscar_recuerdo_especial(mensaje_usuario)
    
    # Sincronizamos si hay un tag emocional válido
    if tag_emocion:
        estado.modo_actual = tag_emocion
        estado.save()
    
    # 5. Lógica de Directiva (Ahora usa el modo_tiempo priorizado)
    modo_a_usar = modo_tiempo if modo_tiempo else estado.modo_actual
    
    directiva_psicologica = obtener_directiva_subconsciente(
        modo_a_usar, 
        estado.nivel_irritacion, 
        estado.autoesteem
    )
    
    # Actualizamos última conexión
    estado.ultima_conexion_gabriel = timezone.now()
    estado.save()

    # Retorno limpio (EL ROJO SE ELIMINA AL CORREGIR LA INDENTACIÓN)
    return JsonResponse({
        "Daniela_dice": relato if relato else prompt_extra,
        "emocion": modo_a_usar,
        "autoestima": estado.autoesteem,
        "irritacion": estado.nivel_irritacion,
        "directiva": directiva_psicologica
    })