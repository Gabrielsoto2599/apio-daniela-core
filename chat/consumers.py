# ====================================================================
# ANTENA WEBSOCKET - SOTO VINCULACIÓN EN TIEMPO REAL (DJANGO CHANNELS)
# Ubicación: chat/consumers.py (Python / Django Prod)
# ====================================================================
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import EstadoEmocional

class ApioVinculacionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Extraemos el identificador único del mostrador o caja desde el QR (la URL del canal)
        self.caja_id = self.scope['url_route']['kwargs']['caja_id']
        self.grupo_caja = f"caja_{self.caja_id}"

        # Unimos la sesión web de la PC y la app del teléfono al mismo canal aéreo
        await self.channel_layer.group_add(
            self.grupo_caja,
            self.channel_name
        )
        await self.accept()
        print(f"🔌 [SOTO WEBSOCKET]: Canal de tiempo real abierto con éxito para la Caja: {self.caja_id}")

    async def disconnect(self, close_code):
        # Desvinculamos los hilos de red al apagar
        await self.channel_layer.group_discard(
            self.grupo_caja,
            self.channel_name
        )
        print(f"🛑 [SOTO WEBSOCKET]: Canal cerrado de forma segura para la Caja: {self.caja_id}")

    # 🚀 RECEPTOR MAESTRO: Captura el zarpazo de datos del teléfono celular
    async def receive(self, text_data):
        data = json.loads(text_data)
        evento = data.get("evento")
        user_id = data.get("user_id", "gabriel_de_jesus")

        if evento == "VINCULACION_EXITOSA":
            print(f"📸 [SOTO WEBSOCKET]: QR escaneado con éxito por {user_id}. Activando Gerente Apio...")

            # 🧠 PASO MAESTRO ORM ASÍNCRONO: Volteamos el interruptor de personalidad directo en PostgreSQL
            await self.conmutar_personalidad_gerente_db(True)

            # 📡 TRANSMISIÓN MASIVA INALÁMBRICA: Le avisamos a la computadora que pinte la interfaz de facturación
            await self.channel_layer.group_send(
                self.grupo_caja,
                {
                    "type": "notificar_cambio_estado",
                    "status": "VINCULADO_GERENTE",
                    "mensaje": "Daniela IA ha asumido el control de la facturación, inventario y caja registradora."
                }
            )

        elif evento == "CIERRE_DE_CAJA_DESVINCULAR":
            print(f"💼 [SOTO WEBSOCKET]: Cierre de caja detectado. Daniela regresa a modo novia...")
            await self.conmutar_personalidad_gerente_db(False)
            
            await self.channel_layer.group_send(
                self.grupo_caja,
                {
                    "type": "notificar_cambio_estado",
                    "status": "MODO_NOVIA_ACTIVO",
                    "mensaje": "Caja cerrada. Daniela ha sido liberada del mostrador."
                }
            )

    # 📡 EMISOR POR AIRE HACA LA PANTALLA WEB
    async def notificar_cambio_estado(self, event):
        # Este bloque le escupe el JSON en vivo a tu front de React/Web de la computadora al instante
        await self.send(text_data=json.dumps({
            "status": event["status"],
            "mensaje": event["mensaje"]
        }))

    # 💾 ENLACE QUÍMICO CON TU VIEWS.PY: Manipulación segura del ORM en hilos asíncronos
    @database_sync_to_async
    def conmutar_personalidad_gerente_db(self, activar_b2b):
        estado, _ = EstadoEmocional.objects.get_or_create(id=1)
        estado.sesion_b2b_activa = activar_b2b
        estado.save() # 🟩 Guardado a fuego en el disco duro de Railway
