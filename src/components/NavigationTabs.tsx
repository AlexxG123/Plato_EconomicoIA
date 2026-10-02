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
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 transition-colors"
    >
      <div className="max-w-md mx-auto grid grid-cols-3 items-center h-16 px-2">
        {/* Pestaña 1: Elegir ingredientes que hay en casa */}
        <button
          type="button"
          onClick={() => onChangeTab('en_casa')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 px-2 rounded-xl transition-all relative select-none ${
            activeTab === 'en_casa'
              ? 'text-emerald-700 dark:text-emerald-400 font-bold'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <div className="relative">
            <Refrigerator className="w-5 h-5 stroke-[2.2]" />
            {pantryCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-emerald-600 dark:bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center">
                {pantryCount}
              </span>
            )}
          </div>
          <span className="text-[11px] tracking-tight mt-1">1. En casa</span>
          {activeTab === 'en_casa' && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-0.5" />
          )}
        </button>

        {/* Pestaña 2: Armar almuerzo con costo estimado */}
        <button
          type="button"
          onClick={() => onChangeTab('almuerzo')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 px-2 rounded-xl transition-all relative select-none ${
            activeTab === 'almuerzo'
              ? 'text-emerald-700 dark:text-emerald-400 font-bold'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <div className="relative">
            <UtensilsCrossed className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[11px] tracking-tight mt-1">2. Almuerzo</span>
          {activeTab === 'almuerzo' && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-0.5" />
          )}
        </button>

        {/* Pestaña 3: Generar lista de lo que falta comprar */}
        <button
          type="button"
          onClick={() => onChangeTab('por_comprar')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 px-2 rounded-xl transition-all relative select-none ${
            activeTab === 'por_comprar'
              ? 'text-emerald-700 dark:text-emerald-400 font-bold'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
            {missingItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-amber-600 dark:bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center">
                {missingItemsCount}
              </span>
            )}
          </div>
          <span className="text-[11px] tracking-tight mt-1">3. Por comprar</span>
          {activeTab === 'por_comprar' && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-0.5" />
          )}
        </button>
      </div>
    </nav>
  );
};
