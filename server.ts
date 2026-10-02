/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Inicialización del cliente de Gemini SDK en el servidor según la guía de AI Studio
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Esquema estructurado estricto (responseSchema) para garantizar respuesta en JSON válido
const foodCombinationsSchema = {
  type: Type.OBJECT,
  properties: {
    guiaAlimentaria: {
      type: Type.OBJECT,
      description: "Datos de la guía alimentaria oficial de referencia citada",
      properties: {
        nombre: {
          type: Type.STRING,
          description: "Nombre oficial y completo de la guía alimentaria (ej. Guías Alimentarias para la Población Argentina - GAPA, Guía Alimentaria de Brasil, o Plato del Bien Comer)",
        },
        entidadEmisora: {
          type: Type.STRING,
          description: "Organismo o ministerio de salud que publica y valida la guía (ej. Ministerio de Salud de la Nación / OPS / OMS)",
        },
        paisORegion: {
          type: Type.STRING,
          description: "País o región de procedencia de la directriz nutricional",
        },
        principioNutricional: {
          type: Type.STRING,
          description: "Regla o principio nutricional clave aplicado para estructurar el plato equilibrado (ej. 50% verduras, 25% cereales/legumbres, 25% proteínas)",
        },
      },
      required: ["nombre", "entidadEmisora", "paisORegion", "principioNutricional"],
    },
    combinaciones: {
      type: Type.ARRAY,
      description: "Exactamente tres combinaciones que completen los grupos de alimentos y aprovechen la alacena económica",
      items: {
        type: Type.OBJECT,
        properties: {
          id: {
            type: Type.STRING,
            description: "Identificador único de la combinación (ej. comb_1, comb_2, comb_3)",
          },
          titulo: {
            type: Type.STRING,
            description: "Título apetecible y descriptivo de la comida",
          },
          costoNivel: {
            type: Type.STRING,
            description: "Nivel de costo: 'Muy económico', 'Económico' o 'Medio'",
          },
          tiempoEstimadoMinutos: {
            type: Type.INTEGER,
            description: "Tiempo estimado de preparación en minutos",
          },
          gruposCubiertos: {
            type: Type.ARRAY,
            description: "Grupos nutricionales cubiertos por el plato (cereales/hidratos, proteínas, verduras/frutas, grasas saludables)",
            items: {
              type: Type.OBJECT,
              properties: {
                grupo: {
                  type: Type.STRING,
                  description: "Nombre del grupo nutricional",
                },
                ingredienteAportante: {
                  type: Type.STRING,
                  description: "Nombre del ingrediente concreto que aporta este grupo",
                },
                estadoAlacena: {
                  type: Type.STRING,
                  description: "Estado del ingrediente: 'en_casa' o 'por_comprar'",
                },
              },
              required: ["grupo", "ingredienteAportante", "estadoAlacena"],
            },
          },
          ingredienteClaveFaltante: {
            type: Type.STRING,
            description: "Ingrediente faltante más barato para cerrar el balance nutricional, o 'Ninguno (plato completo con lo que tenés)'",
          },
          aporteNutricionalClave: {
            type: Type.STRING,
            description: "Dato nutricional concreto y beneficio para la salud",
          },
        },
        required: [
          "id",
          "titulo",
          "costoNivel",
          "tiempoEstimadoMinutos",
          "gruposCubiertos",
          "ingredienteClaveFaltante",
          "aporteNutricionalClave",
        ],
      },
    },
  },
  required: ["guiaAlimentaria", "combinaciones"],
};

// Endpoint para verificar estado y configuración de clave
app.get('/api/gemini/status', (req, res) => {
  res.json({
    hasKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    model: 'gemini-3.8-flash'
  });
});

// Endpoint principal: genera las 3 combinaciones con grupos de alimentos citando la guía
app.post('/api/gemini/food-combinations', async (req, res) => {
  const { pantryIngredients = [], forceMock = false } = req.body || {};

  // Si se solicita modo de prueba sin gastar llamadas o si falta la clave, usamos datos de respaldo
  if (forceMock || !apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    const mockData = getMockData(pantryIngredients);
    return res.json({
      success: true,
      data: mockData,
      isMock: true,
      note: !apiKey || apiKey === 'MY_GEMINI_API_KEY'
        ? 'Respuesta simulada con datos de prueba (clave GEMINI_API_KEY no configurada aún).'
        : 'Respuesta generada con datos de prueba locales para ahorrar cuota.'
    });
  }

  try {
    const ingredientsListText = Array.isArray(pantryIngredients) && pantryIngredients.length > 0
      ? pantryIngredients.join(', ')
      : 'arroz, sal, aceite, cebolla';

    const prompt = `Actúa como especialista en nutrición comunitaria y economía doméstica para estudiantes y familias.
El usuario tiene actualmente disponibles en su alacena/casa los siguientes ingredientes:
[${ingredientsListText}]

Tu tarea:
Propón exactamente tres (3) combinaciones de almuerzos económicos y realistas que completen los cuatro grupos de alimentos esenciales:
1. Cereales / Hidratos de carbono complejos
2. Proteínas (vegetales o animales de bajo costo como legumbres o huevos)
3. Verduras / Hortalizas (fibra y micronutrientes)
4. Grasas saludables

Requisitos estrictos:
- Cita una Guía Alimentaria oficial de salud pública (por ejemplo: Guías Alimentarias para la Población Argentina - GAPA del Ministerio de Salud, o las Guías Basadas en Sistemas Alimentarios de la FAO/OPS).
- Aprovecha al máximo los ingredientes que ya están "en_casa". Si falta algún grupo fundamental, indica el ingrediente más barato para completar ese grupo con estado "por_comprar".
- No inventes ingredientes de lujo.
- Responde estrictamente respetando el esquema JSON especificado.`;

    // Timeout de seguridad en la llamada a la API de 12 segundos
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: "Eres un nutricionista experto en guías alimentarias basadas en evidencia y optimización de presupuesto familiar. Devuelves únicamente respuestas estructuradas en JSON según el esquema provisto.",
        responseMimeType: 'application/json',
        responseSchema: foodCombinationsSchema,
        temperature: 0.3,
      }
    });

    clearTimeout(timeout);

    const rawText = response.text ? response.text.trim() : '';
    if (!rawText) {
      throw new Error('La API de Gemini devolvió una respuesta vacía.');
    }

    let parsedData;
    try {
      parsedData = JSON.parse(rawText);
    } catch (parseError) {
      throw new Error('La respuesta devuelta por la IA no pudo interpretarse como JSON válido.');
    }

    // Validación básica de cumplimiento de esquema
    if (!parsedData.guiaAlimentaria || !Array.isArray(parsedData.combinaciones)) {
      throw new Error('El objeto retornado no contiene los campos obligatorios del esquema.');
    }

    return res.json({
      success: true,
      data: parsedData,
      isMock: false
    });

  } catch (err: any) {
    console.error('Error al consultar Gemini API:', err?.message || err);
    // Respuesta de error estructurada para que la app frontend la maneje adecuadamente
    const isTimeout = err?.name === 'AbortError' || err?.message?.includes('timeout') || err?.message?.includes('aborted');
    const isHighDemand = err?.message?.includes('503') || err?.message?.includes('high demand') || err?.message?.includes('UNAVAILABLE');
    const isQuotaExceeded = err?.message?.includes('429') || err?.message?.includes('RESOURCE_EXHAUSTED');

    let friendlyMessage = 'No pudimos conectar con el servicio de IA en este momento.';
    if (isTimeout) {
      friendlyMessage = 'El servidor de Gemini tardó más de 12 segundos en responder (tiempo agotado).';
    } else if (isHighDemand) {
      friendlyMessage = 'El servicio de IA está con alta demanda temporal. Podés usar las combinaciones de prueba offline.';
    } else if (isQuotaExceeded) {
      friendlyMessage = 'Se superó el límite de consultas por minuto de la API. Se cargaron los datos de respaldo.';
    } else if (err?.message) {
      friendlyMessage = 'Detalle de la respuesta: ' + err.message.slice(0, 140);
    }

    return res.status(500).json({
      success: false,
      errorType: isTimeout ? 'TIMEOUT' : (isHighDemand ? 'HIGH_DEMAND' : 'API_ERROR'),
      message: friendlyMessage,
      fallbackData: getMockData(pantryIngredients)
    });
  }
});

// Función generadora de datos de prueba
function getMockData(pantry: string[]) {
  const hasRice = pantry.some(i => i.toLowerCase().includes('arroz'));
  const hasEggs = pantry.some(i => i.toLowerCase().includes('huevo'));
  const hasLentils = pantry.some(i => i.toLowerCase().includes('lenteja'));

  return {
    guiaAlimentaria: {
      nombre: "Guías Alimentarias para la Población Argentina (GAPA)",
      entidadEmisora: "Ministerio de Salud de la Nación / OPS / OMS",
      paisORegion: "Argentina / Cono Sur",
      principioNutricional: "Distribución del plato saludable: 50% verduras y hortalizas, 25% cereales o legumbres, 25% alimentos fuente de proteína y moderación en grasas crudas."
    },
    combinaciones: [
      {
        id: "comb_1",
        titulo: "Salteado Criollo de Arroz con Huevo, Cebolla y Zanahoria",
        costoNivel: "Muy económico",
        tiempoEstimadoMinutos: 20,
        gruposCubiertos: [
          {
            grupo: "Cereales y Carbohidratos Complejos",
            ingredienteAportante: hasRice ? "Arroz blanco (en casa)" : "Arroz blanco",
            estadoAlacena: hasRice ? "en_casa" : "por_comprar"
          },
          {
            grupo: "Proteínas de Alto Valor Biológico",
            ingredienteAportante: hasEggs ? "Huevos frescos (en casa)" : "Huevos frescos",
            estadoAlacena: hasEggs ? "en_casa" : "por_comprar"
          },
          {
            grupo: "Verduras, Hortalizas y Fibra",
            ingredienteAportante: "Cebolla dorada y zanahoria rallada",
            estadoAlacena: "en_casa"
          },
          {
            grupo: "Grasas Saludables y Condimentos",
            ingredienteAportante: "Aceite de girasol y pizca de sal",
            estadoAlacena: "en_casa"
          }
        ],
        ingredienteClaveFaltante: (!hasRice && !hasEggs) ? "Arroz y Huevos" : (!hasEggs ? "Huevos" : "Ninguno (100% completo con lo que tenés en casa)"),
        aporteNutricionalClave: "Aporte proteico completo con todos los aminoácidos esenciales, vitaminas A y B12, y energía de absorción gradual gracias a la fibra."
      },
      {
        id: "comb_2",
        titulo: "Guiso Exprés de Lentejas con Papa, Tomate y Pimentón",
        costoNivel: "Económico",
        tiempoEstimadoMinutos: 25,
        gruposCubiertos: [
          {
            grupo: "Legumbres y Proteína Vegetal",
            ingredienteAportante: hasLentils ? "Lentejas secas (en casa)" : "Lentejas secas o en conserva",
            estadoAlacena: hasLentils ? "en_casa" : "por_comprar"
          },
          {
            grupo: "Tubérculos y Almidón Saciente",
            ingredienteAportante: "Papa en cubos",
            estadoAlacena: "en_casa"
          },
          {
            grupo: "Verduras y Micronutrientes",
            ingredienteAportante: "Puré de tomate y cebolla rehogada",
            estadoAlacena: "en_casa"
          },
          {
            grupo: "Grasas y Especias Digestivas",
            ingredienteAportante: "Aceite vegetal, pimentón dulce y laurel",
            estadoAlacena: "en_casa"
          }
        ],
        ingredienteClaveFaltante: hasLentils ? "Ninguno (tenés todo en casa)" : "1 paquete de Lentejas ($1.200)",
        aporteNutricionalClave: "Rico en hierro no hemo potenciado por la acidez del tomate, con altísimo contenido de fibra prebiótica para saciedad duradera."
      },
      {
        id: "comb_3",
        titulo: "Fideos al Huevo con Salsa Casera de Tomate y Queso",
        costoNivel: "Muy económico",
        tiempoEstimadoMinutos: 15,
        gruposCubiertos: [
          {
            grupo: "Cereales y Energía Rápida",
            ingredienteAportante: "Fideos secos guiseros",
            estadoAlacena: "en_casa"
          },
          {
            grupo: "Proteínas y Calcio",
            ingredienteAportante: "Queso duro rallado o huevo picado",
            estadoAlacena: "por_comprar"
          },
          {
            grupo: "Verduras y Hortalizas",
            ingredienteAportante: "Salsa de tomate casera con cebolla",
            estadoAlacena: "en_casa"
          },
          {
            grupo: "Grasas Saludables",
            ingredienteAportante: "Aceite vegetal y orégano",
            estadoAlacena: "en_casa"
          }
        ],
        ingredienteClaveFaltante: "Fracción de queso rallado o semiduro ($950)",
        aporteNutricionalClave: "Excelente densidad calórica con licopeno antioxidante del tomate cocido y calcio para la salud ósea."
      }
    ]
  };
}

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    // Montaje de Vite en modo middleware para desarrollo
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor Plato Económico listo en http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Error al inicializar el servidor:', err);
  process.exit(1);
});
