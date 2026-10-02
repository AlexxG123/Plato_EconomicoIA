/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { usePlatoEconomico } from './hooks/usePlatoEconomico';
import { useTheme } from './hooks/useTheme';
import { Header } from './components/Header';
import { PantrySelector } from './components/PantrySelector';
import { LunchBuilder } from './components/LunchBuilder';
import { ShoppingList } from './components/ShoppingList';
import { NavigationTabs, ActiveTab } from './components/NavigationTabs';

const ACTIVE_TAB_KEY = 'plato_economico_active_tab_v1';

const HASH_MAP: Record<string, ActiveTab> = {
  'en-casa': 'en_casa',
  'almuerzo': 'almuerzo',
  'por-comprar': 'por_comprar'
};

const TAB_TO_HASH: Record<ActiveTab, string> = {
  en_casa: 'en-casa',
  almuerzo: 'almuerzo',
  por_comprar: 'por-comprar'
};

export default function App() {
  const { isDark, toggleTheme } = useTheme();

  const {
    allIngredients,
    pantryIds,
    togglePantryIngredient,
    clearPantry,
    selectAllBasicPantry,
    addCustomIngredient,
    analyzedRecipes,
    currentRecipe,
    selectedRecipeId,
    setSelectedRecipeId,
    servings,
    setServings,
    shoppingList,
    totalShoppingBudget,
    spentShoppingBudget,
    toggleShoppingItemBought,
    extraShoppingItems,
    addExtraShoppingItem,
    toggleExtraShoppingItemBought,
    removeExtraShoppingItem,
    resetPurchases
  } = usePlatoEconomico();

  // ATENCIÓN - SOLUCIÓN AL PROBLEMA DE REINICIO Y RETORNO A LA PÁGINA ANTERIOR:
  // Inicializamos la pestaña desde URL Hash o LocalStorage para que si el navegador
  // recarga o el teléfono suspende la pestaña, nunca regrese forzadamente al inicio.
  const [activeTab, setActiveTabState] = useState<ActiveTab>(() => {
    try {
      const hash = window.location.hash.replace('#', '');
      if (HASH_MAP[hash]) {
        return HASH_MAP[hash];
      }
      const saved = localStorage.getItem(ACTIVE_TAB_KEY) as ActiveTab | null;
      if (saved && (saved === 'en_casa' || saved === 'almuerzo' || saved === 'por_comprar')) {
        return saved;
      }
    } catch {}
    return 'en_casa';
  });

  // Cambiar pestaña actualizando URL hash e historial del navegador de forma segura
  const changeTab = useCallback((newTab: ActiveTab, updateHistory = true) => {
    setActiveTabState(newTab);
    try {
      localStorage.setItem(ACTIVE_TAB_KEY, newTab);
      const targetHash = '#' + TAB_TO_HASH[newTab];
      if (updateHistory && window.location.hash !== targetHash) {
        window.history.pushState(null, '', targetHash);
      }
    } catch {}
  }, []);

  // Escuchar botón 'Atrás' del celular o del navegador (soporte Android / iOS)
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      const mapped = HASH_MAP[hash];
      if (mapped) {
        setActiveTabState(mapped);
        try {
          localStorage.setItem(ACTIVE_TAB_KEY, mapped);
        } catch {}
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sincronizar hash inicial si no había
  useEffect(() => {
    const targetHash = '#' + TAB_TO_HASH[activeTab];
    if (window.location.hash !== targetHash) {
      window.history.replaceState(null, '', targetHash);
    }
  }, [activeTab]);

  // Scroll arriba suave al cambiar de pestaña
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-stone-100/70 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans antialiased selection:bg-emerald-200 dark:selection:bg-emerald-800 transition-colors duration-200">
      {/* Cabecera compacta con toggle de modo oscuro */}
      <Header
        pantryCount={pantryIds.length}
        onResetPantry={clearPantry}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      {/* Contenedor principal con ergonomía móvil */}
      <main className="max-w-xl mx-auto px-4 pt-4">
        {/* Pestaña 1: Elegir los ingredientes que hay en casa */}
        {activeTab === 'en_casa' && (
          <PantrySelector
            ingredients={allIngredients}
            pantryIds={pantryIds}
            onToggleIngredient={togglePantryIngredient}
            onSelectBasics={selectAllBasicPantry}
            onClearPantry={clearPantry}
            onAddCustomIngredient={addCustomIngredient}
            onGoToLunch={() => changeTab('almuerzo')}
          />
        )}

        {/* Pestaña 2: Armar un almuerzo con costo estimado */}
        {activeTab === 'almuerzo' && (
          <LunchBuilder
            recipes={analyzedRecipes}
            selectedRecipeId={selectedRecipeId}
            onSelectRecipe={(id) => setSelectedRecipeId(id)}
            servings={servings}
            onChangeServings={setServings}
            onGoToShoppingList={() => changeTab('por_comprar')}
            allIngredients={allIngredients}
            pantryIds={pantryIds}
          />
        )}

        {/* Pestaña 3: Generar la lista de lo que falta comprar */}
        {activeTab === 'por_comprar' && (
          <ShoppingList
            currentRecipe={currentRecipe}
            servings={servings}
            shoppingList={shoppingList}
            totalShoppingBudget={totalShoppingBudget}
            spentShoppingBudget={spentShoppingBudget}
            onToggleItemBought={toggleShoppingItemBought}
            extraShoppingItems={extraShoppingItems}
            onAddExtraItem={addExtraShoppingItem}
            onToggleExtraBought={toggleExtraShoppingItemBought}
            onRemoveExtraItem={removeExtraShoppingItem}
            onResetPurchases={resetPurchases}
            onGoToLunchBuilder={() => changeTab('almuerzo')}
          />
        )}
      </main>

      {/* Navegación inferior fija por pestañas optimizada para el pulgar en celulares */}
      <NavigationTabs
        activeTab={activeTab}
        onChangeTab={(tab) => changeTab(tab)}
        pantryCount={pantryIds.length}
        selectedRecipeTitle={currentRecipe?.title}
        missingItemsCount={shoppingList.length}
      />
    </div>
  );
}
