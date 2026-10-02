/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Check,
  Plus,
  Share2,
  Trash2,
  Utensils,
  CheckCircle,
  Users
} from 'lucide-react';
import { Recipe, ShoppingItem } from '../types';
import { formatCurrency, formatShoppingListForShare } from '../utils/formatters';

interface ShoppingListProps {
  currentRecipe: Recipe | null;
  servings: number;
  shoppingList: ShoppingItem[];
  totalShoppingBudget: number;
  spentShoppingBudget: number;
  onToggleItemBought: (ingredientId: string) => void;
  extraShoppingItems: Array<{ id: string; name: string; cost: number; isBought: boolean }>;
  onAddExtraItem: (name: string, cost: number) => void;
  onToggleExtraBought: (id: string) => void;
  onRemoveExtraItem: (id: string) => void;
  onResetPurchases: () => void;
  onGoToLunchBuilder: () => void;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({
  currentRecipe,
  servings,
  shoppingList,
  totalShoppingBudget,
  spentShoppingBudget,
  onToggleItemBought,
  extraShoppingItems,
  onAddExtraItem,
  onToggleExtraBought,
  onRemoveExtraItem,
  onResetPurchases,
  onGoToLunchBuilder
}) => {
  const [extraName, setExtraName] = useState('');
  const [extraCost, setExtraCost] = useState('');
  const [copiedToast, setCopiedToast] = useState(false);

  // Manejo de agregar item extra
  const handleAddExtra = (e: React.FormEvent) => {
    e.preventDefault();
    if (!extraName.trim()) return;
    const parsedCost = Number(extraCost) || 0;
    onAddExtraItem(extraName.trim(), parsedCost);
    setExtraName('');
    setExtraCost('');
  };

  // Compartir o copiar lista de compras
  const handleShareList = () => {
    if (!currentRecipe) return;

    const allItemsToShare = [
      ...shoppingList.map((i) => ({
        name: i.name,
        packPresentation: i.packPresentation,
        estimatedCost: i.estimatedCost,
        isBought: i.isBought
      })),
      ...extraShoppingItems.map((e) => ({
        name: e.name,
        packPresentation: 'Extra',
        estimatedCost: e.cost,
        isBought: e.isBought
      }))
    ];

    const shareText = formatShoppingListForShare(
      currentRecipe.title,
      servings,
      allItemsToShare,
      totalShoppingBudget
    );

    if (navigator.share) {
      navigator
        .share({
          title: 'Lista de compras - Plato Económico',
          text: shareText
        })
        .catch(() => {
          copyToClipboard(shareText);
        });
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 3000);
    });
  };

  const totalItemsCount = shoppingList.length + extraShoppingItems.length;
  const boughtItemsCount =
    shoppingList.filter((i) => i.isBought).length +
    extraShoppingItems.filter((i) => i.isBought).length;
  const pendingCount = totalItemsCount - boughtItemsCount;
  const remainingBudgetToPay = Math.max(0, totalShoppingBudget - spentShoppingBudget);

  return (
    <div className="pb-28">
      {/* Título Función 3 */}
      <div className="mb-4">
        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 tracking-wide uppercase">
          Paso 3 de 3
        </span>
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
          Lista de lo que falta comprar
        </h2>
        <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
          Solo los ingredientes que no tenés en casa, en su tamaño de compra habitual y con el total exacto a llevar al almacén o súper.
        </p>
      </div>

      {/* Tarjeta de Almuerzo Asociado */}
      {currentRecipe ? (
        <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 mb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wide">
                Almuerzo seleccionado:
              </span>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 leading-snug">
                {currentRecipe.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400 mt-1">
                <Users className="w-3.5 h-3.5" />
                <span>
                  {servings} {servings === 1 ? 'porción' : 'porciones'}
                </span>
                <span aria-hidden="true">·</span>
                <span>{currentRecipe.timeMinutes} min de preparación</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onGoToLunchBuilder}
              className="min-h-[38px] px-3 py-1.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-medium rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 shrink-0 transition-colors"
            >
              Cambiar plato
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 mb-4 text-center">
          <p className="text-xs text-amber-900 dark:text-amber-300 mb-2">
            No has seleccionado ningún almuerzo todavía.
          </p>
          <button
            type="button"
            onClick={onGoToLunchBuilder}
            className="px-4 py-2 bg-stone-900 dark:bg-emerald-600 text-white text-xs font-medium rounded-lg"
          >
            Ir al Paso 2: Elegir Almuerzo
          </button>
        </div>
      )}

      {/* Resumen de Presupuesto de Bolsillo */}
      <div className="bg-stone-900 dark:bg-stone-800/90 text-white rounded-2xl p-4 mb-4 shadow-sm border border-transparent dark:border-stone-700">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <span className="text-[11px] text-stone-400 block font-medium">
              Total estimado a gastar:
            </span>
            <span className="text-2xl font-bold tabular-nums text-white">
              {formatCurrency(totalShoppingBudget)}
            </span>
          </div>

          <div className="border-l border-stone-700 pl-3">
            <span className="text-[11px] text-stone-400 block font-medium">
              Resta pagar en caja:
            </span>
            <span className="text-2xl font-bold tabular-nums text-emerald-400">
              {formatCurrency(remainingBudgetToPay)}
            </span>
          </div>
        </div>

        {/* Barra de progreso de la compra */}
        <div className="pt-2 border-t border-stone-800 dark:border-stone-700 flex items-center justify-between text-xs text-stone-400">
          <span>
            {boughtItemsCount} de {totalItemsCount} comprados
          </span>
          {spentShoppingBudget > 0 && (
            <span>Ya tachaste {formatCurrency(spentShoppingBudget)}</span>
          )}
        </div>
      </div>

      {/* Si no falta nada: caso ideal */}
      {shoppingList.length === 0 && (
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 text-center mb-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto mb-3">
            <Utensils className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-emerald-950 dark:text-emerald-200 mb-1">
            ¡No tenés que comprar nada!
          </h4>
          <p className="text-xs text-emerald-800 dark:text-emerald-300 max-w-sm mx-auto mb-4">
            Tenés todos los ingredientes necesarios en tu alacena para preparar{' '}
            <span className="font-semibold">{currentRecipe?.title}</span>. Tu gasto de hoy es $0.
          </p>
          <button
            type="button"
            onClick={onGoToLunchBuilder}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Ver receta y cómo cocinarlo</span>
          </button>
        </div>
      )}

      {/* Lista de compras interactiva (Checklist para el súper) */}
      {shoppingList.length > 0 && (
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-stone-300 px-1">
            <span>Ingredientes a comprar ({pendingCount} pendientes)</span>
            <span className="text-[11px] text-stone-400 dark:text-stone-500 font-normal">
              Tocá para tachar al poner en el changuito
            </span>
          </div>

          {shoppingList.map((item) => (
            <button
              type="button"
              key={item.ingredientId}
              onClick={() => onToggleItemBought(item.ingredientId)}
              className={`w-full min-h-[58px] p-3 rounded-xl border text-left flex items-center justify-between transition-all select-none ${
                item.isBought
                  ? 'bg-stone-50 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 text-stone-400 dark:text-stone-500'
                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    item.isBought
                      ? 'bg-stone-300 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                      : 'border-2 border-stone-300 dark:border-stone-600 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>

                <div className="min-w-0">
                  <p
                    className={`text-sm font-semibold truncate ${
                      item.isBought
                        ? 'line-through text-stone-400 dark:text-stone-500'
                        : 'text-stone-900 dark:text-stone-100'
                    }`}
                  >
                    {item.name}
                  </p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                    {item.packPresentation} · Para {item.neededForServings}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span
                  className={`text-sm font-bold tabular-nums block ${
                    item.isBought
                      ? 'line-through text-stone-400 dark:text-stone-500'
                      : 'text-stone-900 dark:text-stone-100'
                  }`}
                >
                  {formatCurrency(item.estimatedCost)}
                </span>
                <span className="text-[10px] text-stone-400 dark:text-stone-500 block">precio est.</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Extras agregados manualmente por el usuario */}
      {extraShoppingItems.length > 0 && (
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-stone-300 px-1">
            <span>Extras anotados ({extraShoppingItems.length})</span>
          </div>

          {extraShoppingItems.map((extra) => (
            <div
              key={extra.id}
              className={`min-h-[52px] p-3 rounded-xl border flex items-center justify-between ${
                extra.isBought
                  ? 'bg-stone-50 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 text-stone-400 dark:text-stone-500'
                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-xs'
              }`}
            >
              <button
                type="button"
                onClick={() => onToggleExtraBought(extra.id)}
                className="flex items-center gap-3 min-w-0 flex-1 text-left py-1"
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                    extra.isBought
                      ? 'bg-stone-300 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                      : 'border-2 border-stone-300 dark:border-stone-600 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span
                  className={`text-sm font-medium truncate ${
                    extra.isBought
                      ? 'line-through text-stone-400 dark:text-stone-500'
                      : 'text-stone-900 dark:text-stone-100'
                  }`}
                >
                  {extra.name}
                </span>
              </button>

              <div className="flex items-center gap-2">
                {extra.cost > 0 && (
                  <span
                    className={`text-xs font-bold tabular-nums ${
                      extra.isBought
                        ? 'line-through text-stone-400 dark:text-stone-500'
                        : 'text-stone-800 dark:text-stone-200'
                    }`}
                  >
                    {formatCurrency(extra.cost)}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => onRemoveExtraItem(extra.id)}
                  aria-label={`Eliminar extra ${extra.name}`}
                  className="min-h-[36px] min-w-[36px] flex items-center justify-center text-stone-400 hover:text-rose-600 dark:hover:text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Formulario rápido para anotar algo más */}
      <form
        onSubmit={handleAddExtra}
        className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-3.5 mb-5"
      >
        <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block mb-2">
          ¿Necesitás comprar algo más?
        </span>
        <div className="flex gap-2">
          <input
            type="text"
            value={extraName}
            onChange={(e) => setExtraName(e.target.value)}
            placeholder="Ej: Pan, Fruta, Rollo de cocina..."
            className="flex-1 px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <input
            type="number"
            value={extraCost}
            onChange={(e) => setExtraCost(e.target.value)}
            placeholder="$ Est."
            className="w-20 px-2 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!extraName.trim()}
            className="min-h-[38px] px-3 bg-stone-900 dark:bg-emerald-600 hover:bg-stone-800 dark:hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Sumar</span>
          </button>
        </div>
      </form>

      {/* Botones de Acción: Compartir / Copiar y Reiniciar */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handleShareList}
          className="w-full min-h-[48px] py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors active:scale-[0.99]"
        >
          <Share2 className="w-4 h-4" />
          <span>Compartir lista por WhatsApp / Mensaje</span>
        </button>

        {copiedToast && (
          <div className="text-center py-2 px-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-medium rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-1.5 animate-fade-in">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>¡Lista copiada al portapapeles con formato listo!</span>
          </div>
        )}

        {boughtItemsCount > 0 && (
          <button
            type="button"
            onClick={onResetPurchases}
            className="w-full min-h-[44px] py-2 px-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 font-medium text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Desmarcar items comprados</span>
          </button>
        )}
      </div>
    </div>
  );
};
