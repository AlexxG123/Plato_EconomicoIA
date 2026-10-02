/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Clock,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  Users,
  ArrowRight,
  SlidersHorizontal,
  ChefHat,
  Sparkles
} from 'lucide-react';
import { Recipe, Ingredient } from '../types';
import { formatCurrency } from '../utils/formatters';
import { GeminiNutritionAdvisor } from './GeminiNutritionAdvisor';

interface AnalyzedRecipe extends Recipe {
  ingredientsStatus: Array<{
    ingredientId: string;
    amountPerServing: number;
    displayQuantity: string;
    isEssential: boolean;
    name: string;
    emoji: string;
    packCost: number;
    packPresentation: string;
    unitCostPerPortion: number;
    hasIt: boolean;
  }>;
  availableCount: number;
  missingCount: number;
  matchPercentage: number;
  canCookImmediately: boolean;
  costPerPortion: number;
  totalMealCost: number;
  outOfPocketCostToBuy: number;
}

interface LunchBuilderProps {
  recipes: AnalyzedRecipe[];
  selectedRecipeId: string | null;
  onSelectRecipe: (recipeId: string) => void;
  servings: number;
  onChangeServings: (servings: number) => void;
  onGoToShoppingList: () => void;
  allIngredients: Ingredient[];
  pantryIds: string[];
  onAddMissingItemToShoppingList?: (name: string, cost?: number) => void;
}

export const LunchBuilder: React.FC<LunchBuilderProps> = ({
  recipes,
  selectedRecipeId,
  onSelectRecipe,
  servings,
  onChangeServings,
  onGoToShoppingList,
  allIngredients,
  pantryIds,
  onAddMissingItemToShoppingList
}) => {
  const [filterMode, setFilterMode] = useState<'todos' | 'listos' | 'pocos_faltantes'>('todos');
  const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>(null);
  const [viewTab, setViewTab] = useState<'sugeridos' | 'personalizado' | 'balance_ia'>('sugeridos');

  const pantryIngredientsNames = pantryIds
    .map((id) => allIngredients.find((i) => i.id === id)?.name)
    .filter(Boolean) as string[];

  // Estado para armador de almuerzo personalizado a medida
  const [customBase, setCustomBase] = useState('arroz');
  const [customProtein, setCustomProtein] = useState('huevos');
  const [customVeggie, setCustomVeggie] = useState('cebolla');
  const [customCondiment, setCustomCondiment] = useState('aceite');

  // Filtramos las recetas según la disponibilidad de la alacena
  const filteredRecipes = recipes.filter((recipe) => {
    if (filterMode === 'listos') return recipe.canCookImmediately;
    if (filterMode === 'pocos_faltantes') return recipe.missingCount > 0 && recipe.missingCount <= 2;
    return true;
  });

  // Ordenamos para priorizar los platos con mayor coincidencia de ingredientes
  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    if (a.canCookImmediately && !b.canCookImmediately) return -1;
    if (!a.canCookImmediately && b.canCookImmediately) return 1;
    return a.outOfPocketCostToBuy - b.outOfPocketCostToBuy;
  });

  const toggleExpand = (id: string) => {
    setExpandedRecipeId((prev) => (prev === id ? null : id));
  };

  const handleChooseAndProceed = (recipeId: string) => {
    onSelectRecipe(recipeId);
    onGoToShoppingList();
  };

  // Cálculo del plato a medida
  const customSelectedIds = [customBase, customProtein, customVeggie, customCondiment];
  const customItemsData = customSelectedIds
    .map((id) => allIngredients.find((i) => i.id === id))
    .filter(Boolean) as Ingredient[];

  const customPortionCost = customItemsData.reduce((acc, curr) => acc + curr.unitCostPerPortion, 0);
  const customTotalMealCost = customPortionCost * servings;
  const customMissingItems = customItemsData.filter((i) => !pantryIds.includes(i.id));
  const customToBuyCost = customMissingItems.reduce((acc, curr) => acc + curr.packCost, 0);

  return (
    <div className="pb-28">
      {/* Encabezado Función 2 */}
      <div className="mb-4">
        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 tracking-wide uppercase">
          Paso 2 de 3
        </span>
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
          Armar almuerzo y costo estimado
        </h2>
        <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
          Elegí cuántas porciones vas a cocinar. Calculamos el costo por plato y el total exacto que te costaría completar los ingredientes.
        </p>
      </div>

      {/* Control de Porciones / Comensales (Ergonómico para celular) */}
      <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-3.5 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
              ¿Para cuántos cocinás?
            </span>
          </div>
          <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
            {servings === 1 && '👤 1 persona (Estudiante / Solo)'}
            {servings === 2 && '👥 2 personas (Dúo / Pareja)'}
            {servings === 4 && '👨‍👩‍👧‍👦 4 personas (Familia)'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { count: 1, label: '1 plato', desc: 'Estudiante' },
            { count: 2, label: '2 platos', desc: 'Dúo' },
            { count: 4, label: '4 platos', desc: 'Familia' }
          ].map((item) => (
            <button
              type="button"
              key={item.count}
              onClick={() => onChangeServings(item.count)}
              className={`min-h-[46px] py-1.5 px-2 rounded-xl text-center border transition-all ${
                servings === item.count
                  ? 'bg-stone-900 dark:bg-emerald-600 text-white border-stone-900 dark:border-emerald-600 shadow-xs'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
              }`}
            >
              <div className="text-xs font-bold">{item.label}</div>
              <div
                className={`text-[10px] ${
                  servings === item.count
                    ? 'text-stone-300 dark:text-emerald-100'
                    : 'text-stone-500 dark:text-stone-400'
                }`}
              >
                {item.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selector de Modo: Recetas Sugeridas vs Armar Propio vs Nutrición IA */}
      <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl mb-4 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setViewTab('sugeridos')}
          className={`flex-1 min-h-[38px] py-1 px-2.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            viewTab === 'sugeridos'
              ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
          }`}
        >
          🍲 Recetas ({recipes.length})
        </button>
        <button
          type="button"
          onClick={() => setViewTab('personalizado')}
          className={`flex-1 min-h-[38px] py-1 px-2.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center justify-center gap-1 ${
            viewTab === 'personalizado'
              ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
          }`}
        >
          <ChefHat className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>A Medida</span>
        </button>
        <button
          type="button"
          onClick={() => setViewTab('balance_ia')}
          className={`flex-1 min-h-[38px] py-1 px-2.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center justify-center gap-1 ${
            viewTab === 'balance_ia'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Nutrición IA</span>
        </button>
      </div>

      {viewTab === 'sugeridos' ? (
        <>
          {/* Filtros de Cobertura */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
            <button
              type="button"
              onClick={() => setFilterMode('todos')}
              className={`min-h-[36px] px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                filterMode === 'todos'
                  ? 'bg-stone-900 dark:bg-emerald-600 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Todos ({recipes.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('listos')}
              className={`min-h-[36px] px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                filterMode === 'listos'
                  ? 'bg-emerald-700 dark:bg-emerald-600 text-white'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Cocinar ya (0 faltantes)</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('pocos_faltantes')}
              className={`min-h-[36px] px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                filterMode === 'pocos_faltantes'
                  ? 'bg-stone-900 dark:bg-emerald-600 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Faltan 1 o 2 cosas
            </button>
          </div>

          {/* ESTADO VACÍO (cuando el filtro no tiene recetas) */}
          {sortedRecipes.length === 0 && (
            <div className="text-center py-8 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 my-3 space-y-2">
              <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 mx-auto" />
              <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                No hay recetas que coincidan con este filtro
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Probá seleccionando "Todos los almuerzos" o marcá más ingredientes en el Paso 1 para descubrir opciones económicas.
              </p>
              <button
                type="button"
                onClick={() => setFilterMode('todos')}
                className="mt-2 px-4 py-2 bg-stone-900 dark:bg-emerald-600 text-white text-xs font-medium rounded-lg"
              >
                Ver todos los almuerzos
              </button>
            </div>
          )}

          {/* Lista de Almuerzos */}
          <div className="space-y-3">
            {sortedRecipes.map((recipe) => {
              const isSelected = selectedRecipeId === recipe.id;
              const isExpanded = expandedRecipeId === recipe.id;

              return (
                <div
                  key={recipe.id}
                  className={`bg-white dark:bg-stone-900 rounded-2xl border transition-all ${
                    isSelected
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                      : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 shadow-xs'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-1">
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            {recipe.timeMinutes} min
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>Dificultad: {recipe.difficulty}</span>
                        </div>
                        <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 leading-snug">
                          {recipe.title}
                        </h3>
                      </div>

                      <div className="text-right shrink-0">
                        {recipe.canCookImmediately ? (
                          <div className="text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>¡Tenés todo!</span>
                          </div>
                        ) : (
                          <div className="text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                            <span>Faltan {recipe.missingCount}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 mb-3">
                      {recipe.description}
                    </p>

                    {/* Resumen de Costo Estimado */}
                    <div className="bg-stone-50 dark:bg-stone-800/60 rounded-xl p-3 grid grid-cols-2 gap-2 border border-stone-100 dark:border-stone-700/60">
                      <div>
                        <span className="text-[11px] text-stone-500 dark:text-stone-400 block">
                          Costo por porción:
                        </span>
                        <span className="text-base font-bold tabular-nums text-stone-900 dark:text-stone-100">
                          {formatCurrency(recipe.costPerPortion)}
                        </span>
                        <span className="text-[10px] text-stone-400 dark:text-stone-500 block">
                          ({formatCurrency(recipe.totalMealCost)} para {servings} {servings === 1 ? 'plato' : 'platos'})
                        </span>
                      </div>

                      <div className="border-l border-stone-200 dark:border-stone-700 pl-3">
                        <span className="text-[11px] text-stone-500 dark:text-stone-400 block">
                          A comprar en caja:
                        </span>
                        <span
                          className={`text-base font-bold tabular-nums ${
                            recipe.outOfPocketCostToBuy === 0
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : 'text-stone-900 dark:text-stone-100'
                          }`}
                        >
                          {recipe.outOfPocketCostToBuy === 0
                            ? '$ 0 (¡Gratis hoy!)'
                            : formatCurrency(recipe.outOfPocketCostToBuy)}
                        </span>
                        <span className="text-[10px] text-stone-500 dark:text-stone-400 block truncate">
                          {recipe.missingCount === 0
                            ? 'Usás lo que tenés'
                            : `${recipe.missingCount} ${recipe.missingCount === 1 ? 'pack' : 'packs'} a comprar`}
                        </span>
                      </div>
                    </div>

                    {/* Lista visual de ingredientes necesarios */}
                    <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800">
                      <div className="flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">
                        <span>Ingredientes ({recipe.availableCount}/{recipe.ingredients.length} en casa)</span>
                        <button
                          type="button"
                          onClick={() => toggleExpand(recipe.id)}
                          className="text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1 font-medium text-xs py-1 px-1"
                        >
                          <span>{isExpanded ? 'Ocultar pasos' : 'Ver receta y tip'}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {recipe.ingredientsStatus.map((ing) => (
                          <div
                            key={ing.ingredientId}
                            className={`text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 border ${
                              ing.hasIt
                                ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                                : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                            }`}
                          >
                            <span>{ing.emoji}</span>
                            <span className="font-medium">{ing.name}</span>
                            <span className="text-[10px] opacity-75">
                              ({ing.hasIt ? 'En casa' : 'Falta'})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sección Expandible: Pasos de cocina y Tip de Ahorro */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800 space-y-3">
                        <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-3 flex items-start gap-2.5">
                          <Lightbulb className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                          <div className="text-xs text-amber-950 dark:text-amber-200">
                            <span className="font-bold block">Tip de ahorro de alacena:</span>
                            <span>{recipe.budgetTip}</span>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wide mb-2">
                            Paso a paso rápido:
                          </h4>
                          <ol className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
                            {recipe.cookingSteps.map((step, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
                                  {idx + 1}.
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    )}

                    {/* Botón de Acción Principal para este Almuerzo */}
                    <div className="mt-4 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleChooseAndProceed(recipe.id)}
                        className={`min-h-[46px] w-full py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.99] ${
                          isSelected
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                            : 'bg-stone-900 hover:bg-stone-800 dark:bg-stone-800 dark:hover:bg-stone-700 text-white'
                        }`}
                      >
                        <span>
                          {isSelected ? '✓ Almuerzo actual seleccionado' : 'Elegir este almuerzo'}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-200 dark:text-emerald-300">
                          {recipe.missingCount === 0
                            ? 'Ver cómo prepararlo'
                            : `Ver ${recipe.missingCount} ${recipe.missingCount === 1 ? 'compra' : 'compras'}`}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Armador de Almuerzo Personalizado a Medida */
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <SlidersHorizontal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Creá tu combinación económica a medida
            </h3>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-400 mb-4">
            Seleccioná una base rendidora, tu proteína disponible y verduras para calcular el costo de tu propio invento culinario.
          </p>

          <div className="space-y-3 mb-4">
            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                1. Base rendidora (Grano o Tubérculo)
              </label>
              <select
                value={customBase}
                onChange={(e) => setCustomBase(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 border border-stone-200 dark:border-stone-700 rounded-xl text-xs bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {allIngredients
                  .filter((i) => i.category === 'granos_legumbres' || i.id === 'papa')
                  .map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.emoji} {i.name} ({formatCurrency(i.unitCostPerPortion)}/porción) -{' '}
                      {pantryIds.includes(i.id) ? 'En casa' : 'Falta'}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                2. Fuente de Proteína
              </label>
              <select
                value={customProtein}
                onChange={(e) => setCustomProtein(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 border border-stone-200 dark:border-stone-700 rounded-xl text-xs bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {allIngredients
                  .filter((i) => i.category === 'proteinas' || i.id === 'lentejas')
                  .map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.emoji} {i.name} ({formatCurrency(i.unitCostPerPortion)}/porción) -{' '}
                      {pantryIds.includes(i.id) ? 'En casa' : 'Falta'}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                3. Vegetal o Salteado
              </label>
              <select
                value={customVeggie}
                onChange={(e) => setCustomVeggie(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 border border-stone-200 dark:border-stone-700 rounded-xl text-xs bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {allIngredients
                  .filter((i) => i.category === 'verduras_frutas' && i.id !== 'papa')
                  .map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.emoji} {i.name} ({formatCurrency(i.unitCostPerPortion)}/porción) -{' '}
                      {pantryIds.includes(i.id) ? 'En casa' : 'Falta'}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                4. Toque de Grasa o Salsa
              </label>
              <select
                value={customCondiment}
                onChange={(e) => setCustomCondiment(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 border border-stone-200 dark:border-stone-700 rounded-xl text-xs bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {allIngredients
                  .filter((i) => i.category === 'lacteos_grasas' || i.category === 'alacena_condimentos')
                  .map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.emoji} {i.name} ({formatCurrency(i.unitCostPerPortion)}/porción) -{' '}
                      {pantryIds.includes(i.id) ? 'En casa' : 'Falta'}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="bg-stone-50 dark:bg-stone-800/70 rounded-xl p-3 border border-stone-200 dark:border-stone-700 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-stone-600 dark:text-stone-400">
                Costo total consumo ({servings} platos):
              </span>
              <span className="text-sm font-bold tabular-nums text-stone-900 dark:text-stone-100">
                {formatCurrency(customTotalMealCost)}
              </span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-stone-600 dark:text-stone-400">Costo por porción:</span>
              <span className="text-sm font-bold tabular-nums text-stone-900 dark:text-stone-100">
                {formatCurrency(customPortionCost)} / comensal
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-stone-200 dark:border-stone-700">
              <span className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                Gasto a desembolsar hoy en el mercado:
              </span>
              <span className="text-base font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                {customToBuyCost === 0 ? '$ 0 (¡Tenés todo!)' : formatCurrency(customToBuyCost)}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
              {customMissingItems.length === 0
                ? 'Todos los componentes elegidos ya están en tu alacena.'
                : `Te falta comprar: ${customMissingItems.map((i) => i.name).join(', ')}`}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              onGoToShoppingList();
            }}
            className="w-full min-h-[46px] py-3 bg-stone-900 hover:bg-stone-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <span>Ver lista de compras para este almuerzo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Pestaña 3: Asesor Nutricional IA de Gemini con grupos de alimentos */}
      {viewTab === 'balance_ia' && (
        <GeminiNutritionAdvisor
          pantryIngredients={pantryIngredientsNames}
          onAddMissingIngredientToShoppingList={onAddMissingItemToShoppingList}
          onGoToShoppingList={onGoToShoppingList}
        />
      )}
    </div>
  );
};
