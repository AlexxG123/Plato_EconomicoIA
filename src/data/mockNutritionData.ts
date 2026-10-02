/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NutritionCombinationsResponse } from '../types/nutrition';

/**
 * Ejemplo exacto de respuesta estructurada conforme al responseSchema de Gemini.
 * Permite probar el renderizado y desarrollar la interfaz sin realizar llamadas a la API
 * ni incurrir en consumo de cuota.
 */
export const MOCK_NUTRITION_RESPONSE: NutritionCombinationsResponse = {
  guiaAlimentaria: {
    nombre: "Guías Alimentarias para la Población Argentina (GAPA)",
    entidadEmisora: "Ministerio de Salud de la Nación / OPS / OMS",
    paisORegion: "Argentina / Cono Sur",
    principioNutricional: "Distribución del plato saludable: 50% verduras y hortalizas, 25% cereales o legumbres integrales, 25% alimentos con proteína de calidad y grasas crudas moderadas."
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
          ingredienteAportante: "Arroz blanco o integral",
          estadoAlacena: "en_casa"
        },
        {
          grupo: "Proteínas de Alto Valor Biológico",
          ingredienteAportante: "Huevos frescos",
          estadoAlacena: "en_casa"
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
      ingredienteClaveFaltante: "Ninguno (100% completo con lo que tenés en casa)",
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
          ingredienteAportante: "Lentejas secas o en conserva",
          estadoAlacena: "por_comprar"
        },
        {
          grupo: "Tubérculos y Almidón Saciente",
          ingredienteAportante: "Papa en dados",
          estadoAlacena: "en_casa"
        },
        {
          grupo: "Verduras y Antioxidantes",
          ingredienteAportante: "Puré de tomate con cebolla rehogada",
          estadoAlacena: "en_casa"
        },
        {
          grupo: "Grasas y Especias Digestivas",
          ingredienteAportante: "Aceite vegetal, pimentón dulce y laurel",
          estadoAlacena: "en_casa"
        }
      ],
      ingredienteClaveFaltante: "1 paquete de Lentejas ($1.200)",
      aporteNutricionalClave: "Rico en hierro no hemo potenciado por la acidez del tomate, con altísimo contenido de fibra prebiótica para el tránsito intestinal."
    },
    {
      id: "comb_3",
      titulo: "Fideos Guiseros al Huevo con Salsa Casera y Queso",
      costoNivel: "Muy económico",
      tiempoEstimadoMinutos: 15,
      gruposCubiertos: [
        {
          grupo: "Cereales y Energía Rápida",
          ingredienteAportante: "Fideos guiseros secos",
          estadoAlacena: "en_casa"
        },
        {
          grupo: "Proteínas y Calcio",
          ingredienteAportante: "Queso rallado o huevo picado",
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
      aporteNutricionalClave: "Excelente densidad calórica con licopeno biodisponible del tomate cocido y calcio para la salud ósea."
    }
  ],
  isMockData: true
};
