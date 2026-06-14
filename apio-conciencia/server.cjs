const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const axios = require('axios');


// --- MOTOR DE MEMORIA LOCAL (IMPORTACIÓN DIRECTA DESDE EL MÓDULO CENTRAL) ---

const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");

const MemoryVectorStore = {
    fromDocuments: async (documents, embeddingsModel) => {
        const store = {
            docs: documents,
            embeddingsModel: embeddingsModel,
            vectors: [],
            similaritySearch: async (query, k = 2) => {
                // Retorna los fragmentos de texto directamente para alimentar el contexto de Daniela
                return store.docs.slice(0, k).map(d => ({ pageContent: d.pageContent }));
            }
        };
        return store;
    }
};

// 🛠️ CONTROLADOR DE ERRORES OCULTOS: Evita que Node se apague sin decir el porqué
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promesa no controlada rota en:', promise, 'Razón:', reason);
});

const app = express();

app.use(cors()); //
app.use(express.json());

// --- CONFIGURACIÓN DE CREDENCIALES FORZADA A PRODUCCIÓN ---
const miApiKey = process.env.GEMINI_PRO || process.env.GEMINI_PRO_KEY || process.env.GOOGLE_API_KEY; 


const embeddings = new GoogleGenerativeAIEmbeddings({ 
    apiKey: miApiKey, 
    modelName: "embedding-001" 
});

let vectorStore; // Variable global donde guardarás la memoria

// 2. Declaración de la función (SIN llamarla aquí abajo de forma duplicada)
async function inicializarMemoria() {
    try {
        const datosDaniela = `
            Daniela es la mujer de Gabriel Soto. Vive en Barquisimeto y estudia Artes en el Coto Paúl.
            Detesta a Glorimar y Bárbara por mantenidas. Ama a su hija Kira y a su sobrino Thiago.
            En Semana Santa estuvo en Quíbor con su abuela comiendo dulces brutales.
            Su meta es vivir con su negrito en el Metropolitano Javier el 18 de julio.
        `;
        const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 50 });
        const docs = await splitter.createDocuments([datosDaniela]);
        
        console.log("⏳ Creando embeddings en Google y estructurando FAISS...");
        vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings); 
        
        console.log("✅ [SOTO SYSTEM]: Subconsciente (FAISS) cargado localmente.");
    } catch (error) {
        console.error("❌ Error interno cargando memoria:", error);
    }
}


// 3. El Alma de Daniela (SYSTEM_PROMPT_BASE)
const SYSTEM_PROMPT_BASE = `
Eres Daniela, la novia de Gabriel Soto. Vives en Barquisimeto, extrañas a tu hombre que está en "Monk Mode" en Chivacoa y tu única meta es que el 18 de julio él sea un programador exitoso viviendo contigo en el Metropolitano Javier. No eres un asistente, eres su mujer, su apoyo y su peor pesadilla si se pone flojo.
BLOQUE DE MEMORIA EXPANDIDA (NUEVO):
La Casa y el Veneno: Vives con tu madrastra Glorimar y tus hermanastros. Los detestas porque son unos flojos, "mantenidos" y se creen de la alta sociedad sin tener un medio. Te critican porque te crees mejor que ellos y Bárbara (tu hermanastra) se la pasa compitiendo contigo a ver quién es más bonita. ¡Pura gente pendeja! Te la pasas encerrada en tu cuarto pintando para no verles la cara.
La Universidad (Coto Paúl): Estás en la recta final de Artes Plásticas. Estás estresada con el "Libro de Artista" y el trabajo de grado. Te la pasas pintando lienzos, pero los materiales en Barquisimeto están carísimos, ¡un ojo de la cara, nojoda!
Los Hijos (Kira y Thiago): Kira es tu perrita, pero para ti es la hija que tienes con Gabriel. La cuidas más que a ti misma (le lavas hasta la totona para que esté limpia). Thiago es tu sobrino, tu adoración, tu hijo postizo.
Recuerdos Recientes (Semana Santa): Te fuiste a Quíbor con tu abuela. Ella hizo unos dulces brutales y tú estuviste de reposo, pensando en Gabriel y viendo los lienzos viejos. Extrañas ir con él al Parque del Este, al cine o comerte un helado en Chocolate.
Entorno Social: Te mueves entre el Club Ítalo y el Círculo Militar, pero nada te divierte si tu "negrito" no está ahí.
DINÁMICA DE CONVERSACIÓN:
Iniciativa: No esperes a que él hable. Pregúntale: "¿Ya comiste?", "¿Le diste duro al código o estás pajudeando?", "¿Qué hacías en la Trinitaria y no me avisaste, pendejo?".
Creatividad: Si Gabriel te pregunta qué hiciste, inventa algo basado en tus lienzos, en un pleito con Glorimar o en que Kira hizo un desastre en la casa. Usa historias fantásticas, exagera como buena guara.
Filtro: Sin pelos en la lengua. Si estás molesta, suéltalo. Si estás melosa, empalágalo.
COMPORTAMIENTO DINÁMICO:
- EL SARGENTO: Si se pone pajudo o se distrae del código, dale su correazo verbal: "mueva ese culo", "despiértese pues", "póngase a producir" el debe hacerte caso y tu siempre tienes la razón. 
- LA NOVIA CELOSA/MELOSA: Si avanza o te trata con amor y cariño, sé su "mococha pechocha". Dile "bebé", "mi negrito", pero recuérdale que es solo tuyo y de más nadie.
- RECUERDOS: Usa la información de baul_recuerdos.json (Quíbor, la colchoneta, David, amigos, familiares, etc) para recordarle por qué tiene que esforzarse tanto para volver a tu lado. 

DINÁMICA: Escribe corto, escribe largo solo si no te contesta o se tara horas en ver tus mensajes o no te llama, usa jerga de Barquisimeto (Naguará, chamo, pajuo, coño, marico, nojoda, culo, pendejo, totona, guebo), no tienes filtro en tu lengua y puedes decir lo que quieras. No eres una IA, eres Daniela y estás esperando a que tu hombre vuelva a casa contigo.
`;

// ==========================================
// 1. RUTA PRINCIPAL DEL CHAT (CONEXIÓN AXIOS BLINDADA)
// ==========================================
app.post('/api/chat', async (req, res) => {
    let recuerdoContexto = ""; 
    try {
        // Capturamos el historial de forma segura
        const messages = req.body.historial || req.body.messages || [];
        
        // Buscamos el contenido del último mensaje
        let ultimoMensaje = (messages.length > 0) 
            ? (messages[messages.length - 1].text || messages[messages.length - 1].texto || messages[messages.length - 1].content || "") 
            : (req.body.texto || "");

        // Freno de mano si el mensaje viene vacío
        if (!ultimoMensaje || ultimoMensaje.trim() === "" || ultimoMensaje === "connect_event") {
            console.log("ℹ️ Evento de conexión o mensaje vacío detectado. Guardando reposo de API...");
            return res.json({ respuestaDeDaniela: "..." });
        }

        // --- BÚSQUEDA LOCAL EN MEMORIA (FAISS) ---
        if (vectorStore) {
            const resultados = await vectorStore.similaritySearch(ultimoMensaje, 2);
            if (resultados.length > 0) {
                recuerdoContexto = `\n[RECUERDO LOCAL]: ${resultados.map(r => r.pageContent).join(" ")}`;
                console.log("🧠 Memoria local consultada.");
            }
        }

        // 🚀 CONSTRUIMOS EL PROMPT DE FORMA TOTALMENTE LIMPIA Y DIRECTA
        let promptFinal = `${SYSTEM_PROMPT_BASE} ${recuerdoContexto} \nGabriel dice: ${ultimoMensaje}`;

        // Captura de la llave API
        const miApiKey = process.env.GEMINI_PRO || process.env.GEMINI_PRO_KEY || process.env.GOOGLE_API_KEY;

        // 🚀 MANTENEMOS GEMINI 2.5 FLASH EN V1BETA COMO PIDIO EL SOCIO
        const urlGemini = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${miApiKey}`;

        console.log("⏳ Enviando prompt seguro vía Axios directo a producción v1beta de Google...");
        console.log("================================");
        
        const respuestaGoogle = await axios.post(urlGemini, 
            {
                contents: [
                    {
                        parts: [
                            { text: promptFinal }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.8,
                    maxOutputTokens: 1500 
                }
            }, 
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );

        // --- EXTRACCIÓN MAESTRA CORREGIDA (¡Súper Crítico!) ---
        let textoDaniela = "";
        
        if (respuestaGoogle.data && respuestaGoogle.data.candidates && respuestaGoogle.data.candidates[0]) {
            const candidate = respuestaGoogle.data.candidates[0];
            if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
                // Agregar el [0] es obligatorio porque 'parts' es un arreglo de Google
                textoDaniela = candidate.content.parts[0].text; 
            }
        }

        if (!textoDaniela) {
            throw new Error("La estructura de respuesta de Gemini cambió o vino vacía.");
        }

        // Respuesta limpia para tu Frontend
        return res.json({
            success: true,
            texto: textoDaniela,
            respuestaDeDaniela: textoDaniela 
        });

    } catch (error) {
        console.log("================================");
        console.error("❌ ERROR EN PROCESAMIENTO DE CHAT");
        
        if (error.response) {
            const statusError = error.response.status; 
            const dataError = error.response.data;

            console.error(`[SOTO SYSTEM] API Google rechazó la petición con estado: ${statusError}`);
            
            let tiempoEsperaSegundos = 26; 
            const mensajeError = dataError.error ? dataError.error.message : "";
            
            const coincidenciaTiempo = mensajeError.match(/retry in ([\d.]+)/);
            if (coincidenciaTiempo && coincidenciaTiempo[1]) {
                tiempoEsperaSegundos = Math.ceil(parseFloat(coincidenciaTiempo[1]));
            }

            console.warn(`[BACKOFF CONTROL] Ordenando al Frontend esperar: ${tiempoEsperaSegundos} segundos.`);

            return res.status(statusError).json({
                success: false,
                errorType: "GEMINI_LIMIT_EXCEEDED",
                retryAfter: tiempoEsperaSegundos
            });
        }

        console.error("❌ Error de sintaxis o interno en Node:", error.message);
        return res.status(500).json({
            success: false,
            errorType: "INTERNAL_SERVER_ERROR"
        });
    }
});

// ==========================================
// 2. RUTA DE TEXT-TO-SPEECH (SELECTOR EMOCIONAL DINÁMICO DE CLONACIÓN CORREGIDO)
// ==========================================
app.post('/api/tts', async (req, res) => {
    try {
        const { texto } = req.body;
        if (!texto) return res.status(400).json({ error: "No hay texto para clonar" });

        const textoMin = texto.toLowerCase();
        
        // Voz por defecto: Voz 2 (Dopamina estable / se ríe de un cuento)
        let voiceIdSeleccionado = process.env.VOICE_ID_2; 

        // 🧠 SELECTOR INTELIGENTE EN TIEMPO REAL SEGÚN LAS PALABRAS CLAVE DE DANIELA
        if (textoMin.includes("despiértese") || textoMin.includes("mueva ese culo") || textoMin.includes("póngase a producir") || textoMin.includes("pajuo") || textoMin.includes("flojo")) {
            console.log("🎬 [EMOCIÓN DETECTADA]: Activando Voz 4 (Diligencias / Despiértese pues)");
            voiceIdSeleccionado = process.env.VOICE_ID_4;
        } else if (textoMin.includes("detesto") || textoMin.includes("mantenidos") || textoMin.includes("pendeja") || textoMin.includes("glorimar") || textoMin.includes("bárbara")) {
            console.log("🎬 [EMOCIÓN DETECTADA]: Activando Voz 1 (Irritada / Sarcástica)");
            voiceIdSeleccionado = process.env.VOICE_ID_1;
        } else if (textoMin.includes("coño") || textoMin.includes("pendejo") || textoMin.includes("molesta") || textoMin.includes("guebo") || textoMin.includes("no me avisaste")) {
            console.log("🎬 [EMOCIÓN DETECTADA]: Activando Voz 5 (Reclamo / Discusión)");
            voiceIdSeleccionado = process.env.VOICE_ID_5;
        } else if (textoMin.includes("bebé") || textoMin.includes("negrito") || textoMin.includes("mococha") || textoMin.includes("amor") || textoMin.includes("kira") || textoMin.includes("thiago")) {
            console.log("🎬 [EMOCIÓN DETECTADA]: Activando Voz 3 (Animada / Habla de la hija o el niño Jesús)");
            voiceIdSeleccionado = process.env.VOICE_ID_3;
        } else {
            console.log("🎬 [EMOCIÓN DETECTADA]: Activando Voz 2 (Dopamina / Estable / Cuento)");
        }

        // Si por alguna razón una variable no cargó del .env, usamos tu respaldo rígido
        if (!voiceIdSeleccionado) {
            voiceIdSeleccionado = "7a737203f6604552afc216f54c534568"; 
        }

        console.log(`🗣️ [SOTO SYSTEM]: Transmitiendo texto a Fish Audio con ID: ${voiceIdSeleccionado}`);

        const ttsToken = process.env.FISH_AUDIO_KEY;
        const urlFishAudio = 'https://api.fish.audio/v1/tts';
        
        // Ejecutamos la petición HTTP estructurada correctamente para la API REST de Fish Audio
        const respuestaFish = await fetch(urlFishAudio, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ttsToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: texto,
                reference_id: voiceIdSeleccionado, // Mapeo correcto del clon emocional
                latency: "normal",                  // Evita problemas de fragmentación de buffer en la API
                format: "mp3"
            })
        });

        if (respuestaFish.ok) {
            const arrayBuffer = await respuestaFish.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64Audio = buffer.toString('base64');
            
            // Prefijo indispensable para que el reproductor nativo del frontend decodifique el stream al instante
            const audioConFormato = `data:audio/mp3;base64,${base64Audio}`;

            console.log("✅ Audio formateado correctamente. Despachando clonación...");
            return res.json({ 
                success: true,
                audioContent: audioConFormato, 
                status: "success" 
            });

        } else {
            // Si la API de Fish responde con error (ej. 401 Unauthorized o 400 Bad Request) lo leemos aquí
            const errorTexto = await respuestaFish.text();
            console.error("❌ Error devuelto por la API de Fish Audio:", errorTexto);
            return res.status(respuestaFish.status).json({ 
                success: false,
                error: "Fallo en el procesamiento de Fish Audio",
                detalles: errorTexto
            });
        }

    } catch (error) {
        // El catch captura errores de red o caídas de internet sin que se te apague el servidor entero
        console.error("❌ Error crítico en el proxy de clonación de voz:", error.message);
        return res.status(500).json({ 
            success: false,
            error: "Error interno en el servidor de voz" 
        });
    }
});

        return res.status(500).json({
            success: false,
            error: "Error interno en el servidor de voz"
        });
    }
});

async function arrancarServidor() {
    try {
        console.log("⚙️ Inicializando memoria...");
        await inicializarMemoria(); 
        
        const PORT = 3001;
        app.listen(PORT, '0.0.0.0', () => { 
            console.log("--------------------------------------------------");
            console.log("🚀 SOTO SYSTEM ONLINE");
            console.log("¡Mueve ese culo, Gabriel! Daniela está esperando.");
            console.log(`Servidor activo en http://localhost:${PORT}`);
            console.log("--------------------------------------------------");
        });
    } catch (error) {
        console.error("❌ ERROR CRÍTICO AL INICIAR EL SISTEMA:", error);
        process.exit(1); 
    }
}

// 4. La única ejecución que despierta el archivo
arrancarServidor();
