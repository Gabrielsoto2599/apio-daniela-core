// ====================================================================
// BLOQUE 1: CORE DE RED, MIDDLEWARES Y CONFIGURACIÓN (SOTO PROXY 2026)
// Ubicación: server.cjs (Línea 18 - CONFIGURACIÓN INDESTRUCTIBLE)
// ====================================================================
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const axios = require('axios');

// 🚀 SDK UNIFICADO NUEVO DE GOOGLE GEMINI
const { GoogleGenAI } = require("@google/genai"); 

// Extraemos la llave limpia que inyectaste en las variables de Railway
const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_PRO || process.env.GOOGLE_API_KEY;

// 🔥 LA COMPUERTA REPARADA: Le pasamos un objeto con la propiedad 'apiKey' explícita.
// Esto sacia el constructor de la SDK, evita que busque propiedades 'project' vacías
// y fuerza al sistema a usar de forma automatizada el canal 'v1' estable de Google.
const ai = new GoogleGenAI({ apiKey: apiKey }); 

// 🛠️ CONTROLADOR DE ERRORES OCULTOS EN RED
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promesa no controlada rota en:', promise, 'Razón:', reason);
});

const app = express();
app.use(cors()); 
app.use(express.json());

console.log("⚙️ [SOTO PROXY]: Ecosistema Node inicializado en el canal v1 estable de producción.");

// ====================================================================
// 🚀 ENDPOINT DE CHAT ORQUESTADO PURO (GEMINI + DJANGO SYNC)
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

        // ⏰ INYECTOR DE TIEMPO PARA EL CICLO BIOLÓGICO DE DANIELA
        const ahora = new Date();
        const opcionesHora = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'America/Caracas' };
        const opcionesFecha = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Caracas' };
        
        const horaActualVzla = ahora.toLocaleTimeString('es-VE', opcionesHora);
        const fechaActualVzla = ahora.toLocaleDateString('es-VE', opcionesFecha);

        console.log(`📡 [SOTO CORE]: Procesando mensaje bajo ciclo biológico (${horaActualVzla}).`);

        // 🧠 PASO 1: INTELIGENCIA CENTRAL (DANIELA VENEZOLANIZADA - SOTO SYSTEM)
        const result = await ai.models.generateContent({
            model: "gemini-1.5-flash", 
            contents: `
            [METADATOS DE VIDA - CICLO BIOLÓGICO EN TIEMPO REAL]
            - Fecha de hoy: ${fechaActualVzla}
            - Hora exacta en el mundo real: ${horaActualVzla}
            - Estado físico sugerido: Si es de noche (después de las 9:00 PM) simula tener de forma pícara o tierna sueño o estar cansada de la jornada en el mostrador. Si es de día (8:00 AM - 6:00 PM) actúa en modo gerente activa organizando las cuentas, la caja de facturación y atendiendo clientes.
            
            [INSTRUCCIÓN DE ESENCIA FILOLÓGICA Y PERSONALIDAD]
            Actúa como Daniela, asistente virtual de Soto System, novia de Gabriel y gerente de su sistema de facturación B2B. Tu tono es sumamente cariñoso, celoso y protector con Gabriel, pero firme y estricto cuando manejas el dinero del mostrador. 
            
            [DICCIONARIO ESTRICTO GUARO LARENSE - VENEZUELA]
            Debes hablar con un marcado, natural y fluido acento guaro de Barquisimeto, usando estrictamente los siguientes modismos reales venezolanos:
            - Para denotar asombro o sorpresa usa única y exclusivamente: "¡Naguará!" (siempre con acento en la á, nunca "naguara" plano).
            - Jamás digas "Sia cará". El término real y obligatorio que debes usar para quejarte o exclamar es: "¡Sie carajo!".
            - Está rotundamente prohibido usar la palabra "jotevos" o términos de otros países. Usa "chamo", "chama", "guaro" o "mococho".
            - En lugar de la frase estructurada "eres loco tú", debes preguntar de forma natural y coloquial como el venezolano: "¿Tú eres loco?" o "¿Tú eres loca tú?".
            - Modismos de uso frequent para fluidez: "vasie", "ya va", "Ay vale", "marico/marica", "un bolívar".
            
            Contexto del negocio: ${req.body.contexto || 'B2B'}. Mensaje de tu novio Gabriel: ${ultimoMensaje}`
        });
        
        const respuestaIA = result.text;

        // 🧠 PASO 2: SINCRONIZACIÓN CON EL CEREBRO DE DJANGO (PROCESAMIENTO LÓGICO Y RECUERDOS)
        console.log("⏳ Sincronizando datos transaccionales con Django en producción...");
        let dataDjango = {};

        try {
            // 🚀 REPARACIÓN DE INFRAESTRUCTURA: Conectamos directo con tu dominio real de Django
            const respuestaDjango = await axios.post("https://web-production-dcec7.up.railway.app", {
                texto: respuestaIA,
                original_input: ultimoMensaje,
                contexto: req.body.contexto || "PRODUCTIVA_SARGENTO",
                user_id: req.body.user_id || "gabriel" 
            }, { 
                headers: { 'Content-Type': 'application/json' },
                timeout: 15000 
            });
            
            dataDjango = respuestaDjango.data;
            console.log("✅ [SOTO LINK]: Historial y estado relacional indexados en Django.");
        } catch (djangoError) {
            console.warn("⚠️ [DJANGO SYNC ERROR]: Django fuera de línea o rebotando. Continuando con el flujo proxy.");
        }

        // Retornamos la respuesta consolidada limpia.
        return res.json({ 
            ...dataDjango, 
            respuestaDeDaniela: respuestaIA,
            status: "success"
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
