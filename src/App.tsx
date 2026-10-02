/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { usePlatoEconomico } from './hooks/usePlatoEconomico';
import { Header } from './components/Header';
import { PantrySelector } from './components/PantrySelector';
import { LunchBuilder } from './components/LunchBuilder';
import { ShoppingList } from './components/ShoppingList';
import { NavigationTabs, ActiveTab } from './components/NavigationTabs';

export default function App() {
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

  // Pestaña activa ('en_casa' | 'almuerzo' | 'por_comprar')
  const [activeTab, setActiveTab] = useState<ActiveTab>('en_casa');

  // Hacemos scroll suave hacia arriba al cambiar de pestaña para mejorar la experiencia en móvil
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 font-sans antialiased selection:bg-emerald-200">
      {/* Cabecera compacta y legible */}
      <Header
        pantryCount={pantryIds.length}
        onResetPantry={clearPantry}
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
            onGoToLunch={() => setActiveTab('almuerzo')}
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
            onGoToShoppingList={() => setActiveTab('por_comprar')}
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
            onGoToLunchBuilder={() => setActiveTab('almuerzo')}
          />
        )}
      </main>

      {/* Navegación inferior fija por pestañas optimizada para el pulgar en celulares */}
      <NavigationTabs
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        pantryCount={pantryIds.length}
        selectedRecipeTitle={currentRecipe?.title}
        missingItemsCount={shoppingList.length}
      />
    </div>
  );
}
