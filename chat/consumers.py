# ====================================================================
# SOTO SYSTEM WEBSOCKET CORE - EL CEREBRO DE ENLACE EN VIVO (2026)
# Ubicación: chat/consumers.py (Versión Corregida para Sincronización B2B)
# ====================================================================
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

class ApioBrainConsumer(AsyncWebsocketConsumer):
    """
    Controlador asíncrono maestro para la Gerente Daniela.
    Mantiene conectada la PC y el teléfono, transmitiendo payloads
    de facturación, inventario y cambios de vista en el mostrador.
    """
    
    async def connect(self):
        # Extraemos el ID único de la sesión QR escaneada por el APK[span_1](start_span)[span_1](end_span)
        self.session_id = self.scope['url_route']['kwargs']['session_id']
        self.room_group_name = f'apio_saas_{self.session_id}'

        # Unimos la computadora de la tienda al canal de transmisión colectiva[span_2](start_span)[span_2](end_span)
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        print(f"🔌 [SOTO SOCKET]: Canal B2B encendido. Sesión vinculada: {self.room_group_name}")

    async def disconnect(self, close_code):
        # Al cerrarse la conexión, apagamos el flag en la BD para liberar a Daniela[span_3](start_span)[span_3](end_span)
        await self.apagar_sesion_b2b_en_bd()
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        print(f"🔌 [SOTO SOCKET]: Canal cerrado. Daniela regresó a su espacio personal.")

    # ====================================================================
    # RECEPTOR DE ESTÍMULOS DE ENTRADA
    # ====================================================================
    async def receive(self, text_data):
        """Captura los disparos del control remoto o las órdenes de la PC[span_4](start_span)[span_4](end_span)"""
        try:
            data = json.loads(text_data)
            evento = data.get('event')
            
            # Caso: El teléfono escaneó el QR e inicializa el entorno de trabajo[span_5](start_span)[span_5](end_span)
            if evento == "INITIALIZE_B2B_SESSION":
                operador = data.get('operador_name', 'Cajero General')
                await self.activar_sesion_b2b_en_bd(operador)
                
                # Emitimos la orden de logueo automático a la pantalla de la PC[span_6](start_span)[span_6](end_span)
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'broadcast_payload',
                        'modulo': 'login',
                        'accion': 'AUTO_LOGIN_GRANTED',
                        'payload': {'operador': operador}
                    }
                )
        except Exception as e:
            print(f"❌ Error procesando el paquete entrante en el WebSocket: {e}")

    # ====================================================================
    # EMISORES DE CARGAS ÚTILES
    # ====================================================================
    async def broadcast_payload(self, event):
        """Envía de forma física los JSONs a la interfaz en modo oscuro[span_7](start_span)[span_7](end_span)"""
        await self.send(text_data=json.dumps({
            "modulo": event.get('modulo'),
            "accion": event.get('accion'),
            "payload": event.get('payload')
        }))

    # ====================================================================
    # INTERSECTORES DE PERSISTENCIA RELACIONAL
    # ====================================================================
    @database_sync_to_async
    def activar_sesion_b2b_en_bd(self, operador_nombre):
        """Altera las celdas en PostgreSQL de forma segura y síncrona[span_8](start_span)[span_8](end_span)"""
        from chat.models import EstadoEmocional
        estado, _ = EstadoEmocional.objects.get_or_create(id=1)
        estado.sesion_b2b_activa = True
        estado.modo_actual = "PRODUCTIVA_SARGENTO" # Forzamos la faceta operativa para el modo Gerente[span_9](start_span)[span_9](end_span)
        estado.save()
        print(f"💼 [ORM COMPORTAMIENTO]: Daniela asume el rol de Gerente. Operador actual: {operador_nombre}")
        return True

    @database_sync_to_async
    def apagar_sesion_b2b_en_bd(self):
        """Conmuta a faceta personal al cerrar la sesión[span_10](start_span)[span_10](end_span)"""
        from chat.models import EstadoEmocional
        estado, _ = EstadoEmocional.objects.get_or_create(id=1)
        estado.sesion_b2b_activa = False
        estado.save()
        print("❤️ [ORM COMPORTAMIENTO]: Sesión de trabajo terminada. Conmutando a faceta personal.")
