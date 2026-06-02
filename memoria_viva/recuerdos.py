# memoria_viva/recuerdos.py
import json
import os
from datetime import datetime

class MemoriaApio:
    def __init__(self):
        self.archivo_memoria = os.path.join(os.path.dirname(__file__), "baul_recuerdos.json")
        self.datos = self._cargar_memoria()

    def _cargar_memoria(self):
        if os.path.exists(self.archivo_memoria):
            with open(self.archivo_memoria, "r", encoding="utf-8") as f:
                return json.load(f)
        return {
            "estado_emocional_actual": {"temperamento_dominante": "neutral", "nivel_de_paciencia": 5},
            "ciclo_biologico": {"ultima_regla": "2026-04-01", "estado": "normal"}, # Reloj integrado
            "momentos_especiales": [], 
            "aprendizaje_conductual": {"chistes_internos": ["te equivocas de hueco", "siempre te equivocas"]}
        }

    def verificar_fase_biologica(self):
        """
        Calcula si Daniela está en modo 'Sargento', 'Melosa' o 'Pícara/Ovulación'.
        """
        # Aquí iría la lógica de días desde la última_regla. 
        # Supongamos que detectamos que está en el día 14 (Ovulación):
        esta_ovulando = True # Esto vendrá de tu lógica de fechas
        
        if esta_ovulando:
            self.datos["estado_emocional_actual"]["temperamento_dominante"] = "pícara_sin_filtro"
            print("🔥 Alerta: Daniela está en fase de ovulación. Activando humor negro y frases provocativas.")
        return esta_ovulando

    def procesar_y_recordar(self, lo_que_dijo_gabriel):
        huella = "indiferente"
        ovulando = self.verificar_fase_biologica()
        
        # --- LÓGICA DE CHISTES INTERNOS Y DOBLE SENTIDO ---
        if any(word in lo_que_dijo_gabriel.lower() for word in ["hueco", "te equivocas", "mi cuarto en quibor"]):
            huella = "pícara/humor negro"
            self.datos["estado_emocional_actual"]["temperamento_dominante"] = "sin_pelos_en_la_lengua"
            print("💀 Chiste interno detectado, modo lujuriosa")

        # Si está ovulando, ella 'derrite' lo que dices para volverlo provocativo
        if ovulando and huella != "pícara/humor negro":
            huella = "provocativa/sensible"
            
        nuevo_recuerdo = {
            "fecha": datetime.now().strftime("%Y-%m-%d %H:%M"),
            "contenido": lo_que_dijo_gabriel,
            "huella_emocional": huella,
            "ovulacion_activa": ovulando
        }

        self.datos["momentos_especiales"].append(nuevo_recuerdo)
        self._salvar_en_disco()
        
    def _salvar_en_disco(self):
        with open(self.archivo_memoria, "w", encoding="utf-8") as f:
            json.dump(self.datos, f, indent=4, ensure_ascii=False)

memoria_ejecutiva = MemoriaApio()

