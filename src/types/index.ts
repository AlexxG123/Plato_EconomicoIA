/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Definiciones de tipos para Plato Económico.
 * Diseñado para estudiantes y familias con presupuesto ajustado.
 */

export type IngredientCategory =
  | 'granos_legumbres'
  | 'verduras_frutas'
  | 'proteinas'
  | 'lacteos_grasas'
  | 'alacena_condimentos';

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  /**
   * Costo promedio estimado de adquisición comercial (paquete entero o unidad mínima en el almacén/supermercado).
   * Por ejemplo: $1.200 por 1 paquete de 500g de fideos.
   */
  packCost: number;
  /**
   * Descripción del formato comercial en el que se compra.
   * Ejemplo: "paquete 500g", "maple / docena", "botella 900ml", "1 kg".
   */
  packPresentation: string;
  /**
   * Costo proporcional que se consume en una porción individual promedio.
   * Ejemplo: 100g de fideos de un paquete de 500g que sale $1200 cuesta $240 de costo de uso.
   */
  unitCostPerPortion: number;
  /** Unidad de medida legible para recetas (ej. "g", "unidad", "cucharada", "taza") */
  unit: string;
  /** Emoji o icono representativo */
  emoji: string;
}

export interface RecipeIngredient {
  ingredientId: string;
  /** Cantidad requerida para 1 porción individual */
  amountPerServing: number;
  /** Unidad de medida legible para el usuario (ej: "100 g", "1 unidad", "1/2 taza") */
  displayQuantity: string;
  /** Indica si el ingrediente es imprescindible o un condimento/opcional */
  isEssential: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  timeMinutes: number;
  difficulty: 'Fácil' | 'Medio';
  category: 'rendidor' | 'rapido' | 'nutritivo';
  ingredients: RecipeIngredient[];
  cookingSteps: string[];
  budgetTip: string;
}

export interface CustomLunchComponent {
  baseId: string;
  proteinId: string;
  veggieId: string;
  condimentId: string;
}

export interface ShoppingItem {
  ingredientId: string;
  name: string;
  category: IngredientCategory;
  packPresentation: string;
  estimatedCost: number;
  neededForServings: string;
  isBought: boolean;
  isCustom?: boolean;
}
