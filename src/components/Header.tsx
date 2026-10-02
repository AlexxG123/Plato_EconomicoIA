/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UtensilsCrossed, RotateCcw } from 'lucide-react';

interface HeaderProps {
  pantryCount: number;
  onResetPantry: () => void;
}

export const Header: React.FC<HeaderProps> = ({ pantryCount, onResetPantry }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Zone: Tipografía limpia y clara */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm shrink-0">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-stone-900 leading-tight">
              Plato Económico
            </h1>
            <p className="text-xs text-stone-500 font-medium">
              Almuerzos rendidores para estudiantes y familias
            </p>
          </div>
        </div>

        {/* Acciones rápidas / Indicador */}
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-semibold text-stone-800">
              {pantryCount} ingredientes
            </span>
            <span className="text-xs text-stone-500 block">en tu casa</span>
          </div>

          <button
            onClick={onResetPantry}
            title="Reiniciar ingredientes marcados"
            aria-label="Reiniciar ingredientes"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
