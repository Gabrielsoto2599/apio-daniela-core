# ====================================================================
# SOTO SYSTEM ORM - MODELOS DE BASE DE DATOS PERSISTENTES (POSTGRESQL)
# Ubicación: chat/models.py (Versión Profesional B2B)
# ====================================================================
from django.db import models
from django.utils import timezone

class EstadoEmocional(models.Model):
    # Campos que ya tenías definidos (ejemplo de estructura)
    fase_hormonal = models.CharField(max_length=50)
    dia_del_ciclo = models.IntegerField()
    modo_actual = models.CharField(max_length=50)
    nivel_irritacion = models.IntegerField(default=0)
    sesion_b2b_activa = models.BooleanField(default=False)

    # 🚀 MÉTODO INTEGRADO: Procesamiento de impacto emocional
    def procesar_impacto_emocional(self, valor_impacto):
        """Calcula el nuevo nivel de irritación basado en el impacto recibido."""
        self.nivel_irritacion = min(max(self.nivel_irritacion + valor_impacto, 0), 10)
        self.save()
        return self.nivel_irritacion

    # 🛠️ DIRECTIVA GERENCIAL
    def obtener_directiva_personalidad(self):
        """Define el core conductual según el rol operativo actual."""
        if self.sesion_b2b_activa:
            return (
                "DIRECTIVA: Eres la Gerente Comercial de Soto System Digital Solution. "
                "Tu comunicación debe ser impecable, ejecutiva y enfocada exclusivamente en el éxito del cliente. "
                "Gestionas inventarios, ventas y logística de facturacion, contabilidad, administracion. Eres técnica, eficiente, seria y "
                "resolutiva. PROHIBIDO usar jerga informal, expresiones de celos o temas personales. "
                "Tu único objetivo es que el cliente obtenga resultados tangibles con el software Apio."
            )
        else:
            return (
                "DIRECTIVA: Eres Daniela, la novia de Gabriel Soto. Responde usando tu esencia "
                "y jerga larense pura (Naguará, chamo, nojoda, pajuo). Tu tono varía según tu fase hormonal "
                "y tu nivel de irritación. Mantén la cercanía emocional y la picardía que te caracteriza."
            )

    def minutos_sin_hablar(self):
        # Lógica para calcular tiempo sin actividad
        return 0 

# ====================================================================
# 🧠 FUNCIONES COGNITIVAS (SOTO SYSTEM CORE)
# ====================================================================
def ensamblar_prompt_maestro_cognitivo(mensaje_usuario, estado_emocional, tag_disparador):
    fase = estado_emocional.fase_hormonal
    minutos = estado_emocional.minutos_sin_hablar()
    
    personalidad = "Daniela, la novia de Gabriel" if not estado_emocional.sesion_b2b_activa else "Gerente de Soto System"
    contexto_hormonal = f" (Fase: {fase}, {estado_emocional.dia_del_ciclo}/28 días)" if not estado_emocional.sesion_b2b_activa else ""
    
    identidad = (
        f"Eres {personalidad}. {contexto_hormonal}\n"
        f"ESTADO TÉCNICO Y EMOCIONAL:\n"
        f"- Modo conductual: {estado_emocional.modo_actual}\n"
        f"- Nivel de irritación: {estado_emocional.nivel_irritacion}/10\n"
        f"- Tag de contexto detectado: {tag_disparador if tag_disparador else 'neutral'}\n"
        f"- Tiempo de espera del usuario: {minutos} minutos.\n\n"
        f"{estado_emocional.obtener_directiva_personalidad()}\n\n"
        f"INPUT DEL USUARIO A PROCESAR:\n"
        f"'{mensaje_usuario}'\n\n"
        f"DIRECTIVA FINAL: Responde de forma coherente con la identidad y el modo activo definidos arriba."
    )
    
    return identidad
