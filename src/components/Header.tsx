/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UtensilsCrossed, RotateCcw, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  pantryCount: number;
  onResetPantry: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  pantryCount,
  onResetPantry,
  isDark,
  onToggleTheme
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Zone */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center shadow-xs shrink-0">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-stone-900 dark:text-stone-100 leading-tight">
              Plato Económico
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              Almuerzos rendidores para estudiantes y familias
            </p>
          </div>
        </div>

        {/* Acciones: Contador, Modo Oscuro y Reinicio */}
        <div className="flex items-center gap-1.5">
          <div className="text-right hidden sm:block mr-2">
            <span className="text-xs font-semibold text-stone-800 dark:text-stone-200">
              {pantryCount} ingredientes
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400 block">en tu casa</span>
          </div>

          {/* Botón Modo Oscuro / Claro */}
          <button
            type="button"
            onClick={onToggleTheme}
            title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Botón Reinicio de Alacena */}
          <button
            type="button"
            onClick={onResetPantry}
            title="Reiniciar ingredientes marcados"
            aria-label="Reiniciar ingredientes marcados"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
