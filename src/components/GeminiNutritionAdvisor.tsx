/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  ShoppingCart,
  Clock,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  Zap,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { NutritionCombinationsResponse, FoodCombination } from '../types/nutrition';
import { MOCK_NUTRITION_RESPONSE } from '../data/mockNutritionData';

interface GeminiNutritionAdvisorProps {
  pantryIngredients: string[];
  onAddMissingIngredientToShoppingList?: (name: string, estimatedCost?: number) => void;
  onGoToShoppingList?: () => void;
}

export const GeminiNutritionAdvisor: React.FC<GeminiNutritionAdvisorProps> = ({
  pantryIngredients,
  onAddMissingIngredientToShoppingList,
  onGoToShoppingList
}) => {
  const [data, setData] = useState<NutritionCombinationsResponse | null>(MOCK_NUTRITION_RESPONSE);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasServerKey, setHasServerKey] = useState<boolean>(false);
  const [selectedCombId, setSelectedCombId] = useState<string>('comb_1');
  const [addedItemsMap, setAddedItemsMap] = useState<Record<string, boolean>>({});

  // Verificar si la clave de Gemini está presente en el servidor
  useEffect(() => {
    fetch('/api/gemini/status')
      .then((res) => res.json())
      .then((status) => {
        setHasServerKey(Boolean(status?.hasKey));
      })
      .catch(() => {
        setHasServerKey(false);
      });
  }, []);

  // Función para solicitar las combinaciones a Gemini
  const fetchCombinations = async (forceMock: boolean = false) => {
    setLoading(true);
    setError(null);

    // Timeout en frontend con AbortController de 14 segundos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 14000);

    try {
      const response = await fetch('/api/gemini/food-combinations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pantryIngredients,
          forceMock
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(
          json.message || 'Error al comunicarse con el modelo de Gemini. Podés usar los datos de prueba.'
        );
      }

      setData(json.data);
      if (json.data?.combinaciones?.length > 0) {
        setSelectedCombId(json.data.combinaciones[0].id);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('La solicitud tardó más de 14 segundos en responder. Se activaron los datos de respaldo.');
      } else {
        setError(err.message || 'No fue posible completar la consulta a la IA.');
      }
      // Ante fallo, garantizamos que el usuario nunca quede frente a una pantalla rota
      setData(MOCK_NUTRITION_RESPONSE);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const handleAddKeyItem = (combination: FoodCombination) => {
    const rawKey = combination.ingredienteClaveFaltante;
    if (!rawKey || rawKey.toLowerCase().includes('ninguno') || rawKey.toLowerCase().includes('100%')) {
      return;
    }

    if (onAddMissingIngredientToShoppingList) {
      onAddMissingIngredientToShoppingList(rawKey, 1200);
      setAddedItemsMap((prev) => ({ ...prev, [combination.id]: true }));
    }
  };

  return (
    <div className="space-y-4">
      {/* Banner de Control y Acciones de la IA */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900 dark:text-white flex items-center gap-2">
                Asesor Nutricional IA
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                  Gemini 3.8 Flash
                </span>
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                Completa los 4 grupos de alimentos según guías oficiales de salud pública
              </p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => fetchCombinations(true)}
              disabled={loading}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer"
              title="Cargar datos de prueba sin gastar llamadas de API"
            >
              Datos de prueba
            </button>
            <button
              type="button"
              onClick={() => fetchCombinations(false)}
              disabled={loading}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-sm flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Consultando...' : 'Consultar IA'}
            </button>
          </div>
        </div>

        {/* Indicador de estado de API Key */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400">
            <span
              className={`w-2 h-2 rounded-full ${
                hasServerKey ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            <span>
              {hasServerKey
                ? 'Variable GEMINI_API_KEY activa en el servidor'
                : 'Modo sin clave (usando simulador con esquema estricto)'}
            </span>
          </div>

          <span className="text-[11px] text-stone-600 dark:text-stone-300 font-mono">
            {pantryIngredients.length} ingredientes en alacena
          </span>
        </div>
      </div>

      {/* Manejo de Fallos: Banner visible si ocurrió un error */}
      {error && (
        <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-xl flex items-start gap-3 text-amber-900 dark:text-amber-200 text-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1.5 flex-1">
            <p className="font-semibold">{error}</p>
            <p className="text-amber-800 dark:text-amber-300">
              Se cargó el ejemplo estructurado para que puedas continuar sin bloqueos.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => fetchCombinations(false)}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg text-xs transition-colors"
              >
                Reintentar
              </button>
              <button
                type="button"
                onClick={() => setError(null)}
                className="px-2.5 py-1 bg-white dark:bg-stone-800 border border-amber-300 dark:border-amber-700 font-medium rounded-lg text-xs transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenido cuando hay datos listos */}
      {data && (
        <div className="space-y-4">
          {/* REQUISITO 2: Guía alimentaria mostrada como DATO estructurado (no párrafo) */}
          <div className="bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Guía Alimentaria Oficial de Referencia
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Dato 1: Nombre oficial */}
              <div className="p-2.5 bg-white dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700">
                <span className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300">
                  Nombre de la Guía
                </span>
                <span className="text-xs font-bold text-stone-900 dark:text-white leading-tight mt-0.5 block">
                  {data.guiaAlimentaria.nombre}
                </span>
              </div>

              {/* Dato 2: Autoridad emisora */}
              <div className="p-2.5 bg-white dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700">
                <span className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300">
                  Entidad Emisora
                </span>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 leading-tight mt-0.5 block">
                  {data.guiaAlimentaria.entidadEmisora}
                </span>
              </div>

              {/* Dato 3: Región */}
              <div className="p-2.5 bg-white dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700">
                <span className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300">
                  Ámbito Geográfico
                </span>
                <span className="text-xs font-bold text-stone-900 dark:text-white leading-tight mt-0.5 block">
                  {data.guiaAlimentaria.paisORegion}
                </span>
              </div>
            </div>

            {/* Pauta nutricional clave mostrada como chip informativo */}
            <div className="mt-2.5 p-2.5 bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/40 rounded-xl flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block">
                  Principio del Plato Saludable Aplicado:
                </span>
                <span className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed block">
                  {data.guiaAlimentaria.principioNutricional}
                </span>
              </div>
            </div>
          </div>

          {/* Selector de las 3 Combinaciones propuestas por la IA */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                3 Combinaciones para Completar Grupos
              </h4>
              <span className="text-[11px] text-stone-600 dark:text-stone-300">
                Tocá una para ver el desglose
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {data.combinaciones.map((comb, index) => {
                const isSelected = selectedCombId === comb.id;
                return (
                  <button
                    key={comb.id}
                    type="button"
                    onClick={() => setSelectedCombId(comb.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                        Opción #{index + 1}
                      </span>
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-medium">
                        {comb.costoNivel}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-stone-900 dark:text-white line-clamp-2">
                      {comb.titulo}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-stone-600 dark:text-stone-300 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{comb.tiempoEstimadoMinutos} min</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* REQUISITO 2: Desglose de la combinación seleccionada como DATO (tabla/cards) */}
          {(() => {
            const activeComb =
              data.combinaciones.find((c) => c.id === selectedCombId) ||
              data.combinaciones[0];

            if (!activeComb) return null;

            const isItemAdded = addedItemsMap[activeComb.id];

            return (
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 space-y-4">
                {/* Encabezado de la combinación seleccionada */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
                  <div>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                      Detalle Nutricional Estructurado
                    </span>
                    <h3 className="text-base font-bold text-stone-900 dark:text-white">
                      {activeComb.titulo}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
                      {activeComb.tiempoEstimadoMinutos} min de cocción
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {activeComb.costoNivel}
                    </span>
                  </div>
                </div>

                {/* TABLA DE DATOS: Grupos de Alimentos Cubiertos */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-2">
                    Grupos de Alimentos Cubiertos (4 Pilares)
                  </h4>

                  <div className="divide-y divide-stone-100 dark:divide-stone-800 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden">
                    {activeComb.gruposCubiertos.map((item, idx) => {
                      const isEnCasa = item.estadoAlacena === 'en_casa';
                      return (
                        <div
                          key={idx}
                          className="p-3 bg-stone-50/50 dark:bg-stone-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                        >
                          <div className="space-y-0.5">
                            <span className="text-[11px] font-semibold uppercase text-stone-600 dark:text-stone-300 block">
                              {item.grupo}
                            </span>
                            <span className="text-xs font-bold text-stone-900 dark:text-white block">
                              {item.ingredienteAportante}
                            </span>
                          </div>

                          <div className="shrink-0">
                            {isEnCasa ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                En casa
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                <ShoppingCart className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                                Por comprar
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recuadro de Dato: Ingrediente Clave Faltante */}
                <div className="p-3 bg-stone-100/80 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-stone-600 dark:text-stone-300 uppercase block">
                      Ingrediente clave a sumar para completar el plato:
                    </span>
                    <span className="text-xs font-bold text-stone-900 dark:text-white mt-0.5 block">
                      {activeComb.ingredienteClaveFaltante}
                    </span>
                  </div>

                  {!activeComb.ingredienteClaveFaltante.toLowerCase().includes('ninguno') &&
                    !activeComb.ingredienteClaveFaltante.toLowerCase().includes('100%') && (
                      <button
                        type="button"
                        onClick={() => handleAddKeyItem(activeComb)}
                        disabled={isItemAdded}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                          isItemAdded
                            ? 'bg-stone-200 dark:bg-stone-700 text-stone-500 dark:text-stone-400 cursor-default'
                            : 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-100'
                        }`}
                      >
                        {isItemAdded ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            Anotado en compras
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5" />
                            Anotar en compras
                          </>
                        )}
                      </button>
                    )}
                </div>

                {/* Dato nutricional destacado */}
                <div className="p-3 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-800/40 rounded-xl flex items-start gap-2.5">
                  <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300 uppercase block">
                      Aporte Nutricional Clave:
                    </span>
                    <span className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed block">
                      {activeComb.aporteNutricionalClave}
                    </span>
                  </div>
                </div>

                {/* Acceso directo a la lista de compras */}
                {onGoToShoppingList && (
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={onGoToShoppingList}
                      className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                    >
                      Ir a la lista de compras
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
