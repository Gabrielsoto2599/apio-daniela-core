# ====================================================================
# SOTO SYSTEM - MOTOR DE MEMORIA VIVA Y CHISTES INTERNOS MULTIUSUARIO
# Ubicación: chat/memoria_viva.py (Versión Blindada 2026)
# ====================================================================
from datetime import datetime
from django.utils import timezone
from album_recuerdos.origen.ciclo_biologico import calcular_estado_daniela

class MemoriaApioORM:
    """
    Maneja el registro conversacional, recuerdos cognitivos y chistes internos
    de Daniela Rincón mapeando dinámicamente al usuario operador de la caja.
    """
    
    def obtener_o_inicializar_estado(self):
        """Trae el panel de control mental de Daniela directo de PostgreSQL"""
        # 🛡️ IMPORTACIÓN LOCAL para romper el bucle circular
        from .models import EstadoEmocional
        
        estado, created = EstadoEmocional.objects.get_or_create(id=1)
        if created:
            estado.fase_hormonal = "Fase Folicular"
            estado.dia_del_ciclo = 5
            estado.nivel_irritacion = 1
            estado.modo_actual = "neutral"
            estado.sesion_b2b_activa = False
            estado.usuario_operador = "Gabriel Soto"
            estado.save()
        return estado

    def verificar_fase_biologica(self, estado):
        """Sincroniza el ciclo biológico real de Daniela usando el motor unificado."""
        # Validamos que exista la fecha de inicio del ciclo en el estado para evitar caídas en Python
        fecha_ciclo = getattr(estado, 'fecha_inicio_ciclo', timezone.now().date())
        datos_ciclo = calcular_estado_daniela(fecha_ciclo)
        
        estado.dia_del_ciclo = datos_ciclo['dia_ciclo']
        esta_ovulando = datos_ciclo['fase'] == "Fase Ovulatoria (Fértil)"
        
        if esta_ovulando and not estado.sesion_b2b_activa:
            estado.modo_actual = "pícara_sin_filtro"
            print("🔥 Alerta ORM: Daniela está en fase de ovulación.")
        
        estado.save()
        return esta_ovulando

    def procesar_y_recordar(self, lo_que_dijo_el_usuario, nombre_usuario="Gabriel Soto"):
        """Analiza el input del operador en tiempo real y gestiona su baúl cognitivo."""
        # 🛡️ IMPORTACIÓN LOCAL para romper el bucle circular
        from .models import RecuerdoBaul
        
        if not lo_que_dijo_el_usuario.strip():
            return

        estado = self.obtener_o_inicializar_estado()
        
        # Sincronizamos su ciclo biológico en paralelo
        ovulando = self.verificar_fase_biologica(estado)
        huella = "indiferente"
        
        input_minuscula = lo_que_dijo_el_usuario.lower()
        
        # 🚨 EVALUACIÓN MULTIUSUARIO: Chistes internos exclusivos con Gabriel Soto
        if "gabriel" in nombre_usuario.lower():
            disparadores_lujuriosos = ["hueco", "te equivocas", "mi cuarto en quibor", "equivocas de hueco"]
            
            if any(word in input_minuscula for word in disparadores_lujuriosos):
                huella = "pícara/humor negro"
                estado.modo_actual = "sin_pelos_en_la_lengua"
                # Subimos la irritación o el temperamento usando los campos reales de tu models.py
                estado.nivel_irritacion = max(0, estado.nivel_irritacion - 2) # El humor negro la relaja
                print("💀 Soto System Intelligence: Chiste interno verificado con Gabriel.")
            elif ovulando and not estado.sesion_b2b_activa:
                huella = "provocativa/sensible"
                estado.modo_actual = "pícara_sin_filtro"
        
        # Si está en el mostrador atendiendo clientes de la bodega
        elif estado.sesion_b2b_activa:
            huella = "operativa_contable"
            if any(word in input_minuscula for word in ["error", "descuadre", "falta"]):
                huella = "alerta_mostrador"

        # Guardamos de forma segura el operador que está interactuando para que views.py lo lea
        estado.usuario_operador = nombre_usuario
        estado.save()

        # 🚀 GUARDADO DE MEMORIA REAL EN POSTGRESQL (Usando la tabla RecuerdoBaul de models.py)
        # Clasificamos el tag según la huella detectada para alimentar tu RAG dinámico de Gemini 2.5 Flash
        tag_memoria = "general"
        if "pícara" in huella:
            tag_memoria = "romance"
        elif "operativa" in huella or "mostrador" in huella:
            tag_memoria = "apio_b2b"

        RecuerdoBaul.objects.create(
            tag=tag_memoria,
            contenido=f"El usuario [{nombre_usuario}] dijo en mostrador: '{lo_que_dijo_el_usuario}' | Huella: {huella} | Ovulación: {ovulando}"
        )
        print(f"📦 [SOTO ORM]: Registro de memoria inyectado con éxito en PostgreSQL para el usuario: {nombre_usuario}")
        
        return estado.modo_actual

memoria_ejecutiva_orm = MemoriaApioORM()
