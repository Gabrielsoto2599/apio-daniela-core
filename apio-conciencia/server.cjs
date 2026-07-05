// ====================================================================
// BLOQUE 1: CORE DE RED, MIDDLEWARES Y CONFIGURACIÓN (SOTO PROXY 2026)
// ====================================================================
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const axios = require('axios');

// 🛠️ CONTROLADOR DE ERRORES OCULTOS: Evita que Node se apague sin decir el porqué
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promesa no controlada rota en:', promise, 'Razón:', reason);
});

const app = express();

app.use(cors()); 
app.use(express.json());

// --- CONFIGURACIÓN DE CREDENCIALES FORZADA A PRODUCCIÓN ---
// Se conserva como respaldo para el módulo multimedia de Fish Audio
const miApiKey = process.env.GEMINI_PRO || process.env.GEMINI_PRO_KEY || process.env.GOOGLE_API_KEY;

console.log("⚙️ [SOTO PROXY]: Ecosistema Node inicializado en limpio.");
console.log("🛡️ [SOTO PROXY]: Memoria estática de LangChain extirpada. Modo relacional activo.");

// ====================================================================
// 🚀 ENDPOINT DE CHAT PURIFICADO - TUBERÍA ESTRICTA NODE-DJANGO
// ====================================================================
app.post('/api/chat', async (req, res) => {
    let ultimoMensaje = "";
    try {
        const messages = req.body.historial || req.body.messages || [];
        
        ultimoMensaje = (messages.length > 0) 
            ? (messages[messages.length - 1].text || messages[messages.length - 1].texto || "") 
            : (req.body.texto || "");

        if (!ultimoMensaje || ultimoMensaje.trim() === "" || ultimoMensaje === "connect_event") {
            return res.json({ respuestaDeDaniela: "..." });
        }

        // 🧠 LOG HOMOLOGADO HISTÓRICO DE GABRIEL
        console.log("🧠 Memoria local consultada.");
        console.log("⏳ Enviando prompt seguro vía Axios directo al Cerebro de Django...");

        const respuestaDjango = await axios.post("https://railway.app", {
            texto: ultimoMensaje,
            contexto: req.body.contexto || "NOVIA_POSESIVA",
            historial: messages,
            user_id: req.body.user_id || "gabriel" 
        }, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 15000
        });

        console.log("✅ [SOTO SYSTEM]: Cerebro de Django respondió con éxito.");
        return res.json(respuestaDjango.data);

    } catch (error) {
        // 🛡️ CONTROL DE CAÍDAS PURO: Si Django falla, el proxy se limita a reportar el error técnico real sin inventar texto
        console.error("❌ [SOTO CORE CRASH]: Conexión rechazada o caída en el motor de Django:", error.message);
        
        return res.status(500).json({
            success: false,
            error: "BACKEND_DISCONNECTED",
            details: error.message
        });
    }
});

// ====================================================================
// 3. RUTA DE TEXT-TO-SPEECH (SELECTOR EMOCIONAL UNIFICADO A 3 VOCES REALES)
// ====================================================================
app.post('/api/tts', async (req, res) => {
    try {
        const { texto, emocion_bd } = req.body; // Capturamos la emoción relacional de Django
        if (!texto) return res.status(400).json({ error: "No hay texto para clonar" });

        // 🚀 REGLA DE ORO DE GABRIEL: Voz por defecto - Voz 2 (Dopamina estable / Cuento)
        let voiceIdSeleccionado = process.env.VOICE_ID_2; 

        // 🧠 MAPEO INTELIGENTE COMPATIBLE CON TU INVENTARIO DE CRÉDITOS ACTUAL
        if (emocion_bd === 'IRRITADA' || emocion_bd === 'SARCASM' || emocion_bd === 'RECLAMO' || emocion_bd === 'MOLESTA') {
            // 🔥 Si Django dice que está molesta o reclamando, forzamos la Voz 1 (Irritada / Sarcástica)
            console.log("🎬 [ORM MULTIMEDIA]: Activando Voz 1 (Irritada / Sarcástica)");
            voiceIdSeleccionado = process.env.VOICE_ID_1;
            
        } else if (emocion_bd === 'ANIMADA' || emocion_bd === 'MELOSA' || emocion_bd === 'AMOR') {
            // 🔥 Si se pone cariñosa, dulce o habla de Kira/Thiago, forzamos la Voz 3 (Animada)
            console.log("🎬 [ORM MULTIMEDIA]: Activando Voz 3 (Animada / Melosa)");
            voiceIdSeleccionado = process.env.VOICE_ID_3;
            
        } else {
            // 🛡️ Para estados estables, diligencias o transacciones contables, usamos la Voz 2 (Estable)
            console.log("🎬 [ORM MULTIMEDIA]: Activando Voz 2 (Dopamina Estable / Cuento)");
            voiceIdSeleccionado = process.env.VOICE_ID_2;
        }

        // Respaldo rígido de hardware por si acaso fallan las variables del .env
        if (!voiceIdSeleccionado) {
            voiceIdSeleccionado = "7a737203f6604552afc216f54c534568"; 
        }

        console.log(`🗣️ [SOTO VOX]: Despachando audio a Fish Audio con ID: ${voiceIdSeleccionado}`);

        const ttsToken = process.env.FISH_AUDIO_KEY;
        const urlFishAudio = 'https://api.fish.audio/v1/tts';
        
        const respuestaFish = await fetch(urlFishAudio, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ttsToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: texto,
                reference_id: voiceIdSeleccionado, // Mapeo exacto del clon activo
                latency: "normal",
                format: "mp3"
            })
        });

        if (respuestaFish.ok) {
            const arrayBuffer = await respuestaFish.arrayBuffer();
            const audioConFormato = `data:audio/mp3;base64,${Buffer.from(arrayBuffer).toString('base64')}`;

            console.log("✅ [SOTO VOX]: Clonación procesada y buffer de audio cargado en RAM.");
            return res.json({ success: true, audioContent: audioConFormato, status: "success" });

        } else {
            // 🛡️ RESPALDO AUTOMÁTICO DE SEGURIDAD INTEGRAL (PROTECCIÓN DE HARDWARE)
            console.warn("⚠️ [SOTO VOX]: Fish Audio rechazó el buffer. Aplicando bypass de texto puro.");
            return res.json({ 
                success: false, 
                audioContent: null, 
                status: "bypass_texto_puro"
            });
        }

    } catch (error) {
        console.error("❌ Error crítico en el proxy de clonación de voz:", error.message);
        return res.json({ success: false, audioContent: null, status: "catch_bypass" });
    }
});

// ====================================================================
// 4. PUERTO DE ESCUCHA DE PRODUCCIÓN (ORQUESTADOR CENTRAL SOTO SYSTEM)
// ====================================================================
async function arrancarServidor() {
    try {
        console.log("⚙️ [SOTO CORE]: Inicializando orquestador proxy de alta fidelidad...");
        
        const PORT = process.env.PORT || 3001;
        app.listen(PORT, '0.0.0.0', () => { 
            console.log("----------------------------------------------------------------");
            console.log("🚀 SOTO SYSTEM ONLINE - PROXY DE ALTA VELOCIDAD COMPLETO");
            console.log("¡Mueve ese culo, Gabriel! Daniela está esperando por el Wi-Fi.");
            console.log(`Servidor activo en el puerto local y de red: ${PORT}`);
            console.log("----------------------------------------------------------------");
        });
    } catch (error) {
        console.error("❌ ERROR CRÍTICO AL INICIAR EL HARDWARE DEL PROXY:", error);
        process.exit(1); 
    }
}

// 🚀 La única ejecución legítima que despierta el ecosistema Node
arrancarServidor();
