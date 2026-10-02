/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { usePlatoEconomico } from './hooks/usePlatoEconomico';
import { useTheme } from './hooks/useTheme';
import { Header } from './components/Header';
import { PantrySelector } from './components/PantrySelector';
import { LunchBuilder } from './components/LunchBuilder';
import { ShoppingList } from './components/ShoppingList';
import { NavigationTabs, ActiveTab } from './components/NavigationTabs';
import { DataBackupModal } from './components/DataBackupModal';

const ACTIVE_TAB_KEY = 'plato_economico_active_tab_v1';

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
    resetPurchases,
    exportDataJson,
    importDataJson,
    loadExampleStudentData,
    clearAllData
  } = usePlatoEconomico();

  // Modal de Respaldo y Gestión de Datos
  const [showBackupModal, setShowBackupModal] = useState(false);

  // Pestaña activa: persistida en localStorage SIN manipular history.pushState ni hash
  // (para evitar reinicios en iframes y navegadores móviles)
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_TAB_KEY) as ActiveTab | null;
      if (saved === 'en_casa' || saved === 'almuerzo' || saved === 'por_comprar') {
        return saved;
      }
    } catch {}
    return 'en_casa';
  });

  const handleTabChange = (newTab: ActiveTab) => {
    setActiveTab(newTab);
    try {
      localStorage.setItem(ACTIVE_TAB_KEY, newTab);
    } catch {}
  };

  // Scroll suave al inicio al cambiar de pestaña
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-stone-100/70 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans antialiased selection:bg-emerald-200 dark:selection:bg-emerald-800 transition-colors duration-200">
      {/* Cabecera compacta con toggle de modo oscuro y botón de datos */}
      <Header
        pantryCount={pantryIds.length}
        onResetPantry={clearPantry}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onOpenBackupModal={() => setShowBackupModal(true)}
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
            onGoToLunch={() => handleTabChange('almuerzo')}
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
            onGoToShoppingList={() => handleTabChange('por_comprar')}
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
            onGoToLunchBuilder={() => handleTabChange('almuerzo')}
          />
        )}
      </main>

      {/* Navegación inferior fija por pestañas optimizada para el pulgar en celulares */}
      <NavigationTabs
        activeTab={activeTab}
        onChangeTab={handleTabChange}
        pantryCount={pantryIds.length}
        selectedRecipeTitle={currentRecipe?.title}
        missingItemsCount={shoppingList.length}
      />

      {/* Modal de Copia de Seguridad y Datos (JSON / LocalStorage) */}
      <DataBackupModal
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
        onExportJson={exportDataJson}
        onImportJson={importDataJson}
        onLoadExampleData={loadExampleStudentData}
        onClearAllData={clearAllData}
      />
    </div>
  );
}
