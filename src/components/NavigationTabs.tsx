/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Refrigerator, UtensilsCrossed, ShoppingBag } from 'lucide-react';

export type ActiveTab = 'en_casa' | 'almuerzo' | 'por_comprar';

interface NavigationTabsProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  pantryCount: number;
  selectedRecipeTitle?: string;
  missingItemsCount: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onChangeTab,
  pantryCount,
  missingItemsCount
}) => {
  return (
    <nav
      aria-label="Navegación principal de funciones"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-stone-900 border-t-2 border-stone-300 dark:border-stone-700 shadow-lg transition-colors"
    >
      <div className="max-w-xl mx-auto grid grid-cols-3 items-center h-20 px-1">
        {/* Pestaña 1: Elegir ingredientes que hay en casa */}
        <button
          type="button"
          onClick={() => onChangeTab('en_casa')}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-xl transition-all relative select-none ${
            activeTab === 'en_casa'
              ? 'text-emerald-800 dark:text-emerald-400 font-black'
              : 'text-stone-700 dark:text-stone-300 font-bold hover:text-stone-950 dark:hover:text-white'
          }`}
        >
          <div className="relative">
            <Refrigerator className="w-6 h-6 stroke-[2.5]" />
            {pantryCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-emerald-700 dark:bg-emerald-500 text-white text-xs font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center border-2 border-white dark:border-stone-900">
                {pantryCount}
              </span>
            )}
          </div>
          <span className="text-base tracking-tight mt-1 leading-tight text-center">
            1. En casa
          </span>
          {activeTab === 'en_casa' && (
            <span className="w-8 h-1 rounded-full bg-emerald-700 dark:bg-emerald-400 mt-1" />
          )}
        </button>

        {/* Pestaña 2: Armar almuerzo con costo estimado */}
        <button
          type="button"
          onClick={() => onChangeTab('almuerzo')}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-xl transition-all relative select-none ${
            activeTab === 'almuerzo'
              ? 'text-emerald-800 dark:text-emerald-400 font-black'
              : 'text-stone-700 dark:text-stone-300 font-bold hover:text-stone-950 dark:hover:text-white'
          }`}
        >
          <div className="relative">
            <UtensilsCrossed className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-base tracking-tight mt-1 leading-tight text-center">
            2. Almuerzo
          </span>
          {activeTab === 'almuerzo' && (
            <span className="w-8 h-1 rounded-full bg-emerald-700 dark:bg-emerald-400 mt-1" />
          )}
        </button>

        {/* Pestaña 3: Generar lista de lo que falta comprar */}
        <button
          type="button"
          onClick={() => onChangeTab('por_comprar')}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-xl transition-all relative select-none ${
            activeTab === 'por_comprar'
              ? 'text-emerald-800 dark:text-emerald-400 font-black'
              : 'text-stone-700 dark:text-stone-300 font-bold hover:text-stone-950 dark:hover:text-white'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-6 h-6 stroke-[2.5]" />
            {missingItemsCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-amber-600 dark:bg-amber-500 text-white text-xs font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center border-2 border-white dark:border-stone-900">
                {missingItemsCount}
              </span>
            )}
          </div>
          <span className="text-base tracking-tight mt-1 leading-tight text-center">
            3. Compras
          </span>
          {activeTab === 'por_comprar' && (
            <span className="w-8 h-1 rounded-full bg-emerald-700 dark:bg-emerald-400 mt-1" />
          )}
        </button>
      </div>
    </nav>
  );
};
