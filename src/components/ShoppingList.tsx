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
  AlertCircle,
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
  const [feedback, setFeedback] = useState<{ type: 'exito' | 'error'; message: string } | null>(null);

  // Manejo de agregar item extra con validación clara
  const handleAddExtra = (e: React.FormEvent) => {
    e.preventDefault();
    if (!extraName.trim()) {
      setFeedback({
        type: 'error',
        message: 'Por favor escribí el nombre del producto que querés sumar a la lista.'
      });
      return;
    }

    const parsedCost = Number(extraCost);
    if (extraCost && (isNaN(parsedCost) || parsedCost < 0)) {
      setFeedback({
        type: 'error',
        message: 'El precio estimado debe ser un número válido.'
      });
      return;
    }

    onAddExtraItem(extraName.trim(), parsedCost || 0);
    setExtraName('');
    setExtraCost('');

    setFeedback({
      type: 'exito',
      message: '¡Producto extra agregado a tu lista de compras!'
    });
    setTimeout(() => setFeedback(null), 3000);
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
      setTimeout(() => setCopiedToast(false), 4000);
    });
  };

  const totalItemsCount = shoppingList.length + extraShoppingItems.length;
  const boughtItemsCount =
    shoppingList.filter((i) => i.isBought).length +
    extraShoppingItems.filter((i) => i.isBought).length;
  const pendingCount = totalItemsCount - boughtItemsCount;
  const remainingBudgetToPay = Math.max(0, totalShoppingBudget - spentShoppingBudget);

  return (
    <div className="pb-32">
      {/* Título Función 3 */}
      <div className="mb-4">
        <span className="text-base font-black text-emerald-800 dark:text-emerald-400 tracking-wide uppercase block">
          Paso 3 de 3
        </span>
        <h2 className="text-2xl font-black text-stone-950 dark:text-white leading-tight">
          Lista de lo que falta comprar
        </h2>
        <p className="text-base font-medium text-stone-800 dark:text-stone-200 mt-1">
          Solo los ingredientes que te faltan en casa, presentados por paquete comercial para no gastar de más.
        </p>
      </div>

      {/* Mensajes de feedback visibles */}
      {feedback && (
        <div
          role="alert"
          className={`mb-4 p-3.5 rounded-2xl border-2 flex items-center gap-2.5 ${
            feedback.type === 'exito'
              ? 'bg-emerald-100 dark:bg-emerald-950 border-emerald-600 dark:border-emerald-500 text-emerald-950 dark:text-emerald-100'
              : 'bg-rose-100 dark:bg-rose-950 border-rose-600 dark:border-rose-500 text-rose-950 dark:text-rose-100'
          }`}
        >
          {feedback.type === 'exito' ? (
            <CheckCircle className="w-6 h-6 shrink-0 text-emerald-700 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="w-6 h-6 shrink-0 text-rose-700 dark:text-rose-400" />
          )}
          <span className="text-base font-bold">{feedback.message}</span>
        </div>
      )}

      {/* ESTADO VACÍO: cuando no hay receta seleccionada */}
      {!currentRecipe ? (
        <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/60 border-2 border-amber-400 dark:border-amber-700 text-stone-950 dark:text-white space-y-3 text-center mb-4">
          <AlertCircle className="w-8 h-8 text-amber-700 dark:text-amber-400 mx-auto" />
          <h3 className="text-xl font-black text-stone-950 dark:text-white">
            Todavía no has seleccionado un almuerzo
          </h3>
          <p className="text-base font-semibold text-stone-800 dark:text-stone-200">
            Andá al Paso 2 para elegir un plato y ver qué ingredientes te faltan.
          </p>
          <button
            type="button"
            onClick={onGoToLunchBuilder}
            className="w-full min-h-[50px] py-3 px-4 bg-stone-950 dark:bg-emerald-600 text-white font-bold text-base rounded-2xl"
          >
            Ir al Paso 2: Elegir Almuerzo
          </button>
        </div>
      ) : (
        /* Tarjeta de Almuerzo Asociado */
        <div className="bg-stone-50 dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 rounded-3xl p-4 mb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="text-base font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-wide block">
                Almuerzo elegido:
              </span>
              <h3 className="text-xl font-black text-stone-950 dark:text-white leading-tight">
                {currentRecipe.title}
              </h3>
              <div className="flex items-center gap-2 text-base font-bold text-stone-700 dark:text-stone-300 mt-1">
                <Users className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                <span>
                  {servings} {servings === 1 ? 'plato' : 'platos'}
                </span>
                <span aria-hidden="true">·</span>
                <span>{currentRecipe.timeMinutes} min</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onGoToLunchBuilder}
              className="min-h-[48px] px-3.5 py-2 bg-white dark:bg-stone-800 border-2 border-stone-400 dark:border-stone-600 text-stone-950 dark:text-white text-base font-bold rounded-xl hover:bg-stone-100 dark:hover:bg-stone-700 shrink-0 transition-colors"
            >
              Cambiar plato
            </button>
          </div>
        </div>
      )}

      {/* Resumen de Presupuesto en Caja de Alto Contraste */}
      <div className="bg-stone-950 dark:bg-stone-900 text-white rounded-3xl p-4 mb-4 border-2 border-stone-800 dark:border-stone-700 shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
          <div>
            <span className="text-base font-bold text-stone-300 block">
              Total a gastar en el súper:
            </span>
            <span className="text-3xl font-black tabular-nums text-white block">
              {formatCurrency(totalShoppingBudget)}
            </span>
          </div>

          <div className="sm:border-l sm:border-stone-700 sm:pl-3 pt-2 sm:pt-0 border-t border-stone-800 sm:border-t-0">
            <span className="text-base font-bold text-stone-300 block">
              Resta pagar en caja:
            </span>
            <span className="text-3xl font-black tabular-nums text-emerald-400 block">
              {formatCurrency(remainingBudgetToPay)}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-stone-800 text-base font-semibold text-stone-300 flex items-center justify-between">
          <span>
            {boughtItemsCount} de {totalItemsCount} productos comprados
          </span>
          {spentShoppingBudget > 0 && (
            <span>Tachado: {formatCurrency(spentShoppingBudget)}</span>
          )}
        </div>
      </div>

      {/* ESTADO VACÍO (Requisito 5: cuando no hay que comprar nada) */}
      {shoppingList.length === 0 && currentRecipe && (
        <div className="bg-emerald-100 dark:bg-emerald-950/80 border-2 border-emerald-600 dark:border-emerald-500 rounded-3xl p-6 text-center mb-4 space-y-2">
          <div className="w-14 h-14 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mx-auto mb-2">
            <Utensils className="w-7 h-7" />
          </div>
          <h4 className="text-xl font-black text-emerald-950 dark:text-white">
            ¡Tu lista de compras está vacía!
          </h4>
          <p className="text-base font-bold text-emerald-900 dark:text-emerald-200">
            Ya tenés todos los ingredientes en casa para cocinar este almuerzo sin gastar dinero hoy.
          </p>
          <button
            type="button"
            onClick={onGoToLunchBuilder}
            className="w-full min-h-[48px] px-4 py-2.5 bg-emerald-800 dark:bg-emerald-600 hover:bg-emerald-900 text-white text-base font-black rounded-2xl transition-colors mt-2"
          >
            Ver preparación y cocinar
          </button>
        </div>
      )}

      {/* Lista de compras con casillas grandes (Uso con una sola mano) */}
      {shoppingList.length > 0 && (
        <div className="space-y-2.5 mb-4">
          <div className="flex items-center justify-between text-base font-black text-stone-950 dark:text-white px-1">
            <span>Ingredientes a comprar ({pendingCount} pendientes):</span>
            <span className="text-base font-semibold text-stone-600 dark:text-stone-400">
              Tocá para tachar
            </span>
          </div>

          {shoppingList.map((item) => (
            <button
              type="button"
              key={item.ingredientId}
              onClick={() => onToggleItemBought(item.ingredientId)}
              className={`w-full min-h-[64px] p-3.5 rounded-2xl border-2 text-left flex items-center justify-between gap-3 transition-all select-none ${
                item.isBought
                  ? 'bg-stone-100 dark:bg-stone-900/60 border-stone-300 dark:border-stone-800 text-stone-500 dark:text-stone-500'
                  : 'bg-white dark:bg-stone-900 border-stone-400 dark:border-stone-700 hover:border-stone-600'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 pr-1">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border-2 transition-colors ${
                    item.isBought
                      ? 'bg-stone-400 dark:bg-stone-700 border-stone-400 dark:border-stone-700 text-white'
                      : 'border-stone-500 dark:border-stone-500 bg-stone-50 dark:bg-stone-800 text-transparent'
                  }`}
                >
                  <Check className="w-5 h-5 stroke-[3.5]" />
                </div>

                <div className="min-w-0">
                  <p
                    className={`text-base font-black truncate ${
                      item.isBought
                        ? 'line-through text-stone-500 dark:text-stone-500'
                        : 'text-stone-950 dark:text-white'
                    }`}
                  >
                    {item.name}
                  </p>
                  <p className="text-base font-bold text-stone-700 dark:text-stone-300 truncate">
                    {item.packPresentation} · ({item.neededForServings})
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span
                  className={`text-lg font-black tabular-nums block ${
                    item.isBought
                      ? 'line-through text-stone-500 dark:text-stone-500'
                      : 'text-stone-950 dark:text-white'
                  }`}
                >
                  {formatCurrency(item.estimatedCost)}
                </span>
                <span className="text-base font-semibold text-stone-600 dark:text-stone-400 block">
                  precio est.
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Extras agregados */}
      {extraShoppingItems.length > 0 && (
        <div className="space-y-2.5 mb-4">
          <div className="text-base font-black text-stone-950 dark:text-white px-1">
            <span>Extras anotados ({extraShoppingItems.length}):</span>
          </div>

          {extraShoppingItems.map((extra) => (
            <div
              key={extra.id}
              className={`min-h-[60px] p-3 rounded-2xl border-2 flex items-center justify-between gap-2 ${
                extra.isBought
                  ? 'bg-stone-100 dark:bg-stone-900/60 border-stone-300 dark:border-stone-800 text-stone-500 dark:text-stone-500'
                  : 'bg-white dark:bg-stone-900 border-stone-400 dark:border-stone-700'
              }`}
            >
              <button
                type="button"
                onClick={() => onToggleExtraBought(extra.id)}
                className="flex items-center gap-3 min-w-0 flex-1 text-left py-1"
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border-2 ${
                    extra.isBought
                      ? 'bg-stone-400 dark:bg-stone-700 border-stone-400 dark:border-stone-700 text-white'
                      : 'border-stone-500 dark:border-stone-500 bg-stone-50 dark:bg-stone-800 text-transparent'
                  }`}
                >
                  <Check className="w-5 h-5 stroke-[3.5]" />
                </div>
                <span
                  className={`text-base font-black truncate ${
                    extra.isBought ? 'line-through text-stone-500' : 'text-stone-950 dark:text-white'
                  }`}
                >
                  {extra.name}
                </span>
              </button>

              <div className="flex items-center gap-2 shrink-0">
                {extra.cost > 0 && (
                  <span
                    className={`text-base font-black tabular-nums ${
                      extra.isBought ? 'line-through text-stone-500' : 'text-stone-950 dark:text-white'
                    }`}
                  >
                    {formatCurrency(extra.cost)}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => onRemoveExtraItem(extra.id)}
                  aria-label={`Eliminar extra ${extra.name}`}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-600 dark:text-stone-400 hover:text-rose-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Formulario con ETIQUETAS VISIBLES (Requisito 3) */}
      <form
        onSubmit={handleAddExtra}
        className="bg-stone-50 dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 rounded-3xl p-4 mb-5 space-y-3"
      >
        <span className="text-base font-black text-stone-950 dark:text-white block">
          ¿Necesitás comprar algo más?
        </span>

        <div>
          <label
            htmlFor="extra-name-input"
            className="block text-base font-bold text-stone-950 dark:text-white mb-1"
          >
            Nombre del producto extra:
          </label>
          <input
            id="extra-name-input"
            type="text"
            value={extraName}
            onChange={(e) => setExtraName(e.target.value)}
            placeholder="Ejemplo: Pan, Fruta, Papel..."
            className="w-full px-3.5 py-3 bg-white dark:bg-stone-800 border-2 border-stone-400 dark:border-stone-700 text-stone-950 dark:text-white rounded-xl text-base font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="extra-cost-input"
            className="block text-base font-bold text-stone-950 dark:text-white mb-1"
          >
            Precio estimado ($):
          </label>
          <div className="flex gap-2">
            <input
              id="extra-cost-input"
              type="number"
              value={extraCost}
              onChange={(e) => setExtraCost(e.target.value)}
              placeholder="Ej: 500"
              className="flex-1 px-3.5 py-3 bg-white dark:bg-stone-800 border-2 border-stone-400 dark:border-stone-700 text-stone-950 dark:text-white rounded-xl text-base font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
            <button
              type="submit"
              className="min-h-[48px] px-5 bg-stone-950 hover:bg-stone-800 dark:bg-stone-800 dark:hover:bg-stone-700 text-white text-base font-black rounded-xl border-2 border-stone-800 flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Sumar</span>
            </button>
          </div>
        </div>
      </form>

      {/* Aviso de Lista Copiada (Mensaje visible y en español sin tecnicismos - Requisito 6) */}
      {copiedToast && (
        <div className="mb-3 p-3.5 bg-emerald-100 dark:bg-emerald-950 border-2 border-emerald-600 text-emerald-950 dark:text-emerald-100 text-base font-bold rounded-2xl flex items-center justify-center gap-2">
          <CheckCircle className="w-6 h-6 text-emerald-700 dark:text-emerald-400 shrink-0" />
          <span>¡Lista copiada! Ya podés pegarla en tu chat de WhatsApp o notas.</span>
        </div>
      )}

      {/* EL BOTÓN PRINCIPAL ÚNICO DE ESTA PANTALLA (Requisito 4) */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={handleShareList}
          className="w-full min-h-[56px] py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-black text-lg rounded-2xl flex items-center justify-center gap-2.5 shadow-lg transition-transform active:scale-[0.98]"
        >
          <Share2 className="w-6 h-6" />
          <span>Compartir lista por WhatsApp o Mensaje</span>
        </button>

        {boughtItemsCount > 0 && (
          <button
            type="button"
            onClick={onResetPurchases}
            className="w-full min-h-[48px] py-2.5 px-4 bg-white dark:bg-stone-900 border-2 border-stone-400 dark:border-stone-700 text-stone-900 dark:text-stone-200 font-bold text-base rounded-2xl flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            <span>Desmarcar productos tachados</span>
          </button>
        )}
      </div>
    </div>
  );
};
