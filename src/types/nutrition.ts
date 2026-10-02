/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FoodGroupItem {
  grupo: string;
  ingredienteAportante: string;
  estadoAlacena: 'en_casa' | 'por_comprar';
}

export interface FoodCombination {
  id: string;
  titulo: string;
  costoNivel: string;
  tiempoEstimadoMinutos: number;
  gruposCubiertos: FoodGroupItem[];
  ingredienteClaveFaltante: string;
  aporteNutricionalClave: string;
}

export interface DietaryGuideline {
  nombre: string;
  entidadEmisora: string;
  paisORegion: string;
  principioNutricional: string;
}

export interface NutritionCombinationsResponse {
  guiaAlimentaria: DietaryGuideline;
  combinaciones: FoodCombination[];
  isMockData?: boolean;
}
