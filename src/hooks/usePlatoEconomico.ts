/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Ingredient, Recipe, ShoppingItem } from '../types';
import { INITIAL_INGREDIENTS } from '../data/ingredientsData';
import { BUDGET_RECIPES } from '../data/recipesData';

const STORAGE_KEYS = {
  PANTRY: 'plato_economico_pantry_v1',
  SELECTED_RECIPE: 'plato_economico_selected_recipe_v1',
  SERVINGS: 'plato_economico_servings_v1',
  BOUGHT_ITEMS: 'plato_economico_bought_items_v1',
  CUSTOM_INGREDIENTS: 'plato_economico_custom_ingredients_v1',
  EXTRA_SHOPPING: 'plato_economico_extra_shopping_v1'
};

/**
 * Ingredientes básicos que la mayoría de los hogares o estudiantes ya suelen tener
 * (sal y aceite son los clásicos que casi nunca se compran desde cero para cada comida).
 */
const DEFAULT_PANTRY_PRESETS = ['sal', 'aceite', 'arroz'];

export function usePlatoEconomico() {
  // --- ESTADO: Ingredientes en Alacena / Heladera ---
  const [pantryIds, setPantryIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PANTRY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback silencioso ante modo incógnito estricto
    }
    return DEFAULT_PANTRY_PRESETS;
  });

  // --- ESTADO: Ingredientes personalizados agregados por el usuario ---
  const [customIngredients, setCustomIngredients] = useState<Ingredient[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_INGREDIENTS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Catálogo completo combinado (base + los agregados por el usuario)
  const allIngredients = useMemo(() => {
    return [...INITIAL_INGREDIENTS, ...customIngredients];
  }, [customIngredients]);

  // Mapa rápido ID -> Objeto Ingrediente para búsquedas O(1)
  const ingredientMap = useMemo(() => {
    const map = new Map<string, Ingredient>();
    allIngredients.forEach((item) => map.set(item.id, item));
    return map;
  }, [allIngredients]);

  // --- ESTADO: Almuerzo seleccionado ---
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.SELECTED_RECIPE) || BUDGET_RECIPES[0].id;
    } catch {
      return BUDGET_RECIPES[0].id;
    }
  });

  // --- ESTADO: Porciones (1 = Estudiante/Solo, 2 = Pareja/Amigos, 4 = Familia) ---
  const [servings, setServings] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVINGS);
      return saved ? Number(saved) : 1;
    } catch {
      return 1;
    }
  });

  // --- ESTADO: Items marcados como comprados en la lista de compras ---
  const [boughtItemIds, setBoughtItemIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOUGHT_ITEMS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // --- ESTADO: Extras manuales anotados para la compra (ej. "Pan", "Fruta") ---
  const [extraShoppingItems, setExtraShoppingItems] = useState<
    Array<{ id: string; name: string; cost: number; isBought: boolean }>
  >(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXTRA_SHOPPING);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // --- SINCRONIZACIÓN LOCALSTORAGE ---
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PANTRY, JSON.stringify(pantryIds));
    } catch {}
  }, [pantryIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_INGREDIENTS, JSON.stringify(customIngredients));
    } catch {}
  }, [customIngredients]);

  useEffect(() => {
    try {
      if (selectedRecipeId) {
        localStorage.setItem(STORAGE_KEYS.SELECTED_RECIPE, selectedRecipeId);
      }
    } catch {}
  }, [selectedRecipeId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SERVINGS, String(servings));
    } catch {}
  }, [servings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOUGHT_ITEMS, JSON.stringify(boughtItemIds));
    } catch {}
  }, [boughtItemIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXTRA_SHOPPING, JSON.stringify(extraShoppingItems));
    } catch {}
  }, [extraShoppingItems]);

  // --- ACCIÓN: Alternar ingrediente en alacena ---
  const togglePantryIngredient = useCallback((id: string) => {
    setPantryIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  // --- ACCIÓN: Marcar todos / Limpiar alacena ---
  const clearPantry = useCallback(() => {
    setPantryIds([]);
  }, []);

  const selectAllBasicPantry = useCallback(() => {
    // Marca los 8 más comunes de base
    const basics = ['arroz', 'fideos', 'papa', 'cebolla', 'huevos', 'aceite', 'sal', 'pure_tomate'];
    setPantryIds(basics);
  }, []);

  // --- ACCIÓN: Agregar un ingrediente nuevo que no esté en la lista ---
  const addCustomIngredient = useCallback(
    (name: string, category: Ingredient['category'], packCost: number, packPresentation: string) => {
      // Normalizamos el ID para evitar duplicados accidentales
      const cleanId = 'custom_' + name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();
      const newIng: Ingredient = {
        id: cleanId,
        name: name.trim(),
        category,
        packCost: Math.max(100, packCost),
        packPresentation: packPresentation.trim() || 'Unidad / Paquete',
        unitCostPerPortion: Math.round(packCost * 0.25), // Estimación del 25% por porción
        unit: 'unidad',
        emoji: '🛒'
      };

      setCustomIngredients((prev) => [...prev, newIng]);
      // Automáticamente lo agregamos a lo que hay en casa
      setPantryIds((prev) => [...prev, newIng.id]);
      return newIng;
    },
    []
  );

  // --- CÁLCULO CRÍTICO 1: ANÁLISIS DE RECETAS CONTRA LA ALACENA ---
  /**
   * ATENCIÓN A ESTE PUNTO DE ERROR COMÚN:
   * Muchos desarrolladores calculan los faltantes con un booleano simple, pero
   * es fundamental distinguir entre 'ingrediente esencial' (sin él el plato no se puede hacer)
   * y 'opcional' (como una especia o queso que se puede omitir si no hay dinero).
   */
  const analyzedRecipes = useMemo(() => {
    const pantrySet = new Set(pantryIds);

    return BUDGET_RECIPES.map((recipe) => {
      const totalIngredientsCount = recipe.ingredients.length;
      let availableCount = 0;
      let missingCount = 0;

      const ingredientsStatus = recipe.ingredients.map((item) => {
        const ingData = ingredientMap.get(item.ingredientId);
        const hasIt = pantrySet.has(item.ingredientId);

        if (hasIt) {
          availableCount++;
        } else {
          missingCount++;
        }

        return {
          ...item,
          name: ingData?.name || item.ingredientId,
          emoji: ingData?.emoji || '🍽️',
          packCost: ingData?.packCost || 1000,
          packPresentation: ingData?.packPresentation || '1 unidad',
          unitCostPerPortion: ingData?.unitCostPerPortion || 200,
          hasIt
        };
      });

      // Costo proporcional real de consumo (lo que cuesta el plato en sí)
      const costPerPortion = ingredientsStatus.reduce((acc, curr) => {
        return acc + curr.unitCostPerPortion;
      }, 0);

      const totalMealCost = costPerPortion * servings;

      // Costo de bolsillo a desembolsar hoy en el mercado (solo los que NO tenés en casa)
      const outOfPocketCostToBuy = ingredientsStatus
        .filter((item) => !item.hasIt)
        .reduce((acc, curr) => acc + curr.packCost, 0);

      // Porcentaje de cobertura de la alacena
      const matchPercentage = Math.round((availableCount / totalIngredientsCount) * 100);

      return {
        ...recipe,
        ingredientsStatus,
        availableCount,
        missingCount,
        matchPercentage,
        canCookImmediately: missingCount === 0,
        costPerPortion,
        totalMealCost,
        outOfPocketCostToBuy
      };
    });
  }, [pantryIds, ingredientMap, servings]);

  // Receta seleccionada actual
  const currentRecipe = useMemo(() => {
    return (
      analyzedRecipes.find((r) => r.id === selectedRecipeId) ||
      analyzedRecipes[0] ||
      null
    );
  }, [analyzedRecipes, selectedRecipeId]);

  // --- CÁLCULO CRÍTICO 2: GENERACIÓN DE LA LISTA DE COMPRAS ---
  /**
   * ATENCIÓN A ESTE PUNTO DE ERROR COMÚN:
   * La lista de compras no debe listar '100g de fideos', sino el formato comercial
   * que el estudiante o la madre de familia encontrará en el estante ('Paquete de 500g').
   * Además, si el usuario ya compró el producto en la verdulería, debe conservarse el check.
   */
  const shoppingList = useMemo((): ShoppingItem[] => {
    if (!currentRecipe) return [];

    const missingIngredients = currentRecipe.ingredientsStatus.filter((item) => !item.hasIt);

    return missingIngredients.map((item) => {
      // Determinamos si ya fue tachado
      const isBought = boughtItemIds.includes(item.ingredientId);

      return {
        ingredientId: item.ingredientId,
        name: item.name,
        category: ingredientMap.get(item.ingredientId)?.category || 'alacena_condimentos',
        packPresentation: item.packPresentation,
        estimatedCost: item.packCost,
        neededForServings: `${item.displayQuantity} x ${servings} ${servings === 1 ? 'persona' : 'personas'}`,
        isBought
      };
    });
  }, [currentRecipe, boughtItemIds, ingredientMap, servings]);

  // Total a gastar en la compra de faltantes + extras manuales
  const totalShoppingBudget = useMemo(() => {
    const missingTotal = shoppingList.reduce((acc, item) => acc + item.estimatedCost, 0);
    const extrasTotal = extraShoppingItems.reduce((acc, item) => acc + item.cost, 0);
    return missingTotal + extrasTotal;
  }, [shoppingList, extraShoppingItems]);

  // Total de lo ya tachado/comprado
  const spentShoppingBudget = useMemo(() => {
    const missingBought = shoppingList
      .filter((i) => i.isBought)
      .reduce((acc, item) => acc + item.estimatedCost, 0);

    const extrasBought = extraShoppingItems
      .filter((i) => i.isBought)
      .reduce((acc, item) => acc + item.cost, 0);

    return missingBought + extrasBought;
  }, [shoppingList, extraShoppingItems]);

  // Alternar check de comprado en un item de la lista de compras
  const toggleShoppingItemBought = useCallback((ingredientId: string) => {
    setBoughtItemIds((prev) =>
      prev.includes(ingredientId)
        ? prev.filter((id) => id !== ingredientId)
        : [...prev, ingredientId]
    );
  }, []);

  // Agregar un extra rápido a la lista de compras (ej. "Pan", "Fruta")
  const addExtraShoppingItem = useCallback((name: string, cost: number) => {
    if (!name.trim()) return;
    const newItem = {
      id: 'extra_' + Date.now(),
      name: name.trim(),
      cost: Math.max(0, cost),
      isBought: false
    };
    setExtraShoppingItems((prev) => [...prev, newItem]);
  }, []);

  // Alternar check de comprado en extra manual
  const toggleExtraShoppingItemBought = useCallback((id: string) => {
    setExtraShoppingItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isBought: !item.isBought } : item))
    );
  }, []);

  // Eliminar un extra manual
  const removeExtraShoppingItem = useCallback((id: string) => {
    setExtraShoppingItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Limpiar lista de compras cuando se finaliza la compra o se cocinó
  const resetPurchases = useCallback(() => {
    setBoughtItemIds([]);
  }, []);

  // --- RESPALDO: EXPORTAR A ARCHIVO JSON ---
  const exportDataJson = useCallback(() => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      appName: 'Plato Económico',
      pantryIds,
      customIngredients,
      selectedRecipeId,
      servings,
      boughtItemIds,
      extraShoppingItems
    };
    return JSON.stringify(backupData, null, 2);
  }, [pantryIds, customIngredients, selectedRecipeId, servings, boughtItemIds, extraShoppingItems]);

  // --- RESPALDO: IMPORTAR DESDE ARCHIVO JSON ---
  const importDataJson = useCallback((jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed.pantryIds)) setPantryIds(parsed.pantryIds);
      if (Array.isArray(parsed.customIngredients)) setCustomIngredients(parsed.customIngredients);
      if (parsed.selectedRecipeId) setSelectedRecipeId(parsed.selectedRecipeId);
      if (typeof parsed.servings === 'number') setServings(parsed.servings);
      if (Array.isArray(parsed.boughtItemIds)) setBoughtItemIds(parsed.boughtItemIds);
      if (Array.isArray(parsed.extraShoppingItems)) setExtraShoppingItems(parsed.extraShoppingItems);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'El archivo JSON no tiene un formato válido.' };
    }
  }, []);

  // --- DATO DE EJEMPLO PRECARGADO (Para probar inmediatamente) ---
  const loadExampleStudentData = useCallback(() => {
    const examplePantry = ['arroz', 'huevos', 'cebolla', 'aceite', 'sal'];
    const exampleRecipe = 'arroz-salteado-huevo-chaufa';
    const exampleServings = 1;
    const exampleExtras = [{ id: 'extra_manzanas', name: '2 Manzanas para postre', cost: 600, isBought: false }];

    setPantryIds(examplePantry);
    setSelectedRecipeId(exampleRecipe);
    setServings(exampleServings);
    setBoughtItemIds([]);
    setExtraShoppingItems(exampleExtras);
  }, []);

  // --- BORRAR TODOS LOS DATOS ---
  const clearAllData = useCallback(() => {
    setPantryIds(DEFAULT_PANTRY_PRESETS);
    setCustomIngredients([]);
    setSelectedRecipeId(BUDGET_RECIPES[0].id);
    setServings(1);
    setBoughtItemIds([]);
    setExtraShoppingItems([]);

    try {
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    } catch {}
  }, []);

  return {
    // Datos maestros
    allIngredients,
    ingredientMap,
    pantryIds,
    togglePantryIngredient,
    clearPantry,
    selectAllBasicPantry,
    addCustomIngredient,

    // Recetas y Almuerzos
    analyzedRecipes,
    currentRecipe,
    selectedRecipeId,
    setSelectedRecipeId,
    servings,
    setServings,

    // Lista de compras
    shoppingList,
    totalShoppingBudget,
    spentShoppingBudget,
    toggleShoppingItemBought,
    extraShoppingItems,
    addExtraShoppingItem,
    toggleExtraShoppingItemBought,
    removeExtraShoppingItem,
    resetPurchases,

    // Respaldo JSON y Gestión de datos
    exportDataJson,
    importDataJson,
    loadExampleStudentData,
    clearAllData
  };
}
