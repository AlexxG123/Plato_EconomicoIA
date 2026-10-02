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
    // Si uno se puede cocinar ya y el otro no, va primero
    if (a.canCookImmediately && !b.canCookImmediately) return -1;
    if (!a.canCookImmediately && b.canCookImmediately) return 1;
    // Sino, por menor costo a desembolsar
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
        <span className="text-xs font-semibold text-emerald-700 tracking-wide uppercase">
          Paso 2 de 3
        </span>
        <h2 className="text-xl font-bold text-stone-900">
          Armar almuerzo y costo estimado
        </h2>
        <p className="text-xs text-stone-600 mt-1">
          Elegí cuántas porciones vas a cocinar. Calculamos el costo por plato y el total exacto que te costaría completar los ingredientes.
        </p>
      </div>

      {/* Control de Porciones / Comensales (Ergonómico para celular) */}
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-bold text-stone-900">¿Para cuántos cocinás?</span>
          </div>
          <span className="text-xs font-medium text-stone-600">
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
              key={item.count}
              onClick={() => onChangeServings(item.count)}
              className={`min-h-[46px] py-1.5 px-2 rounded-xl text-center border transition-all ${
                servings === item.count
                  ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="text-xs font-bold">{item.label}</div>
              <div className={`text-[10px] ${servings === item.count ? 'text-stone-300' : 'text-stone-500'}`}>
                {item.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selector de Modo: Recetas Sugeridas vs Armar Propio */}
      <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl mb-4">
        <button
          onClick={() => setViewTab('sugeridos')}
          className={`flex-1 min-h-[38px] py-1 px-3 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            viewTab === 'sugeridos'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          🍲 Almuerzos Sugeridos ({recipes.length})
        </button>
        <button
          onClick={() => setViewTab('personalizado')}
          className={`flex-1 min-h-[38px] py-1 px-3 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center justify-center gap-1 ${
            viewTab === 'personalizado'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <ChefHat className="w-3.5 h-3.5 text-emerald-600" />
          <span>Armar a Medida</span>
        </button>
      </div>

      {viewTab === 'sugeridos' ? (
        <>
          {/* Filtros de Cobertura */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
            <button
              onClick={() => setFilterMode('todos')}
              className={`min-h-[36px] px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                filterMode === 'todos'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:text-stone-900'
              }`}
            >
              Todos ({recipes.length})
            </button>
            <button
              onClick={() => setFilterMode('listos')}
              className={`min-h-[36px] px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                filterMode === 'listos'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Cocinar ya (0 faltantes)
            </button>
            <button
              onClick={() => setFilterMode('pocos_faltantes')}
              className={`min-h-[36px] px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                filterMode === 'pocos_faltantes'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:text-stone-900'
              }`}
            >
              Faltan 1 o 2 cosas
            </button>
          </div>

          {/* Lista de Almuerzos */}
          <div className="space-y-3">
            {sortedRecipes.map((recipe) => {
              const isSelected = selectedRecipeId === recipe.id;
              const isExpanded = expandedRecipeId === recipe.id;

              return (
                <div
                  key={recipe.id}
                  className={`bg-white rounded-2xl border transition-all ${
                    isSelected
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                      : 'border-stone-200 hover:border-stone-300 shadow-xs'
                  }`}
                >
                  {/* Encabezado de la Tarjeta */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            {recipe.timeMinutes} min
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>Dificultad: {recipe.difficulty}</span>
                        </div>
                        <h3 className="text-base font-bold text-stone-900 leading-snug">
                          {recipe.title}
                        </h3>
                      </div>

                      {/* Estado de ingredientes en casa */}
                      <div className="text-right shrink-0">
                        {recipe.canCookImmediately ? (
                          <div className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            ¡Tenés todo!
                          </div>
                        ) : (
                          <div className="text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                            Faltan {recipe.missingCount}
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 mb-3">
                      {recipe.description}
                    </p>

                    {/* Resumen de Costo Estimado (Desglose claro sin confusiones) */}
                    <div className="bg-stone-50 rounded-xl p-3 grid grid-cols-2 gap-2 border border-stone-100">
                      <div>
                        <span className="text-[11px] text-stone-500 block">
                          Costo por porción:
                        </span>
                        <span className="text-base font-bold tabular-nums text-stone-900">
                          {formatCurrency(recipe.costPerPortion)}
                        </span>
                        <span className="text-[10px] text-stone-400 block">
                          ({formatCurrency(recipe.totalMealCost)} para {servings} {servings === 1 ? 'plato' : 'platos'})
                        </span>
                      </div>

                      <div className="border-l border-stone-200 pl-3">
                        <span className="text-[11px] text-stone-500 block">
                          A comprar en caja:
                        </span>
                        <span
                          className={`text-base font-bold tabular-nums ${
                            recipe.outOfPocketCostToBuy === 0
                              ? 'text-emerald-700'
                              : 'text-stone-900'
                          }`}
                        >
                          {recipe.outOfPocketCostToBuy === 0
                            ? '$ 0 (¡Gratis hoy!)'
                            : formatCurrency(recipe.outOfPocketCostToBuy)}
                        </span>
                        <span className="text-[10px] text-stone-500 block truncate">
                          {recipe.missingCount === 0
                            ? 'Usás lo que tenés'
                            : `${recipe.missingCount} ${recipe.missingCount === 1 ? 'pack' : 'packs'} a comprar`}
                        </span>
                      </div>
                    </div>

                    {/* Lista visual de ingredientes necesarios */}
                    <div className="mt-3 pt-3 border-t border-stone-100">
                      <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-2">
                        <span>Ingredientes ({recipe.availableCount}/{recipe.ingredients.length} en casa)</span>
                        <button
                          onClick={() => toggleExpand(recipe.id)}
                          className="text-stone-500 hover:text-stone-900 flex items-center gap-1 font-medium text-xs"
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
                                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                                : 'bg-stone-50 border-stone-200 text-stone-600'
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
                      <div className="mt-4 pt-4 border-t border-stone-100 space-y-3">
                        {/* Tip de Ahorro para Estudiante / Familia */}
                        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
                          <Lightbulb className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                          <div className="text-xs text-amber-950">
                            <span className="font-bold block">Tip de ahorro de alacena:</span>
                            <span>{recipe.budgetTip}</span>
                          </div>
                        </div>

                        {/* Pasos */}
                        <div>
                          <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wide mb-2">
                            Paso a paso rápido:
                          </h4>
                          <ol className="space-y-1.5 text-xs text-stone-700">
                            {recipe.cookingSteps.map((step, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="font-bold text-emerald-700 shrink-0">
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
                        onClick={() => handleChooseAndProceed(recipe.id)}
                        className={`min-h-[46px] w-full py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.99] ${
                          isSelected
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                            : 'bg-stone-900 hover:bg-stone-800 text-white'
                        }`}
                      >
                        <span>
                          {isSelected ? '✓ Almuerzo actual seleccionado' : 'Elegir este almuerzo'}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-200">
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

            {sortedRecipes.length === 0 && (
              <div className="text-center py-10 bg-stone-50 rounded-2xl border border-stone-200 p-6">
                <p className="text-sm font-semibold text-stone-800">
                  No hay recetas que coincidan con este filtro
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  Probá marcando más ingredientes en el Paso 1 o cambiá a "Todos".
                </p>
                <button
                  onClick={() => setFilterMode('todos')}
                  className="mt-3 px-4 py-2 bg-stone-900 text-white text-xs font-medium rounded-lg"
                >
                  Ver todos los almuerzos
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Armador de Almuerzo Personalizado a Medida */
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-stone-900">
              Creá tu combinación económica a medida
            </h3>
          </div>
          <p className="text-xs text-stone-600 mb-4">
            Seleccioná una base rendidora, tu proteína disponible y verduras para calcular el costo de tu propio invento culinario.
          </p>

          <div className="space-y-3 mb-4">
            {/* Base de Carbohidrato / Grano */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                1. Base rendidora (Grano o Tubérculo)
              </label>
              <select
                value={customBase}
                onChange={(e) => setCustomBase(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 border border-stone-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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

            {/* Proteína */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                2. Fuente de Proteína
              </label>
              <select
                value={customProtein}
                onChange={(e) => setCustomProtein(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 border border-stone-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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

            {/* Verdulería */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                3. Vegetal o Salteado
              </label>
              <select
                value={customVeggie}
                onChange={(e) => setCustomVeggie(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 border border-stone-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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

            {/* Condimento o Toque */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                4. Toque de Grasa o Salsa
              </label>
              <select
                value={customCondiment}
                onChange={(e) => setCustomCondiment(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 border border-stone-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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

          {/* Resultado Financiero del Almuerzo Personalizado */}
          <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-stone-600">Costo total consumo ({servings} platos):</span>
              <span className="text-sm font-bold tabular-nums text-stone-900">
                {formatCurrency(customTotalMealCost)}
              </span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-stone-600">Costo por porción:</span>
              <span className="text-sm font-bold tabular-nums text-stone-900">
                {formatCurrency(customPortionCost)} / comensal
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-stone-200">
              <span className="text-xs font-semibold text-stone-800">
                Gasto a desembolsar hoy en el mercado:
              </span>
              <span className="text-base font-bold tabular-nums text-emerald-700">
                {customToBuyCost === 0 ? '$ 0 (¡Tenés todo!)' : formatCurrency(customToBuyCost)}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              {customMissingItems.length === 0
                ? 'Todos los componentes elegidos ya están en tu alacena.'
                : `Te falta comprar: ${customMissingItems.map((i) => i.name).join(', ')}`}
            </p>
          </div>

          <button
            onClick={() => {
              // Si el usuario quiere continuar con esta combinación, seleccionamos la receta más cercana o vamos a compras
              onGoToShoppingList();
            }}
            className="w-full min-h-[46px] py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <span>Ver lista de compras para este almuerzo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
