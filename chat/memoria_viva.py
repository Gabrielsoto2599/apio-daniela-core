# ====================================================================
# SOTO SYSTEM - MOTOR DE MEMORIA VIVA Y CHISTES INTERNOS (POSTGRESQL)
# Ubicación: chat/memoria_viva.py
# ====================================================================
from datetime import datetime
from django.utils import timezone
# Eliminamos la importación global: from .models import EstadoEmocional, Recuerdo
from album_recuerdos.origen.ciclo_biologico import calcular_estado_daniela

class MemoriaApioORM:
    """
    Refactorización de Alta Fidelidad para el Ecosistema B2B Apio.
    Maneja el registro conversacional y la detección de doble sentido a través del ORM.
    """
    
    def obtener_o_inicializar_estado(self):
        """Trae el panel de control mental de Daniela directo de PostgreSQL"""
        # 🛡️ IMPORTACIÓN LOCAL para romper el bucle
        from .models import EstadoEmocional
        
        estado, created = EstadoEmocional.objects.get_or_create(id=1)
        if created:
            estado.autoesteem = 8
            estado.nivel_irritacion = 1
            estado.modo_actual = "neutral"
            estado.save()
        return estado

    def verificar_fase_biologica(self, estado):
        """Sincroniza la ovulación real de Daniela usando el motor unificado de ciclos."""
        datos_ciclo = calcular_estado_daniela(estado.fecha_inicio_ciclo)
        estado.dia_del_ciclo = datos_ciclo['dia_ciclo']
        esta_ovulando = datos_ciclo['fase'] == "Fase Ovulatoria (Fértil)"
        
        if esta_ovulando:
            estado.modo_actual = "pícara_sin_filtro"
            print("🔥 Alerta ORM: Daniela está en fase de ovulación.")
        
        estado.save()
        return esta_ovulando

    def procesar_y_recordar(self, lo_que_dijo_gabriel):
        """Analiza el input de Gabriel en tiempo real."""
        # 🛡️ IMPORTACIÓN LOCAL para romper el bucle
        from .models import Recuerdo
        
        if not lo_que_dijo_gabriel.strip():
            return

        estado = self.obtener_o_inicializar_estado()
        ovulando = self.verificar_fase_biologica(estado)
        huella = "indiferente"
        
        input_minuscula = lo_que_dijo_gabriel.lower()
        disparadores_lujuriosos = ["hueco", "te equivocas", "mi cuarto en quibor", "equivocas de hueco"]
        
        if any(word in input_minuscula for word in disparadores_lujuriosos):
            huella = "pícara/humor negro"
            estado.modo_actual = "sin_pelos_en_la_lengua"
            estado.nivel_dopamina = min(100, estado.nivel_dopamina + 30)
            print("💀 Soto System Intelligence: Chiste interno detectado.")
        
        elif ovulando:
            huella = "provocativa/sensible"
            estado.modo_actual = "pícara_sin_filtro"

        estado.ultima_conexion_gabriel = timezone.now()
        estado.save()

        # 🚀 GUARDADO DE MEMORIA EN POSTGRESQL
        Recuerdo.objects.create(
            contenido=f"Gabriel dijo en chat: '{lo_que_dijo_gabriel}' | Huella: {huella} | Ovulación: {ovulando}",
            tag="hormonal_picara" if "pícara" in huella or "lujuriosa" in estado.modo_actual else "general",
            impacto_emocional=9 if "humor negro" in huella else 4,
            es_importante=True if "humor negro" in huella else False
        )
        print("📦 Registro de memoria conversacional inyectado con éxito en PostgreSQL.")
        
        return estado.modo_actual

memoria_ejecutiva_orm = MemoriaApioORM()

