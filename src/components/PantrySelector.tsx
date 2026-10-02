/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, Plus, Check, Sparkles, Trash2, ArrowRight } from 'lucide-react';
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
    if (!newName.trim()) return;

    const parsedCost = Number(newCost) || 1000;
    onAddCustomIngredient(
      newName.trim(),
      newCategory,
      parsedCost,
      newPresentation.trim() || '1 unidad / paquete'
    );

    setNewName('');
    setNewCost('');
    setNewPresentation('');
    setShowAddModal(false);
  };

  const pantryCount = pantryIds.length;

  return (
    <div className="pb-28">
      {/* Título de Función 1 */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-700 tracking-wide uppercase">
              Paso 1 de 3
            </span>
            <h2 className="text-xl font-bold text-stone-900">
              ¿Qué tenés en casa hoy?
            </h2>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold tabular-nums text-stone-900">
              {pantryCount}
            </span>
            <span className="text-xs text-stone-500 block">marcados</span>
          </div>
        </div>
        <p className="text-xs text-stone-600 mt-1">
          Tocá los ingredientes que ya están en tu alacena o heladera para calcular las recetas que podés hacer con menor gasto.
        </p>
      </div>

      {/* Barra de Búsqueda */}
      <div className="relative mb-3">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar arroz, huevos, fideos, cebolla..."
          className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 px-1"
          >
            Borrar
          </button>
        )}
      </div>

      {/* Botones de acción rápida */}
      <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={onSelectBasics}
          className="min-h-[38px] px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-lg hover:bg-emerald-100 flex items-center gap-1.5 shrink-0 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Pre-cargar básicos
        </button>

        {pantryCount > 0 && (
          <button
            onClick={onClearPantry}
            className="min-h-[38px] px-3 py-1.5 bg-stone-100 text-stone-600 text-xs font-medium rounded-lg hover:bg-stone-200 flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Desmarcar todo
          </button>
        )}

        <button
          onClick={() => setShowAddModal(true)}
          className="min-h-[38px] px-3 py-1.5 bg-white border border-stone-200 text-stone-700 text-xs font-medium rounded-lg hover:bg-stone-50 flex items-center gap-1.5 shrink-0 ml-auto transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-600" />
          Agregar otro
        </button>
      </div>

      {/* Filtros de Categoría */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('todos')}
          className={`min-h-[36px] px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            selectedCategory === 'todos'
              ? 'bg-stone-900 text-white'
              : 'bg-stone-100 text-stone-600 hover:text-stone-900'
          }`}
        >
          Todos ({ingredients.length})
        </button>

        {(Object.keys(CATEGORY_LABELS) as IngredientCategory[]).map((cat) => {
          const count = ingredients.filter((i) => i.category === cat).length;
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`min-h-[36px] px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 ${
                isSelected
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>{CATEGORY_LABELS[cat].icon}</span>
              <span>{CATEGORY_LABELS[cat].label}</span>
              <span className="opacity-70 text-[10px]">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Grid de ingredientes táctil para celular */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {filteredIngredients.map((item) => {
          const isChecked = pantryIds.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => onToggleIngredient(item.id)}
              className={`min-h-[54px] w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all active:scale-[0.99] select-none ${
                isChecked
                  ? 'bg-emerald-50/80 border-emerald-300 shadow-xs'
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <span className="text-xl shrink-0" role="img" aria-label={item.name}>
                  {item.emoji}
                </span>
                <div className="min-w-0">
                  <p
                    className={`text-sm font-semibold truncate ${
                      isChecked ? 'text-emerald-950' : 'text-stone-800'
                    }`}
                  >
                    {item.name}
                  </p>
                  <p className="text-[11px] text-stone-500 truncate">
                    {item.packPresentation} · pack {formatCurrency(item.packCost)}
                  </p>
                </div>
              </div>

              {/* Checkbox táctil */}
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  isChecked
                    ? 'bg-emerald-600 text-white'
                    : 'border-2 border-stone-300 text-transparent'
                }`}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </button>
          );
        })}
      </div>

      {filteredIngredients.length === 0 && (
        <div className="text-center py-10 bg-stone-50 rounded-2xl border border-dashed border-stone-200 p-6 mt-4">
          <p className="text-sm font-medium text-stone-700">No encontramos ese ingrediente</p>
          <p className="text-xs text-stone-500 mt-1">¿Querés agregarlo a tu lista para tenerlo en cuenta?</p>
          <button
            onClick={() => {
              setNewName(search);
              setShowAddModal(true);
            }}
            className="mt-3 px-4 py-2 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 inline-flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Agregar "{search}"
          </button>
        </div>
      )}

      {/* Modal / Drawer para agregar ingrediente personalizado */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-stone-200">
            <h3 className="text-base font-bold text-stone-900 mb-1">
              Agregar ingrediente a casa
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Anotá cualquier cosa que tengas en la alacena para que el calculador lo considere.
            </p>

            <form onSubmit={handleSaveCustomIngredient} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Nombre del ingrediente *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej: Lentejones, Puerro, Soja..."
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Categoría
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as IngredientCategory)}
                    className="w-full px-2 py-2 border border-stone-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="granos_legumbres">Granos y Legumbres</option>
                    <option value="verduras_frutas">Verdulería</option>
                    <option value="proteinas">Proteínas y Huevos</option>
                    <option value="lacteos_grasas">Lácteos y Aceites</option>
                    <option value="alacena_condimentos">Alacena y Salsas</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Precio pack est. ($)
                  </label>
                  <input
                    type="number"
                    value={newCost}
                    onChange={(e) => setNewCost(e.target.value)}
                    placeholder="1200"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Presentación comercial
                </label>
                <input
                  type="text"
                  value={newPresentation}
                  onChange={(e) => setNewPresentation(e.target.value)}
                  placeholder="Ej: Paquete 500g, 1 kg, Lata 300g"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg shadow-xs"
                >
                  Guardar y marcar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Botón flotante para avanzar al paso 2 en celular */}
      <div className="fixed bottom-20 left-0 right-0 p-4 pointer-events-none flex justify-center z-20">
        <button
          onClick={onGoToLunch}
          className="pointer-events-auto max-w-md w-full py-3.5 px-5 bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm rounded-xl shadow-lg shadow-stone-900/20 flex items-center justify-between transition-transform active:scale-[0.98]"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {pantryCount === 0
                ? 'Ver almuerzos sugeridos'
                : `Tengo ${pantryCount} ${pantryCount === 1 ? 'ingrediente' : 'ingredientes'}`}
            </span>
          </div>
          <div className="flex items-center gap-1 text-emerald-400 font-semibold text-xs">
            <span>Armar almuerzo</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>
      </div>
    </div>
  );
};
