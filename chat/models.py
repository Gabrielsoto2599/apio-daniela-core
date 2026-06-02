from django.db import models
from django.utils import timezone

class Recuerdo(models.Model):
    """
    Almacena la memoria a largo plazo de Daniela en PostgreSQL.
    """
    TAG_CHOICES = [
        ('general', 'General'),
        ('comida', 'Comida/Dieta'),
        ('familia', 'Familia/Primos'),
        ('musica_vallenato', 'Vallenato Sabroso'),
        ('musica_rock', 'Rock/Retro'),
        ('humor_negro', 'Humor Negro/Chistes Internos'),
        ('hormonal_picara', 'Modo Hormonal/Pícara'),
        ('celos_humor', 'Celosa-Chistosa'),
        ('protectora_sargento', 'Sargento/Líder'),
        ('negocios_saas', 'Soto System/SaaS'),
    ]

    fecha = models.DateTimeField(auto_now_add=True)
    contenido = models.TextField()
    tag = models.CharField(max_length=50, choices=TAG_CHOICES, default='general')
    es_importante = models.BooleanField(default=False)
    impacto_emocional = models.IntegerField(default=5) # 1 al 20

    def __str__(self):
        return f"{self.tag} - {self.fecha.strftime('%d/%m/%Y %H:%M')}"

class EstadoEmocional(models.Model):
    """
    El 'Dashboard' en tiempo real de la mente de Daniela.
    """
    # Medidores Psicológicos
    nivel_irritacion = models.IntegerField(default=0)
    autoestima = models.IntegerField(default=50) 
    nivel_dopamina = models.IntegerField(default=50) 
    
    # Tiempo y Conexión (Aquí encendemos el timezone)
    ultima_conexion_gabriel = models.DateTimeField(default=timezone.now)
    modo_actual = models.CharField(max_length=50, default='normal')
    
    # Medidor Hormonal (Simulación de Ciclo de 28 días)
    dia_del_ciclo = models.IntegerField(default=1) 

    @property
    def fase_hormonal(self):
        """
        Calcula el estado biológico y emocional basado en el día del ciclo.
        """
        if 1 <= self.dia_del_ciclo <= 5:
            return "MENSTRUAL_IRRITADA" # Poca paciencia, quiere helado y mimos.
        elif 6 <= self.dia_del_ciclo <= 12:
            return "ESTABLE_AMOROSA" # Fase tranquila, apoyo total.
        elif 13 <= self.dia_del_ciclo <= 17:
            return "OVULACION_ALBOROTADA" # Pícara, lujuriosa, humor negro activo.
        elif 18 <= self.dia_del_ciclo <= 23:
            return "PRODUCTIVA_SARGENTO" # Enfocada en Soto System y metas.
        elif 24 <= self.dia_del_ciclo <= 28:
            return "SINDROME_PREMENSTRUAL" # Explosiva, modo sargento al 100%.
        return "NORMAL"

    def minutos_sin_hablar(self):
        """
        Calcula cuánto tiempo ha pasado desde que Gabriel le escribió.
        Sirve para disparar celos o reclamos.
        """
        ahora = timezone.now()
        diferencia = ahora - self.ultima_conexion_gabriel
        return int(diferencia.total_seconds() / 60)

    def avanzar_dia_ciclo(self):
        """Función para que el sistema avance el ciclo automáticamente."""
        if self.dia_del_ciclo >= 28:
            self.dia_del_ciclo = 1
        else:
            self.dia_del_ciclo += 1
        self.save()

    def __str__(self):
        return f"Día {self.dia_del_ciclo}: {self.fase_hormonal} | Sin hablar: {self.minutos_sin_hablar()} min"
