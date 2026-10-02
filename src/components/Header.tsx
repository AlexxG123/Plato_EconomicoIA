/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UtensilsCrossed, RotateCcw, Moon, Sun, Database } from 'lucide-react';

interface HeaderProps {
  pantryCount: number;
  onResetPantry: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenBackupModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  pantryCount,
  onResetPantry,
  isDark,
  onToggleTheme,
  onOpenBackupModal
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-stone-900 border-b-2 border-stone-300 dark:border-stone-700 transition-colors">
      <div className="max-w-xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Identificación de la aplicación */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 dark:bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-black tracking-tight text-stone-950 dark:text-white leading-tight truncate">
              Plato Económico
            </h1>
            <p className="text-base font-semibold text-stone-700 dark:text-stone-300 truncate">
              {pantryCount === 0 ? 'Alacena vacía' : `${pantryCount} en casa`}
            </p>
          </div>
        </div>

        {/* Acciones secundarias de cabecera */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Botón Gestión de Datos y Respaldo */}
          <button
            type="button"
            onClick={onOpenBackupModal}
            title="Gestión de datos y respaldo"
            aria-label="Gestión de datos y respaldo"
            className="min-h-[48px] min-w-[48px] p-2 flex items-center justify-center text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl border border-stone-300 dark:border-stone-700 transition-colors"
          >
            <Database className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
          </button>

          {/* Botón Modo Oscuro / Claro */}
          <button
            type="button"
            onClick={onToggleTheme}
            title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
            className="min-h-[48px] min-w-[48px] p-2 flex items-center justify-center text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl border border-stone-300 dark:border-stone-700 transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Botón Reinicio de Alacena */}
          <button
            type="button"
            onClick={onResetPantry}
            title="Reiniciar ingredientes marcados"
            aria-label="Reiniciar ingredientes marcados"
            className="min-h-[48px] min-w-[48px] p-2 flex items-center justify-center text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl border border-stone-300 dark:border-stone-700 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
