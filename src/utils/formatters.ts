/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Utilidades de formateo para Plato Económico.
 */

/**
 * Formatea un número como moneda clara y legible para el usuario.
 * Utiliza puntos para miles y omite decimales superfluos si son enteros.
 * Ejemplo: 1400 -> "$ 1.400"
 */
export function formatCurrency(amount: number): string {
  // ATENCIÓN: Redondeamos a enteros para que los presupuestos de almacén no tengan
  // centavos confusos en la visualización móvil rápida.
  const rounded = Math.round(amount);
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(rounded);
}

/**
 * Normaliza cadenas para búsqueda insensible a mayúsculas y acentos.
 * Evita que buscar "cebolla" no encuentre "Cebolla", o "limón" no encuentre "limon".
 */
export function normalizeSearch(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Genera el texto formateado para enviar la lista de compras por WhatsApp o copiar al portapapeles.
 */
export function formatShoppingListForShare(
  recipeTitle: string,
  servings: number,
  items: Array<{ name: string; packPresentation: string; estimatedCost: number; isBought: boolean }>,
  totalCost: number
): string {
  const dateStr = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  
  let text = `🛒 *PLATO ECONÓMICO - Lista de Compras*\n`;
  text += `🍲 Para: *${recipeTitle}* (${servings} ${servings === 1 ? 'porción' : 'porciones'})\n`;
  text += `📅 Fecha: ${dateStr}\n\n`;
  text += `*Ingredientes que faltan comprar:*\n`;

  items.forEach((item) => {
    const check = item.isBought ? '✅' : '▫️';
    text += `${check} ${item.name} (${item.packPresentation}) ~ ${formatCurrency(item.estimatedCost)}\n`;
  });

  text += `\n💰 *Total estimado a gastar:* ${formatCurrency(totalCost)}\n`;
  text += `_Generado con Plato Económico para cocinar al menor costo._`;

  return text;
}
