/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Ingredient, IngredientCategory } from '../types';

/**
 * Catálogo base de ingredientes económicos accesibles.
 * Los precios están estimados en valores promedio de mercado barrial / almacén / verdulería.
 * 
 * NOTA PARA MANTENIMIENTO:
 * - 'packCost': Es el dinero efectivo que el estudiante o la familia tiene que pagar en la caja
 *   si NO tiene nada en casa (ejemplo: compras el paquete entero de 500g de fideos).
 * - 'unitCostPerPortion': Es el costo real de lo consumido en una comida individual
 *   (para no sobreestimar el costo de 'un almuerzo' cuando compras un litro de aceite y solo usas una cucharada).
 */
export const INITIAL_INGREDIENTS: Ingredient[] = [
  // --- GRANOS, HARINAS Y LEGUMBRES (La base más rendidora para presupuestos justos) ---
  {
    id: 'arroz',
    name: 'Arroz blanco',
    category: 'granos_legumbres',
    packCost: 1400,
    packPresentation: 'Paquete de 1 kg',
    unitCostPerPortion: 160, // ~100g cocido rinde un plato abundante
    unit: 'g',
    emoji: '🍚'
  },
  {
    id: 'fideos',
    name: 'Fideos secos (guiseros o largos)',
    category: 'granos_legumbres',
    packCost: 1200,
    packPresentation: 'Paquete de 500 g',
    unitCostPerPortion: 240, // ~100g por porción
    unit: 'g',
    emoji: '🍝'
  },
  {
    id: 'lentejas',
    name: 'Lentejas secas',
    category: 'granos_legumbres',
    packCost: 1600,
    packPresentation: 'Paquete de 400 g',
    unitCostPerPortion: 280, // Súper saciante y llena de hierro
    unit: 'g',
    emoji: '🍲'
  },
  {
    id: 'polenta',
    name: 'Polenta (harina de maíz)',
    category: 'granos_legumbres',
    packCost: 950,
    packPresentation: 'Paquete de 500 g',
    unitCostPerPortion: 150,
    unit: 'g',
    emoji: '🌽'
  },
  {
    id: 'harina',
    name: 'Harina común 000',
    category: 'granos_legumbres',
    packCost: 900,
    packPresentation: 'Paquete de 1 kg',
    unitCostPerPortion: 110,
    unit: 'g',
    emoji: '🌾'
  },
  {
    id: 'avena',
    name: 'Avena arrollada',
    category: 'granos_legumbres',
    packCost: 1300,
    packPresentation: 'Bolsa de 500 g',
    unitCostPerPortion: 190,
    unit: 'g',
    emoji: '🥣'
  },

  // --- VERDURAS Y TUBÉRCULOS (Compradas al kilo en verdulería barrial) ---
  {
    id: 'papa',
    name: 'Papas',
    category: 'verduras_frutas',
    packCost: 1100,
    packPresentation: '1 kg en verdulería',
    unitCostPerPortion: 260, // 1 papa mediana (~200g)
    unit: 'unidad',
    emoji: '🥔'
  },
  {
    id: 'cebolla',
    name: 'Cebolla',
    category: 'verduras_frutas',
    packCost: 950,
    packPresentation: '1 kg en verdulería',
    unitCostPerPortion: 120, // 1/2 cebolla por plato
    unit: 'unidad',
    emoji: '🧅'
  },
  {
    id: 'zanahoria',
    name: 'Zanahorias',
    category: 'verduras_frutas',
    packCost: 1000,
    packPresentation: '1 kg en verdulería',
    unitCostPerPortion: 140, // 1 zanahoria mediana
    unit: 'unidad',
    emoji: '🥕'
  },
  {
    id: 'tomate',
    name: 'Tomates redondos',
    category: 'verduras_frutas',
    packCost: 1500,
    packPresentation: '1 kg en verdulería',
    unitCostPerPortion: 350,
    unit: 'unidad',
    emoji: '🍅'
  },
  {
    id: 'zapallito',
    name: 'Zapallitos verdes / Zucchini',
    category: 'verduras_frutas',
    packCost: 1300,
    packPresentation: '1 kg en verdulería',
    unitCostPerPortion: 250,
    unit: 'unidad',
    emoji: '🥒'
  },
  {
    id: 'ajo',
    name: 'Ajo (cabeza entera)',
    category: 'verduras_frutas',
    packCost: 600,
    packPresentation: '1 cabeza entera',
    unitCostPerPortion: 60, // 1 o 2 dientes
    unit: 'diente',
    emoji: '🧄'
  },
  {
    id: 'espinaca',
    name: 'Espinaca o acelga fresca',
    category: 'verduras_frutas',
    packCost: 1200,
    packPresentation: '1 atado grande',
    unitCostPerPortion: 300,
    unit: 'atado',
    emoji: '🥬'
  },

  // --- PROTEÍNAS ECONÓMICAS Y NUTRITIVAS ---
  {
    id: 'huevos',
    name: 'Huevos',
    category: 'proteinas',
    packCost: 2400,
    packPresentation: 'Media docena (6 unidades)',
    unitCostPerPortion: 400, // 1 huevo grande rinde como proteína accesible
    unit: 'unidad',
    emoji: '🥚'
  },
  {
    id: 'atun',
    name: 'Atún en lata (al agua o aceite)',
    category: 'proteinas',
    packCost: 2100,
    packPresentation: 'Lata de 170 g',
    unitCostPerPortion: 1050, // 1/2 lata rinde una comida
    unit: 'lata',
    emoji: '🐟'
  },
  {
    id: 'pollo',
    name: 'Pechuga o suprema de pollo',
    category: 'proteinas',
    packCost: 3200,
    packPresentation: 'Bandeja de 500 g',
    unitCostPerPortion: 800, // ~120g desmenuzado
    unit: 'g',
    emoji: '🍗'
  },
  {
    id: 'carne_picada',
    name: 'Carne picada especial',
    category: 'proteinas',
    packCost: 3600,
    packPresentation: 'Bandeja de 500 g',
    unitCostPerPortion: 900,
    unit: 'g',
    emoji: '🥩'
  },
  {
    id: 'arvejas_lata',
    name: 'Arvejas en lata',
    category: 'proteinas',
    packCost: 900,
    packPresentation: 'Lata de 300 g',
    unitCostPerPortion: 300,
    unit: 'lata',
    emoji: '🟢'
  },

  // --- LÁCTEOS, ACEITES Y GRASAS ---
  {
    id: 'aceite',
    name: 'Aceite de girasol',
    category: 'lacteos_grasas',
    packCost: 1900,
    packPresentation: 'Botella de 900 ml',
    unitCostPerPortion: 80, // 1 cucharada sopera para saltear
    unit: 'cucharada',
    emoji: '🫗'
  },
  {
    id: 'leche',
    name: 'Leche entera o descremada',
    category: 'lacteos_grasas',
    packCost: 1300,
    packPresentation: 'Sachet de 1 litro',
    unitCostPerPortion: 260, // 1 taza (~200ml)
    unit: 'ml',
    emoji: '🥛'
  },
  {
    id: 'queso_rallado',
    name: 'Queso rallado o cremoso',
    category: 'lacteos_grasas',
    packCost: 1500,
    packPresentation: 'Sobre o trozo de 100 g',
    unitCostPerPortion: 350,
    unit: 'g',
    emoji: '🧀'
  },
  {
    id: 'manteca',
    name: 'Manteca / Margarina',
    category: 'lacteos_grasas',
    packCost: 1400,
    packPresentation: 'Pan de 100 g',
    unitCostPerPortion: 140,
    unit: 'g',
    emoji: '🧈'
  },

  // --- ALACENA, CONDIMENTOS Y SALSAS BÁSICAS ---
  {
    id: 'pure_tomate',
    name: 'Puré de tomate / Tomate triturado',
    category: 'alacena_condimentos',
    packCost: 850,
    packPresentation: 'Tetra brik de 520 g',
    unitCostPerPortion: 220,
    unit: 'g',
    emoji: '🥫'
  },
  {
    id: 'sal',
    name: 'Sal fina de mesa',
    category: 'alacena_condimentos',
    packCost: 700,
    packPresentation: 'Paquete de 500 g',
    unitCostPerPortion: 20,
    unit: 'pizca',
    emoji: '🧂'
  },
  {
    id: 'oregano',
    name: 'Orégano o condimento para pizza',
    category: 'alacena_condimentos',
    packCost: 550,
    packPresentation: 'Sobre de 25 g',
    unitCostPerPortion: 40,
    unit: 'pizca',
    emoji: '🌿'
  },
  {
    id: 'caldo',
    name: 'Cubito de caldo de verduras',
    category: 'alacena_condimentos',
    packCost: 650,
    packPresentation: 'Cajita de 2 cubos',
    unitCostPerPortion: 150,
    unit: 'cubo',
    emoji: '🍲'
  }
];

export const CATEGORY_LABELS: Record<IngredientCategory, { label: string; icon: string }> = {
  granos_legumbres: { label: 'Granos y Legumbres', icon: '🌾' },
  verduras_frutas: { label: 'Verdulería', icon: '🥕' },
  proteinas: { label: 'Proteínas y Huevos', icon: '🥚' },
  lacteos_grasas: { label: 'Lácteos y Aceites', icon: '🥛' },
  alacena_condimentos: { label: 'Alacena y Salsas', icon: '🥫' }
};
