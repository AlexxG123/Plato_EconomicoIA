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
  ChefHat
} from 'lucide-react';
import { Recipe, Ingredient } from '../types';
import { formatCurrency } from '../utils/formatters';

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
}

export const LunchBuilder: React.FC<LunchBuilderProps> = ({
  recipes,
  selectedRecipeId,
  onSelectRecipe,
  servings,
  onChangeServings,
  onGoToShoppingList,
  allIngredients,
  pantryIds
}) => {
  const [filterMode, setFilterMode] = useState<'todos' | 'listos' | 'pocos_faltantes'>('todos');
  const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>(null);
  const [viewTab, setViewTab] = useState<'sugeridos' | 'personalizado'>('sugeridos');

  // Estado para armador de almuerzo a medida
  const [customBase, setCustomBase] = useState('arroz');
  const [customProtein, setCustomProtein] = useState('huevos');
  const [customVeggie, setCustomVeggie] = useState('cebolla');
  const [customCondiment, setCustomCondiment] = useState('aceite');

  // Filtrado de recetas
  const filteredRecipes = recipes.filter((recipe) => {
    if (filterMode === 'listos') return recipe.canCookImmediately;
    if (filterMode === 'pocos_faltantes') return recipe.missingCount > 0 && recipe.missingCount <= 2;
    return true;
  });

  // Orden prioritario
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
    <div className="pb-32">
      {/* Encabezado Función 2 */}
      <div className="mb-4">
        <span className="text-base font-black text-emerald-800 dark:text-emerald-400 tracking-wide uppercase block">
          Paso 2 de 3
        </span>
        <h2 className="text-2xl font-black text-stone-950 dark:text-white leading-tight">
          Armar almuerzo y costo estimado
        </h2>
        <p className="text-base font-medium text-stone-800 dark:text-stone-200 mt-1">
          Elegí la cantidad de platos a cocinar para ver el presupuesto exacto por porción y lo que te falta comprar.
        </p>
      </div>

      {/* Control de Porciones / Comensales (320px táctil) */}
      <div className="bg-stone-50 dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 rounded-3xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
          <span className="text-base font-black text-stone-950 dark:text-white">
            ¿Para cuántos platos cocinás?
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { count: 1, label: '1 plato', desc: 'Solo' },
            { count: 2, label: '2 platos', desc: 'Dúo' },
            { count: 4, label: '4 platos', desc: 'Familia' }
          ].map((item) => (
            <button
              type="button"
              key={item.count}
              onClick={() => onChangeServings(item.count)}
              className={`min-h-[50px] py-2 px-1 rounded-2xl text-center border-2 transition-all ${
                servings === item.count
                  ? 'bg-stone-950 dark:bg-emerald-600 text-white border-stone-950 dark:border-emerald-600 shadow-xs'
                  : 'bg-white dark:bg-stone-800 text-stone-950 dark:text-white border-stone-300 dark:border-stone-700'
              }`}
            >
              <div className="text-base font-black leading-tight">{item.label}</div>
              <div className="text-base font-medium opacity-85 leading-tight">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Selector de Modo: Sugeridos vs Personalizado */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-stone-100 dark:bg-stone-800 rounded-2xl mb-4 border-2 border-stone-300 dark:border-stone-700">
        <button
          type="button"
          onClick={() => setViewTab('sugeridos')}
          className={`min-h-[48px] py-2 px-2 text-base font-black rounded-xl transition-colors text-center ${
            viewTab === 'sugeridos'
              ? 'bg-white dark:bg-stone-900 text-stone-950 dark:text-white shadow-xs border border-stone-300 dark:border-stone-600'
              : 'text-stone-700 dark:text-stone-300'
          }`}
        >
          Almuerzos ({recipes.length})
        </button>
        <button
          type="button"
          onClick={() => setViewTab('personalizado')}
          className={`min-h-[48px] py-2 px-2 text-base font-black rounded-xl transition-colors text-center flex items-center justify-center gap-1.5 ${
            viewTab === 'personalizado'
              ? 'bg-white dark:bg-stone-900 text-stone-950 dark:text-white shadow-xs border border-stone-300 dark:border-stone-600'
              : 'text-stone-700 dark:text-stone-300'
          }`}
        >
          <ChefHat className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
          <span>A medida</span>
        </button>
      </div>

      {viewTab === 'sugeridos' ? (
        <>
          {/* Filtros de Disponibilidad (Secundarios) */}
          <div className="mb-4">
            <span className="block text-base font-bold text-stone-950 dark:text-white mb-1.5">
              Filtrar recetas:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setFilterMode('todos')}
                className={`min-h-[48px] px-3.5 py-2 text-base font-bold rounded-xl transition-colors whitespace-nowrap shrink-0 border-2 ${
                  filterMode === 'todos'
                    ? 'bg-stone-950 dark:bg-white text-white dark:text-stone-950 border-stone-950 dark:border-white'
                    : 'bg-white dark:bg-stone-900 text-stone-950 dark:text-white border-stone-300 dark:border-stone-700'
                }`}
              >
                Todos ({recipes.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('listos')}
                className={`min-h-[48px] px-3.5 py-2 text-base font-bold rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 border-2 ${
                  filterMode === 'listos'
                    ? 'bg-emerald-700 dark:bg-emerald-600 text-white border-emerald-700 dark:border-emerald-600'
                    : 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-400 border-stone-300 dark:border-stone-700'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Cocinar ya (0 compras)</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('pocos_faltantes')}
                className={`min-h-[48px] px-3.5 py-2 text-base font-bold rounded-xl transition-colors whitespace-nowrap shrink-0 border-2 ${
                  filterMode === 'pocos_faltantes'
                    ? 'bg-stone-950 dark:bg-white text-white dark:text-stone-950 border-stone-950 dark:border-white'
                    : 'bg-white dark:bg-stone-900 text-stone-950 dark:text-white border-stone-300 dark:border-stone-700'
                }`}
              >
                Falta 1 o 2 cosas
              </button>
            </div>
          </div>

          {/* ESTADO VACÍO (Requisito 5: cuando no hay recetas en el filtro) */}
          {sortedRecipes.length === 0 && (
            <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/60 border-2 border-amber-400 dark:border-amber-700 text-stone-950 dark:text-white space-y-2 text-center my-4">
              <AlertCircle className="w-8 h-8 text-amber-700 dark:text-amber-400 mx-auto" />
              <h3 className="text-lg font-black text-stone-950 dark:text-white">
                No encontramos recetas para este filtro
              </h3>
              <p className="text-base font-semibold text-stone-800 dark:text-stone-200">
                Probá seleccionando "Todos los almuerzos" o marcá más ingredientes en el Paso 1 para descubrir opciones económicas.
              </p>
              <button
                type="button"
                onClick={() => setFilterMode('todos')}
                className="w-full min-h-[48px] py-2.5 px-4 bg-stone-950 dark:bg-emerald-600 text-white font-bold text-base rounded-xl mt-2"
              >
                Mostrar todos los almuerzos
              </button>
            </div>
          )}

          {/* Lista de Almuerzos */}
          <div className="space-y-4">
            {sortedRecipes.map((recipe) => {
              const isSelected = selectedRecipeId === recipe.id;
              const isExpanded = expandedRecipeId === recipe.id;

              return (
                <div
                  key={recipe.id}
                  className={`bg-white dark:bg-stone-900 rounded-3xl border-2 transition-all p-4 ${
                    isSelected
                      ? 'border-emerald-700 dark:border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-stone-300 dark:border-stone-700 hover:border-stone-500'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-base font-bold text-stone-700 dark:text-stone-300 mb-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                          {recipe.timeMinutes} min
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{recipe.difficulty}</span>
                      </div>
                      <h3 className="text-xl font-black text-stone-950 dark:text-white leading-snug">
                        {recipe.title}
                      </h3>
                    </div>

                    <div className="shrink-0 text-right">
                      {recipe.canCookImmediately ? (
                        <div className="text-emerald-900 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-1 rounded-xl text-base font-black flex items-center gap-1 border border-emerald-600">
                          <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                          ¡Todo en casa!
                        </div>
                      ) : (
                        <div className="text-amber-950 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/80 px-2.5 py-1 rounded-xl text-base font-black flex items-center gap-1 border border-amber-600">
                          <AlertCircle className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                          Faltan {recipe.missingCount}
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-base font-medium text-stone-800 dark:text-stone-200 mb-3">
                    {recipe.description}
                  </p>

                  {/* Resumen Financiero con Contraste y Texto Grande */}
                  <div className="bg-stone-50 dark:bg-stone-800 rounded-2xl p-3.5 border-2 border-stone-200 dark:border-stone-700 grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    <div>
                      <span className="text-base font-bold text-stone-700 dark:text-stone-300 block">
                        Costo por porción:
                      </span>
                      <span className="text-2xl font-black tabular-nums text-stone-950 dark:text-white block">
                        {formatCurrency(recipe.costPerPortion)}
                      </span>
                      <span className="text-base font-medium text-stone-600 dark:text-stone-400 block">
                        Total {formatCurrency(recipe.totalMealCost)} ({servings} {servings === 1 ? 'plato' : 'platos'})
                      </span>
                    </div>

                    <div className="sm:border-l sm:border-stone-300 sm:dark:border-stone-700 sm:pl-3 pt-2 sm:pt-0 border-t border-stone-200 sm:border-t-0">
                      <span className="text-base font-bold text-stone-700 dark:text-stone-300 block">
                        A desembolsar hoy:
                      </span>
                      <span
                        className={`text-2xl font-black tabular-nums block ${
                          recipe.outOfPocketCostToBuy === 0
                            ? 'text-emerald-800 dark:text-emerald-400'
                            : 'text-stone-950 dark:text-white'
                        }`}
                      >
                        {recipe.outOfPocketCostToBuy === 0
                          ? '$ 0 (gratis)'
                          : formatCurrency(recipe.outOfPocketCostToBuy)}
                      </span>
                      <span className="text-base font-medium text-stone-600 dark:text-stone-400 block">
                        {recipe.missingCount === 0
                          ? 'Usás lo que ya tenés'
                          : `${recipe.missingCount} ${recipe.missingCount === 1 ? 'pack a comprar' : 'packs a comprar'}`}
                      </span>
                    </div>
                  </div>

                  {/* Lista de ingredientes */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-base font-black text-stone-950 dark:text-white mb-2">
                      <span>Ingredientes ({recipe.availableCount}/{recipe.ingredients.length} listos):</span>
                      <button
                        type="button"
                        onClick={() => toggleExpand(recipe.id)}
                        className="text-emerald-800 dark:text-emerald-400 underline font-bold text-base flex items-center gap-1 p-1"
                      >
                        <span>{isExpanded ? 'Ocultar pasos' : 'Ver receta completa'}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {recipe.ingredientsStatus.map((ing) => (
                        <div
                          key={ing.ingredientId}
                          className={`text-base font-bold px-3 py-1.5 rounded-xl border-2 flex items-center gap-1.5 ${
                            ing.hasIt
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-100 border-emerald-600'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-200 border-stone-400'
                          }`}
                        >
                          <span>{ing.emoji}</span>
                          <span>{ing.name}</span>
                          <span className="font-normal opacity-85">
                            ({ing.hasIt ? 'En casa' : 'Falta'})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pasos y Tip desplegables */}
                  {isExpanded && (
                    <div className="pt-3 border-t-2 border-stone-200 dark:border-stone-800 space-y-3 mb-3">
                      <div className="bg-amber-100 dark:bg-amber-950/70 border-2 border-amber-600 rounded-2xl p-3.5 flex items-start gap-2.5">
                        <Lightbulb className="w-6 h-6 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                        <div className="text-base text-amber-950 dark:text-amber-100">
                          <strong className="block font-black">Consejo de ahorro económico:</strong>
                          <span className="font-semibold">{recipe.budgetTip}</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-base font-black text-stone-950 dark:text-white uppercase mb-2">
                          Preparación paso a paso:
                        </h4>
                        <ol className="space-y-2 text-base font-semibold text-stone-800 dark:text-stone-200">
                          {recipe.cookingSteps.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="font-black text-emerald-800 dark:text-emerald-400 shrink-0">
                                {idx + 1}.
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  )}

                  {/* BOTÓN (Requisito 4: un solo botón principal por pantalla) */}
                  {isSelected ? (
                    <button
                      type="button"
                      onClick={() => handleChooseAndProceed(recipe.id)}
                      className="w-full min-h-[54px] py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-black text-lg rounded-2xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                    >
                      <span>Elegir este almuerzo y ver qué comprar</span>
                      <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSelectRecipe(recipe.id)}
                      className="w-full min-h-[50px] py-3 px-4 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-950 dark:text-white font-bold text-base rounded-2xl border-2 border-stone-400 dark:border-stone-700 flex items-center justify-center gap-2 transition-colors"
                    >
                      <span>Seleccionar este almuerzo</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Armador de Almuerzo Personalizado con Etiquetas Visibles */
        <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-300 dark:border-stone-700 p-4 space-y-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
            <h3 className="text-xl font-black text-stone-950 dark:text-white">
              Creá tu combinación a medida
            </h3>
          </div>
          <p className="text-base font-semibold text-stone-800 dark:text-stone-200">
            Elegí cada componente para calcular el costo de tu propio invento:
          </p>

          <div className="space-y-3">
            <div>
              <label
                htmlFor="custom-base-select"
                className="block text-base font-black text-stone-950 dark:text-white mb-1"
              >
                1. Base principal (Grano o Tubérculo) *
              </label>
              <select
                id="custom-base-select"
                value={customBase}
                onChange={(e) => setCustomBase(e.target.value)}
                className="w-full min-h-[48px] px-3 py-2.5 border-2 border-stone-400 dark:border-stone-700 rounded-xl text-base font-bold bg-white dark:bg-stone-800 text-stone-950 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                {allIngredients
                  .filter((i) => i.category === 'granos_legumbres' || i.id === 'papa')
                  .map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.emoji} {i.name} ({formatCurrency(i.unitCostPerPortion)}) -{' '}
                      {pantryIds.includes(i.id) ? 'En casa' : 'Falta'}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="custom-protein-select"
                className="block text-base font-black text-stone-950 dark:text-white mb-1"
              >
                2. Fuente de Proteína *
              </label>
              <select
                id="custom-protein-select"
                value={customProtein}
                onChange={(e) => setCustomProtein(e.target.value)}
                className="w-full min-h-[48px] px-3 py-2.5 border-2 border-stone-400 dark:border-stone-700 rounded-xl text-base font-bold bg-white dark:bg-stone-800 text-stone-950 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                {allIngredients
                  .filter((i) => i.category === 'proteinas' || i.id === 'lentejas')
                  .map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.emoji} {i.name} ({formatCurrency(i.unitCostPerPortion)}) -{' '}
                      {pantryIds.includes(i.id) ? 'En casa' : 'Falta'}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="custom-veggie-select"
                className="block text-base font-black text-stone-950 dark:text-white mb-1"
              >
                3. Vegetal o Salteado *
              </label>
              <select
                id="custom-veggie-select"
                value={customVeggie}
                onChange={(e) => setCustomVeggie(e.target.value)}
                className="w-full min-h-[48px] px-3 py-2.5 border-2 border-stone-400 dark:border-stone-700 rounded-xl text-base font-bold bg-white dark:bg-stone-800 text-stone-950 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                {allIngredients
                  .filter((i) => i.category === 'verduras_frutas' && i.id !== 'papa')
                  .map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.emoji} {i.name} ({formatCurrency(i.unitCostPerPortion)}) -{' '}
                      {pantryIds.includes(i.id) ? 'En casa' : 'Falta'}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="custom-condiment-select"
                className="block text-base font-black text-stone-950 dark:text-white mb-1"
              >
                4. Toque de Grasa o Salsa *
              </label>
              <select
                id="custom-condiment-select"
                value={customCondiment}
                onChange={(e) => setCustomCondiment(e.target.value)}
                className="w-full min-h-[48px] px-3 py-2.5 border-2 border-stone-400 dark:border-stone-700 rounded-xl text-base font-bold bg-white dark:bg-stone-800 text-stone-950 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                {allIngredients
                  .filter((i) => i.category === 'lacteos_grasas' || i.category === 'alacena_condimentos')
                  .map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.emoji} {i.name} ({formatCurrency(i.unitCostPerPortion)}) -{' '}
                      {pantryIds.includes(i.id) ? 'En casa' : 'Falta'}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Resultado de la combinación */}
          <div className="bg-stone-50 dark:bg-stone-800 rounded-2xl p-4 border-2 border-stone-300 dark:border-stone-700 space-y-2">
            <div className="flex items-center justify-between text-base">
              <span className="font-bold text-stone-700 dark:text-stone-300">Costo por porción:</span>
              <span className="text-xl font-black tabular-nums text-stone-950 dark:text-white">
                {formatCurrency(customPortionCost)} / plato
              </span>
            </div>
            <div className="flex items-center justify-between text-base pt-2 border-t-2 border-stone-200 dark:border-stone-700">
              <span className="font-bold text-stone-700 dark:text-stone-300">A comprar hoy:</span>
              <span className="text-xl font-black tabular-nums text-emerald-800 dark:text-emerald-400">
                {customToBuyCost === 0 ? '$ 0 (tenés todo)' : formatCurrency(customToBuyCost)}
              </span>
            </div>
          </div>

          {/* Botón principal único para combinación a medida */}
          <button
            type="button"
            onClick={onGoToShoppingList}
            className="w-full min-h-[54px] py-3.5 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white text-lg font-black rounded-2xl flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            <span>Continuar a la lista de compras</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
