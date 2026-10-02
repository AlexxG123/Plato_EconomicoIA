/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, Plus, Check, Sparkles, Trash2, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { Ingredient, IngredientCategory } from '../types';
import { CATEGORY_LABELS } from '../data/ingredientsData';
import { normalizeSearch, formatCurrency } from '../utils/formatters';

interface PantrySelectorProps {
  ingredients: Ingredient[];
  pantryIds: string[];
  onToggleIngredient: (id: string) => void;
  onSelectBasics: () => void;
  onClearPantry: () => void;
  onAddCustomIngredient: (
    name: string,
    category: IngredientCategory,
    packCost: number,
    packPresentation: string
  ) => void;
  onGoToLunch: () => void;
}

export const PantrySelector: React.FC<PantrySelectorProps> = ({
  ingredients,
  pantryIds,
  onToggleIngredient,
  onSelectBasics,
  onClearPantry,
  onAddCustomIngredient,
  onGoToLunch
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [showAddModal, setShowAddModal] = useState(false);

  // Formulario de nuevo ingrediente
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<IngredientCategory>('alacena_condimentos');
  const [newCost, setNewCost] = useState('');
  const [newPresentation, setNewPresentation] = useState('');

  // Mensajes de éxito y de error visibles y sin tecnicismos
  const [feedback, setFeedback] = useState<{ type: 'exito' | 'error'; message: string } | null>(null);

  // Filtrado reactivo de ingredientes
  const filteredIngredients = useMemo(() => {
    const q = normalizeSearch(search);
    return ingredients.filter((item) => {
      const matchesSearch = !q || normalizeSearch(item.name).includes(q);
      const matchesCat = selectedCategory === 'todos' || item.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [ingredients, search, selectedCategory]);

  const handleSaveCustomIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      setFeedback({
        type: 'error',
        message: 'Por favor escribí el nombre del ingrediente antes de guardar.'
      });
      return;
    }

    const parsedCost = Number(newCost);
    if (newCost && (isNaN(parsedCost) || parsedCost <= 0)) {
      setFeedback({
        type: 'error',
        message: 'El precio estimado debe ser un número mayor a cero.'
      });
      return;
    }

    onAddCustomIngredient(
      newName.trim(),
      newCategory,
      parsedCost || 1000,
      newPresentation.trim() || '1 unidad o paquete'
    );

    setNewName('');
    setNewCost('');
    setNewPresentation('');
    setShowAddModal(false);

    setFeedback({
      type: 'exito',
      message: '¡Ingrediente guardado y agregado a tu alacena!'
    });
    setTimeout(() => setFeedback(null), 3500);
  };

  const pantryCount = pantryIds.length;

  return (
    <div className="pb-32">
      {/* Título de Función 1 */}
      <div className="mb-4">
        <span className="text-base font-black text-emerald-800 dark:text-emerald-400 tracking-wide uppercase block">
          Paso 1 de 3
        </span>
        <h2 className="text-2xl font-black text-stone-950 dark:text-white leading-tight">
          ¿Qué tenés en casa hoy?
        </h2>
        <p className="text-base font-medium text-stone-800 dark:text-stone-200 mt-1">
          Tocá los ingredientes que tenés en tu cocina para calcular qué podés preparar al menor costo.
        </p>
      </div>

      {/* Mensajes de Éxito o Error visibles */}
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

      {/* ESTADO VACÍO (Requisito 5: cuando todavía no hay ingredientes marcados) */}
      {pantryCount === 0 && (
        <div className="mb-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border-2 border-amber-400 dark:border-amber-700 text-stone-950 dark:text-white space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-700 dark:text-amber-400 shrink-0" />
            <h3 className="text-lg font-black text-stone-950 dark:text-white">
              Tu alacena está vacía
            </h3>
          </div>
          <p className="text-base font-semibold text-stone-800 dark:text-stone-200">
            Tocá los ingredientes que ya tenés en casa o presioná "Pre-cargar básicos" para comenzar a armar tu almuerzo.
          </p>
          <button
            type="button"
            onClick={onSelectBasics}
            className="w-full min-h-[48px] py-2.5 px-4 bg-amber-200 dark:bg-amber-900/80 hover:bg-amber-300 dark:hover:bg-amber-800 text-stone-950 dark:text-amber-100 font-bold text-base rounded-xl border border-amber-400 dark:border-amber-600 transition-colors"
          >
            Pre-cargar ingredientes básicos (arroz, aceite, sal...)
          </button>
        </div>
      )}

      {/* Campo con ETIQUETA VISIBLE (Requisito 3) */}
      <div className="mb-3">
        <label
          htmlFor="pantry-search-input"
          className="block text-base font-black text-stone-950 dark:text-white mb-1.5"
        >
          Buscar ingredientes en tu alacena:
        </label>
        <div className="relative">
          <Search className="w-5 h-5 text-stone-600 dark:text-stone-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="pantry-search-input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ejemplo: arroz, fideos, huevos, cebolla..."
            className="w-full pl-11 pr-14 py-3 bg-white dark:bg-stone-900 border-2 border-stone-400 dark:border-stone-700 rounded-xl text-base font-semibold text-stone-950 dark:text-white placeholder:text-stone-500 dark:placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-base font-bold text-stone-800 dark:text-stone-200 bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 rounded-lg px-2 py-1"
            >
              Borrar
            </button>
          )}
        </div>
      </div>

      {/* Botones SECUNDARIOS de acción rápida (Requisito 4: un solo botón principal por pantalla) */}
      <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={onSelectBasics}
          className="min-h-[48px] px-3 py-2 bg-stone-100 dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 text-stone-950 dark:text-white text-base font-bold rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 flex items-center gap-1.5 shrink-0 transition-colors"
        >
          <Sparkles className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
          <span>Pre-cargar básicos</span>
        </button>

        {pantryCount > 0 && (
          <button
            type="button"
            onClick={onClearPantry}
            className="min-h-[48px] px-3 py-2 bg-stone-100 dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 text-stone-950 dark:text-white text-base font-bold rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            <span>Desmarcar todo</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="min-h-[48px] px-3 py-2 bg-stone-100 dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 text-stone-950 dark:text-white text-base font-bold rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 flex items-center gap-1.5 shrink-0 ml-auto transition-colors"
        >
          <Plus className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
          <span>Agregar otro</span>
        </button>
      </div>

      {/* Filtros de Categoría (Controles secundarios) */}
      <div className="mb-4">
        <span className="block text-base font-bold text-stone-950 dark:text-white mb-1.5">
          Filtrar por grupo:
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('todos')}
            className={`min-h-[48px] px-3.5 py-2 text-base font-bold rounded-xl transition-colors whitespace-nowrap shrink-0 border-2 ${
              selectedCategory === 'todos'
                ? 'bg-stone-950 dark:bg-white text-white dark:text-stone-950 border-stone-950 dark:border-white shadow-xs'
                : 'bg-white dark:bg-stone-900 text-stone-950 dark:text-white border-stone-300 dark:border-stone-700'
            }`}
          >
            Todos ({ingredients.length})
          </button>

          {(Object.keys(CATEGORY_LABELS) as IngredientCategory[]).map((cat) => {
            const count = ingredients.filter((i) => i.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                type="button"
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`min-h-[48px] px-3.5 py-2 text-base font-bold rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 border-2 ${
                  isSelected
                    ? 'bg-stone-950 dark:bg-white text-white dark:text-stone-950 border-stone-950 dark:border-white shadow-xs'
                    : 'bg-white dark:bg-stone-900 text-stone-950 dark:text-white border-stone-300 dark:border-stone-700'
                }`}
              >
                <span>{CATEGORY_LABELS[cat].icon}</span>
                <span>{CATEGORY_LABELS[cat].label}</span>
                <span className="opacity-80">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista vertical de ingredientes (optimizado para una sola mano en 320px) */}
      <div className="space-y-2.5">
        {filteredIngredients.map((item) => {
          const isChecked = pantryIds.includes(item.id);
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => onToggleIngredient(item.id)}
              className={`w-full min-h-[58px] p-3 rounded-2xl border-2 text-left flex items-center justify-between gap-2.5 transition-all select-none ${
                isChecked
                  ? 'bg-emerald-100 dark:bg-emerald-950/70 border-emerald-700 dark:border-emerald-500 shadow-xs'
                  : 'bg-white dark:bg-stone-900 border-stone-400 dark:border-stone-700 hover:border-stone-600'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 pr-1">
                <span className="text-2xl shrink-0" role="img" aria-label={item.name}>
                  {item.emoji}
                </span>
                <div className="min-w-0">
                  <p className="text-base font-black text-stone-950 dark:text-white truncate">
                    {item.name}
                  </p>
                  <p className="text-base font-bold text-stone-700 dark:text-stone-300 truncate">
                    {item.packPresentation} ({formatCurrency(item.packCost)})
                  </p>
                </div>
              </div>

              {/* Casilla de verificación de alto contraste */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border-2 transition-colors ${
                  isChecked
                    ? 'bg-emerald-700 dark:bg-emerald-500 border-emerald-700 dark:border-emerald-500 text-white'
                    : 'border-stone-500 dark:border-stone-500 bg-stone-50 dark:bg-stone-800 text-transparent'
                }`}
              >
                <Check className="w-5 h-5 stroke-[3.5]" />
              </div>
            </button>
          );
        })}
      </div>

      {filteredIngredients.length === 0 && (
        <div className="text-center py-8 bg-stone-50 dark:bg-stone-900 rounded-2xl border-2 border-stone-300 dark:border-stone-700 p-5 mt-4 space-y-2">
          <p className="text-base font-bold text-stone-950 dark:text-white">
            No encontramos "{search}" en la lista
          </p>
          <p className="text-base text-stone-700 dark:text-stone-300">
            Podés agregarlo tocando el botón secundario "Agregar otro".
          </p>
        </div>
      )}

      {/* Modal para agregar ingrediente personalizado con etiquetas visibles en todos los campos */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-md w-full p-5 shadow-2xl border-2 border-stone-400 dark:border-stone-700 space-y-3">
            <h3 className="text-xl font-black text-stone-950 dark:text-white">
              Sumar ingrediente a tu alacena
            </h3>

            <form onSubmit={handleSaveCustomIngredient} className="space-y-3">
              <div>
                <label
                  htmlFor="custom-name-input"
                  className="block text-base font-black text-stone-950 dark:text-white mb-1"
                >
                  Nombre del ingrediente *
                </label>
                <input
                  id="custom-name-input"
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej: Lentejones, Puerro..."
                  className="w-full px-3.5 py-3 bg-white dark:bg-stone-800 border-2 border-stone-400 dark:border-stone-700 text-stone-950 dark:text-white rounded-xl text-base font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="custom-category-select"
                  className="block text-base font-black text-stone-950 dark:text-white mb-1"
                >
                  Grupo alimenticio *
                </label>
                <select
                  id="custom-category-select"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as IngredientCategory)}
                  className="w-full min-h-[48px] px-3 py-2.5 border-2 border-stone-400 dark:border-stone-700 rounded-xl text-base font-bold bg-white dark:bg-stone-800 text-stone-950 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                >
                  <option value="granos_legumbres">Granos y Legumbres</option>
                  <option value="verduras_frutas">Verdulería</option>
                  <option value="proteinas">Proteínas y Huevos</option>
                  <option value="lacteos_grasas">Lácteos y Aceites</option>
                  <option value="alacena_condimentos">Alacena y Salsas</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="custom-cost-input"
                  className="block text-base font-black text-stone-950 dark:text-white mb-1"
                >
                  Precio aproximado de compra ($)
                </label>
                <input
                  id="custom-cost-input"
                  type="number"
                  value={newCost}
                  onChange={(e) => setNewCost(e.target.value)}
                  placeholder="1200"
                  className="w-full px-3.5 py-3 bg-white dark:bg-stone-800 border-2 border-stone-400 dark:border-stone-700 text-stone-950 dark:text-white rounded-xl text-base font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="custom-pres-input"
                  className="block text-base font-black text-stone-950 dark:text-white mb-1"
                >
                  Tamaño o paquete habitual
                </label>
                <input
                  id="custom-pres-input"
                  type="text"
                  value={newPresentation}
                  onChange={(e) => setNewPresentation(e.target.value)}
                  placeholder="Ej: Paquete 500g, 1 kg, Lata"
                  className="w-full px-3.5 py-3 bg-white dark:bg-stone-800 border-2 border-stone-400 dark:border-stone-700 text-stone-950 dark:text-white rounded-xl text-base font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="min-h-[48px] px-4 py-2 text-base font-bold text-stone-800 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="min-h-[48px] px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-base font-black rounded-xl shadow-xs"
                >
                  Guardar ingrediente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EL BOTÓN PRINCIPAL ÚNICO DE ESTA PANTALLA (Requisito 4) */}
      <div className="fixed bottom-20 left-0 right-0 p-3 pointer-events-none flex justify-center z-20">
        <button
          type="button"
          onClick={onGoToLunch}
          className="pointer-events-auto max-w-xl w-full min-h-[56px] py-3.5 px-5 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-black text-lg rounded-2xl shadow-xl flex items-center justify-between transition-transform active:scale-[0.98]"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-3 h-3 rounded-full bg-white shrink-0 animate-pulse" />
            <span className="truncate">
              {pantryCount === 0
                ? 'Ver almuerzos sugeridos'
                : `Tengo ${pantryCount} ${pantryCount === 1 ? 'en casa' : 'en casa'}`}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 text-white font-black text-base pl-2">
            <span>Armar almuerzo</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </div>
        </button>
      </div>
    </div>
  );
};
