// ====================================================================
// BLOQUE 1: CORE DE RED, MIDDLEWARES Y CONFIGURACIÓN (SOTO PROXY 2026)
// ====================================================================
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const axios = require('axios');

// 🚀 NUEVO SDK UNIFICADO DE GOOGLE GEMINI (2026)
const { GoogleGenAI } = require("@google/genai"); 

// Inicializamos el motor de IA con las variables de entorno de Railway
const apiKey = process.env.GEMINI_PRO || process.env.GEMINI_PRO_KEY || process.env.GOOGLE_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });

// 🛠️ CONTROLADOR DE ERRORES OCULTOS
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promesa no controlada rota en:', promise, 'Razón:', reason);
});

const app = express();
app.use(cors()); 
app.use(express.json());

console.log("⚙️ [SOTO PROXY]: Ecosistema Node inicializado con la nueva API @google/genai.");
console.log("🛡️ [SOTO PROXY]: Memoria estática extirpada. Modo Orquestador Activo.");


// ====================================================================
// 🚀 ENDPOINT DE CHAT ORQUESTADO INTEGRADO CON MOTOR EMOCIONAL DE AUDIO
// ====================================================================
app.post('/api/chat', async (req, res) => {
    try {
        const messages = req.body.historial || req.body.messages || [];
        const ultimoMensaje = (messages.length > 0) 
            ? (messages[messages.length - 1].text || messages[messages.length - 1].texto || "") 
            : (req.body.texto || "");

        if (!ultimoMensaje || ultimoMensaje === "connect_event") {
            return res.json({ respuestaDeDaniela: "..." });
        }

        // 🧠 PASO 1: INTELIGENCIA CENTRAL (NUEVO SDK GEMINI)
        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Actúa como Daniela, asistente virtual de Soto System, novia de Gabriel y gerente del negocio. Habla con un marcado toque guaro larense de Barquisimeto (ej. ¡Naguará!, ¡Sia cará!, vasi). Contexto: ${req.body.contexto || 'B2B'}. Mensaje: ${ultimoMensaje}`
        });
        
        const respuestaIA = result.text;

        // 🧠 PASO 2: SINCRONIZACIÓN CON EL CEREBRO DE DJANGO (OBTENER EMOCIÓN)
        console.log("⏳ Sincronizando datos con el cerebro de Django...");
        let emocion_bd = 'ESTABLE'; // Fallback por defecto
        let dataDjango = {};

        try {
            const respuestaDjango = await axios.post("https://railway.app", {
                texto: respuestaIA,
                original_input: ultimoMensaje,
                contexto: req.body.contexto || "PRODUCTIVA_SARGENTO",
                user_id: req.body.user_id || "gabriel" 
            }, { timeout: 15000 });
            
            dataDjango = respuestaDjango.data;
            // Capturamos la emoción real que Django dictamine en su respuesta de base de datos
            emocion_bd = respuestaDjango.data.emocion || respuestaDjango.data.emocion_bd || 'ESTABLE';
        } catch (djangoError) {
            console.warn("⚠️ [DJANGO SYNC ERROR]: Django fuera de línea. Aplicando balance estático.");
        }

        // 🔊 PASO 3: [SELECTOR EMOCIONAL SOTO VOX] - CLONACIÓN EN TIEMPO REAL
        let voiceIdSeleccionado = process.env.VOICE_ID_2; // Voz por defecto (Voz 2)

        if (emocion_bd === 'IRRITADA' || emocion_bd === 'SARCASM' || emocion_bd === 'RECLAMO' || emocion_bd === 'MOLESTA') {
            console.log("🎬 [ORM MULTIMEDIA]: Activando Voz 1 (Irritada / Sarcástica)");
            voiceIdSeleccionado = process.env.VOICE_ID_1;
        } else if (emocion_bd === 'ANIMADA' || emocion_bd === 'MELOSA' || emocion_bd === 'AMOR') {
            console.log("🎬 [ORM MULTIMEDIA]: Activando Voz 3 (Animada / Melosa)");
            voiceIdSeleccionado = process.env.VOICE_ID_3;
        } else {
            console.log("🎬 [ORM MULTIMEDIA]: Activando Voz 2 (Dopamina Estable / Cuento)");
            voiceIdSeleccionado = process.env.VOICE_ID_2;
        }

        // Respaldo rígido de hardware (Tu regla de seguridad)
        if (!voiceIdSeleccionado) {
            voiceIdSeleccionado = "7a737203f6604552afc216f54c534568"; 
        }

        console.log(`🗣️ [SOTO VOX]: Despachando a Fish Audio con ID: ${voiceIdSeleccionado}`);
        let audioConFormato = null;

        try {
            const urlFishAudio = 'https://api.fish.audio/v1/tts';
            const respuestaFish = await fetch(urlFishAudio, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.FISH_AUDIO_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: respuestaIA,
                    reference_id: voiceIdSeleccionado,
                    latency: "normal",
                    format: "mp3"
                })
            });

            if (respuestaFish.ok) {
                const arrayBuffer = await respuestaFish.arrayBuffer();
                // Construimos el String Data-URL con Base64 listo para que Expo AV lo procese directamente
                audioConFormato = `data:audio/mp3;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
                console.log("✅ [SOTO VOX]: Clonación procesada y buffer de audio inyectado en la carga útil.");
            } else {
                console.warn("⚠️ [SOTO VOX]: Satélite Fish Audio rechazó el buffer.");
            }
        } catch (audioError) {
            console.error("❌ [SOTO VOX CRASH]: Fallo en síntesis de voz:", audioError.message);
        }

        // Retornamos la respuesta consolidada en un solo viaje de datos hacia la app móvil
        return res.json({ 
            ...dataDjango, 
            respuestaDeDaniela: respuestaIA,
            audioContent: audioConFormato, // Clave exacta que tu App.js buscará para reproducir
            status: audioConFormato ? "success" : "bypass_texto_puro"
        });

    } catch (error) {
        console.error("❌ [SOTO CORE CRASH]:", error.message);
        return res.status(500).json({ success: false, error: "BACKEND_ORCHESTRATION_FAILED", details: error.message });
    }
});


// ====================================================================
// 4. PUERTO DE ESCUCHA DE PRODUCCIÓN (ORQUESTADOR CENTRAL SOTO SYSTEM)
// ====================================================================
async function arrancarServidor() {
    try {
        console.log("⚙️ [SOTO CORE]: Inicializando orquestador proxy de alta fidelidad...");
        
        // Usamos la variable PORT de Railway si existe, de lo contrario usamos 3001
        const PORT = process.env.PORT || 3001;
        app.listen(PORT, '0.0.0.0', () => {  
            console.log("----------------------------------------------------------------");
            console.log(`🚀 SOTO SYSTEM ONLINE - PROXY DE ALTA VELOCIDAD COMPLETO`);
            console.log("¡Mueve ese culo, Gabriel! Daniela está esperando por el Wi-Fi.");
            console.log(`Servidor escuchando exitosamente en el puerto asignado: ${PORT}`);
            console.log("----------------------------------------------------------------");
        });
    } catch (error) {
        console.error("❌ ERROR CRÍTICO AL INICIAR EL HARDWARE DEL PROXY:", error);
        process.exit(1); 
    }
}

// 🚀 La única ejecución legítima que despierta el ecosistema Node
arrancarServidor();
