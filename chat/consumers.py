# ====================================================================
# SOTO SYSTEM WEBSOCKET CORE - EL CEREBRO DE ENLACE EN VIVO (2026)
# Ubicación: chat/consumers.py
# ====================================================================
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async


class ApioBrainConsumer(AsyncWebsocketConsumer):
    """
    Controlador asíncrono maestro. Maneja la sincronización B2B y 
    la conmutación de facetas de Daniela en PostgreSQL.
    """
    
    async def connect(self):
        # Vinculación de sesión única[span_1](start_span)[span_1](end_span)
        self.session_id = self.scope['url_route']['kwargs']['session_id']
        self.room_group_name = f'apio_saas_{self.session_id}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        print(f"🔌 [SOTO SOCKET]: Canal B2B encendido. Sesión: {self.room_group_name}")

    async def disconnect(self, close_code):
        # Conmutación automática a modo personal[span_2](start_span)[span_2](end_span)
        await self.apagar_sesion_b2b_en_bd()
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        print(f"🔌 [SOTO SOCKET]: Canal cerrado. Daniela en faceta personal.")

    async def receive(self, text_data):
        """Captura órdenes de la PC o APK para conmutar estados[span_3](start_span)[span_3](end_span)"""
        try:
            data = json.loads(text_data)
            evento = data.get('event')
            
            if evento == "INITIALIZE_B2B_SESSION":
                operador = data.get('operador_name', 'Cajero General')
                await self.activar_sesion_b2b_en_bd(operador)
                
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
            print(f"❌ Error procesando el paquete entrante: {e}")

    async def broadcast_payload(self, event):
        """Emisor físico de JSONs para la interfaz[span_4](start_span)[span_4](end_span)"""
        await self.send(text_data=json.dumps({
            "modulo": event.get('modulo'),
            "accion": event.get('accion'),
            "payload": event.get('payload')
        }))

    # ====================================================================
    # INTERSECTORES DE PERSISTENCIA (Sincronización con PostgreSQL)
    # ====================================================================
    @database_sync_to_async
    def activar_sesion_b2b_en_bd(self, operador_nombre):
        """Cambia el estado a Gerente operativo[span_5](start_span)[span_5](end_span)"""
        from chat.models import EstadoEmocional
        estado, _ = EstadoEmocional.objects.get_or_create(id=1)
        estado.sesion_b2b_activa = True
        estado.modo_actual = "PRODUCTIVA_SARGENTO" 
        estado.save()
        print(f"💼 [ORM COMPORTAMIENTO]: Daniela asume rol de Gerente.")
        return True

    @database_sync_to_async
    def apagar_sesion_b2b_en_bd(self):
        """Regresa a Daniela a faceta personal[span_6](start_span)[span_6](end_span)"""
        from chat.models import EstadoEmocional
        estado, _ = EstadoEmocional.objects.get_or_create(id=1)
        estado.sesion_b2b_activa = False
        estado.save()
        print("❤️ [ORM COMPORTAMIENTO]: Conmutando a faceta personal.")
