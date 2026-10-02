/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Recipe } from '../types';

/**
 * Catálogo de almuerzos nutritivos y súper económicos pensados
 * específicamente para estudiantes o familias que necesitan maximizar su dinero.
 * 
 * Cada receta utiliza ingredientes cruzados con 'INITIAL_INGREDIENTS'.
 * Todas las cantidades de 'amountPerServing' están normalizadas para 1 comensal
 * y se multiplican dinámicamente según la cantidad de porciones elegidas (1, 2 o 4).
 */
export const BUDGET_RECIPES: Recipe[] = [
  {
    id: 'guiso-lentejas-economico',
    title: 'Guiso Rendidor de Lentejas y Vegetales',
    description: 'Un clásico de olla hiper saciante, cargado de proteína vegetal y hierro. No necesita carne para ser un almuerzo completo.',
    timeMinutes: 35,
    difficulty: 'Fácil',
    category: 'rendidor',
    budgetTip: 'Las lentejas rinden el triple de su volumen al hidratarse. Si te sobra, queda aún más sabroso al día siguiente.',
    ingredients: [
      { ingredientId: 'lentejas', amountPerServing: 80, displayQuantity: '80 g', isEssential: true },
      { ingredientId: 'cebolla', amountPerServing: 0.5, displayQuantity: '1/2 unidad', isEssential: true },
      { ingredientId: 'zanahoria', amountPerServing: 1, displayQuantity: '1 unidad', isEssential: true },
      { ingredientId: 'papa', amountPerServing: 1, displayQuantity: '1 unidad', isEssential: false },
      { ingredientId: 'pure_tomate', amountPerServing: 100, displayQuantity: '4 cdas (100g)', isEssential: true },
      { ingredientId: 'aceite', amountPerServing: 1, displayQuantity: '1 chorrito', isEssential: true },
      { ingredientId: 'sal', amountPerServing: 1, displayQuantity: 'a gusto', isEssential: true },
      { ingredientId: 'oregano', amountPerServing: 1, displayQuantity: '1 pizca', isEssential: false }
    ],
    cookingSteps: [
      'Picar la cebolla y cortar la zanahoria y la papa en cubitos pequeños para que se cocinen rápido.',
      'En una ollita con un chorrito de aceite, dorar la cebolla y la zanahoria durante 4 minutos.',
      'Agregar las lentejas lavadas, el puré de tomate y cubrir con 2 tazas de agua caliente o caldo.',
      'Sumar los cubos de papa, condimentar con sal y orégano. Dejar hervir a fuego medio-bajo durante 25-30 minutos hasta que la papa esté tierna.',
      'Servir bien caliente en plato hondo.'
    ]
  },
  {
    id: 'arroz-salteado-huevo-chaufa',
    title: 'Arroz Salteado con Huevo y Vegetales',
    description: 'El almuerzo de estudiante por excelencia: rápido, delicioso, y perfecto si tenés arroz del día anterior en la heladera.',
    timeMinutes: 15,
    difficulty: 'Fácil',
    category: 'rapido',
    budgetTip: 'Usar arroz cocido frío de la heladera hace que el salteado quede suelto y no se pegue en la sartén.',
    ingredients: [
      { ingredientId: 'arroz', amountPerServing: 90, displayQuantity: '90 g (1 pocillo)', isEssential: true },
      { ingredientId: 'huevos', amountPerServing: 2, displayQuantity: '2 unidades', isEssential: true },
      { ingredientId: 'cebolla', amountPerServing: 0.5, displayQuantity: '1/2 unidad', isEssential: true },
      { ingredientId: 'zanahoria', amountPerServing: 1, displayQuantity: '1 unidad rallada', isEssential: true },
      { ingredientId: 'ajo', amountPerServing: 1, displayQuantity: '1 diente', isEssential: false },
      { ingredientId: 'aceite', amountPerServing: 1, displayQuantity: '1 cucharada', isEssential: true },
      { ingredientId: 'sal', amountPerServing: 1, displayQuantity: 'a gusto', isEssential: true }
    ],
    cookingSteps: [
      'Hervir el arroz en agua con sal por 12 minutos (o usar arroz frío sobrante). Escurrir bien.',
      'En una sartén bien caliente con aceite, saltear la cebolla picada y la zanahoria rallada con el ajo picado fino.',
      'Hacer un hueco en el centro de la sartén, romper los huevos y revolverlos rápidamente hasta que cuajen.',
      'Integrar el arroz cocido, saltear todo junto a fuego fuerte 2 minutos para que tome sabor y servir.'
    ]
  },
  {
    id: 'tortilla-papa-cebolla',
    title: 'Tortilla Española Rápida de Papa y Cebolla',
    description: 'Con solo 3 ingredientes básicos de verdulería lográs un almuerzo contundente, nutritivo y de costo mínimo.',
    timeMinutes: 25,
    difficulty: 'Fácil',
    category: 'rendidor',
    budgetTip: 'Cortar las papas en láminas finitas hace que se cocinen en la mitad de tiempo sin gastar tanto gas o electricidad.',
    ingredients: [
      { ingredientId: 'papa', amountPerServing: 2, displayQuantity: '2 papas medianas', isEssential: true },
      { ingredientId: 'cebolla', amountPerServing: 0.5, displayQuantity: '1/2 unidad', isEssential: true },
      { ingredientId: 'huevos', amountPerServing: 2, displayQuantity: '2 unidades', isEssential: true },
      { ingredientId: 'aceite', amountPerServing: 1, displayQuantity: '1 cucharada', isEssential: true },
      { ingredientId: 'sal', amountPerServing: 1, displayQuantity: 'a gusto', isEssential: true },
      { ingredientId: 'oregano', amountPerServing: 1, displayQuantity: 'opcional', isEssential: false }
    ],
    cookingSteps: [
      'Pelar y cortar las papas en láminas muy finas o cubitos chicos. Picar la cebolla en juliana.',
      'Cocinar la papa y cebolla en sartén con un chorro de aceite tapado a fuego suave hasta que estén blandas (o 5 min al microondas para ahorrar tiempo).',
      'Batir los huevos en un bowl con una pizca de sal y mezclar las papas tibias.',
      'Verter en sartén caliente con unas gotas de aceite. Cocinar 4 minutos de un lado, dar vuelta con ayuda de un plato y dorar 3 minutos más.'
    ]
  },
  {
    id: 'fideos-salsa-tomate-queso',
    title: 'Fideos con Salsa Casera de Tomate y Queso',
    description: 'El plato reconfortante más rápido del mundo. Mucho más rico y barato que comprar salsas listas en frasco.',
    timeMinutes: 15,
    difficulty: 'Fácil',
    category: 'rapido',
    budgetTip: 'El puré de tomate en tetra brik cuesta la mitad que una salsa lista y rinde el doble al condimentarla en casa.',
    ingredients: [
      { ingredientId: 'fideos', amountPerServing: 100, displayQuantity: '100 g', isEssential: true },
      { ingredientId: 'pure_tomate', amountPerServing: 150, displayQuantity: '150 g', isEssential: true },
      { ingredientId: 'cebolla', amountPerServing: 0.5, displayQuantity: '1/2 unidad', isEssential: false },
      { ingredientId: 'ajo', amountPerServing: 1, displayQuantity: '1 diente', isEssential: false },
      { ingredientId: 'queso_rallado', amountPerServing: 25, displayQuantity: '2 cucharadas', isEssential: false },
      { ingredientId: 'aceite', amountPerServing: 1, displayQuantity: '1 cucharada', isEssential: true },
      { ingredientId: 'oregano', amountPerServing: 1, displayQuantity: '1 pizca', isEssential: false },
      { ingredientId: 'sal', amountPerServing: 1, displayQuantity: 'a gusto', isEssential: true }
    ],
    cookingSteps: [
      'Poner a hervir abundante agua con sal para los fideos.',
      'En una sartén o cacerola chica, dorar el ajo picado y la cebolla en aceite.',
      'Agregar el puré de tomate, sal y orégano. Dejar cocinar a fuego bajo 8 minutos.',
      'Cocinar los fideos al dente, colar reservando 2 cucharadas de agua de cocción.',
      'Mezclar los fideos con la salsa, el chorrito de agua caliente y terminar con queso rallado.'
    ]
  },
  {
    id: 'polenta-cremosa-tuco-arvejas',
    title: 'Polenta Cremosa con Tuco y Arvejas',
    description: 'Plato ultrarrápido (se hace en 10 minutos), muy llenador para días fríos y con excelente aporte energético.',
    timeMinutes: 15,
    difficulty: 'Fácil',
    category: 'rendidor',
    budgetTip: 'La polenta instantánea se cocina en 1 minuto. Agregar un chorrito de leche o manteca la deja súper cremosa.',
    ingredients: [
      { ingredientId: 'polenta', amountPerServing: 80, displayQuantity: '80 g (1/2 taza)', isEssential: true },
      { ingredientId: 'pure_tomate', amountPerServing: 120, displayQuantity: '120 g', isEssential: true },
      { ingredientId: 'arvejas_lata', amountPerServing: 0.5, displayQuantity: '1/2 lata', isEssential: false },
      { ingredientId: 'cebolla', amountPerServing: 0.5, displayQuantity: '1/2 unidad', isEssential: false },
      { ingredientId: 'queso_rallado', amountPerServing: 20, displayQuantity: '1 cucharada', isEssential: false },
      { ingredientId: 'leche', amountPerServing: 100, displayQuantity: '100 ml (1/2 vaso)', isEssential: false },
      { ingredientId: 'aceite', amountPerServing: 1, displayQuantity: '1 chorrito', isEssential: true },
      { ingredientId: 'sal', amountPerServing: 1, displayQuantity: 'a gusto', isEssential: true }
    ],
    cookingSteps: [
      'Hacer el tuco: saltear cebolla en aceite, agregar el puré de tomate y las arvejas. Cocinar 6 minutos.',
      'En otra olla, calentar 2 partes de agua y 1 parte de leche con sal hasta que rompa el hervor.',
      'Verter la polenta en forma de lluvia batiendo constantemente con cuchara o batidor de alambre para evitar grumos.',
      'Cocinar 1 a 2 minutos hasta espesar.',
      'Servir la polenta en el plato, cubrir con la salsa caliente y espolvorear queso rallado.'
    ]
  },
  {
    id: 'salpicon-atun-arroz-huevo',
    title: 'Salpicón Fresco de Arroz, Atún y Huevo',
    description: 'Ideal para días cálidos o para llevar en táper a la facultad o al trabajo. Proteína magra y cero complicaciones.',
    timeMinutes: 20,
    difficulty: 'Fácil',
    category: 'nutritivo',
    budgetTip: '1 lata de atún mezclada con arroz y huevo rinde 2 porciones completas duplicando el volumen sin perder sabor.',
    ingredients: [
      { ingredientId: 'arroz', amountPerServing: 80, displayQuantity: '80 g', isEssential: true },
      { ingredientId: 'atun', amountPerServing: 0.5, displayQuantity: '1/2 lata', isEssential: true },
      { ingredientId: 'huevos', amountPerServing: 1, displayQuantity: '1 huevo duro', isEssential: true },
      { ingredientId: 'tomate', amountPerServing: 1, displayQuantity: '1 tomate redondo', isEssential: true },
      { ingredientId: 'cebolla', amountPerServing: 0.25, displayQuantity: '1/4 cebolla fina', isEssential: false },
      { ingredientId: 'aceite', amountPerServing: 1, displayQuantity: '1 cucharada', isEssential: true },
      { ingredientId: 'sal', amountPerServing: 1, displayQuantity: 'a gusto', isEssential: true }
    ],
    cookingSteps: [
      'Hervir el arroz en agua con sal por 12 minutos. Escurrir y enfriar bajo la canilla con agua fría.',
      'Hervir el huevo durante 9 minutos para que quede firme. Pelar y picar.',
      'Cortar el tomate en cubitos y la cebolla en plumas finitas.',
      'En un bowl amplio, mezclar el arroz frío, el atún desmenuzado, el huevo picado y los vegetales.',
      'Condimentar con una cucharada de aceite y sal. Listo para comer fresco.'
    ]
  },
  {
    id: 'pastel-papa-carne-express',
    title: 'Pastel de Papa y Carne Picada Express',
    description: 'El clásico hogareño más pedido. Versión sartén express para no prender el horno y ahorrar tiempo.',
    timeMinutes: 30,
    difficulty: 'Medio',
    category: 'rendidor',
    budgetTip: 'Rallar zanahoria finita en el relleno de carne rinde el doble la cantidad de carne picada y aporta jugosidad.',
    ingredients: [
      { ingredientId: 'carne_picada', amountPerServing: 120, displayQuantity: '120 g', isEssential: true },
      { ingredientId: 'papa', amountPerServing: 2, displayQuantity: '2 papas medianas', isEssential: true },
      { ingredientId: 'cebolla', amountPerServing: 0.5, displayQuantity: '1/2 unidad', isEssential: true },
      { ingredientId: 'zanahoria', amountPerServing: 0.5, displayQuantity: '1/2 unidad rallada', isEssential: false },
      { ingredientId: 'leche', amountPerServing: 50, displayQuantity: 'un chorrito', isEssential: false },
      { ingredientId: 'manteca', amountPerServing: 10, displayQuantity: '1 cdita', isEssential: false },
      { ingredientId: 'aceite', amountPerServing: 1, displayQuantity: '1 cucharada', isEssential: true },
      { ingredientId: 'sal', amountPerServing: 1, displayQuantity: 'a gusto', isEssential: true }
    ],
    cookingSteps: [
      'Hervir las papas peladas en trozos hasta que estén bien tiernas. Pisar con sal, un chorrito de leche y manteca para hacer el puré.',
      'En una sartén con aceite, rehogar la cebolla y la zanahoria rallada por 4 minutos.',
      'Agregar la carne picada y saltear a fuego fuerte desgranándola con cuchara de madera hasta que cambie de color y esté cocida. Condimentar con sal.',
      'Armar: en un plato o fuente individual poner la base de carne jugosa y cubrir con el puré de papas bien caliente.',
      'Opcional: marcar con tenedor y espolvorear queso para dorar si se desea.'
    ]
  },
  {
    id: 'salteado-pollo-fideos-vegetales',
    title: 'Wok Criollo de Pollo con Fideos y Verduras',
    description: 'Poco pollo rinde un montón al cortarlo en tiritas y saltearlo con fideos al dente y verduras crujientes.',
    timeMinutes: 20,
    difficulty: 'Fácil',
    category: 'nutritivo',
    budgetTip: 'Cortar el pollo en tiritas bien finas para que se cocine en 3 minutos y se distribuya en cada bocado.',
    ingredients: [
      { ingredientId: 'pollo', amountPerServing: 100, displayQuantity: '100 g en tiritas', isEssential: true },
      { ingredientId: 'fideos', amountPerServing: 80, displayQuantity: '80 g', isEssential: true },
      { ingredientId: 'cebolla', amountPerServing: 0.5, displayQuantity: '1/2 unidad', isEssential: true },
      { ingredientId: 'zanahoria', amountPerServing: 1, displayQuantity: '1 unidad en bastones', isEssential: true },
      { ingredientId: 'zapallito', amountPerServing: 0.5, displayQuantity: '1/2 unidad', isEssential: false },
      { ingredientId: 'aceite', amountPerServing: 1, displayQuantity: '1 cucharada', isEssential: true },
      { ingredientId: 'sal', amountPerServing: 1, displayQuantity: 'a gusto', isEssential: true }
    ],
    cookingSteps: [
      'Hervir los fideos 1 minuto menos de lo que dice el paquete para que queden firmes. Colar.',
      'Cortar la cebolla, la zanahoria y el zapallito en tiritas finas.',
      'En una sartén bien caliente con aceite, sellar el pollo cortado en tiras hasta que esté dorado.',
      'Sumar las verduras y saltear a fuego vivo 4 minutos para que queden tiernas pero crujientes.',
      'Agregar los fideos cocidos a la sartén, mezclar bien con el salteado y servir de inmediato.'
    ]
  },
  {
    id: 'omelette-completo-espinaca-queso',
    title: 'Omelette Nutritivo de Espinaca y Queso',
    description: 'Listo en 8 minutos. Ideal cuando llegás con hambre y cansancio y necesitás comida real sin ensuciar.',
    timeMinutes: 10,
    difficulty: 'Fácil',
    category: 'rapido',
    budgetTip: 'La espinaca fresca reduce su tamaño en segundos en la sartén. Un puñado crudo se transforma en un relleno suave.',
    ingredients: [
      { ingredientId: 'huevos', amountPerServing: 2, displayQuantity: '2 unidades', isEssential: true },
      { ingredientId: 'espinaca', amountPerServing: 0.3, displayQuantity: '1 puñado grande lavado', isEssential: true },
      { ingredientId: 'queso_rallado', amountPerServing: 25, displayQuantity: '1 trozo o feta', isEssential: true },
      { ingredientId: 'cebolla', amountPerServing: 0.25, displayQuantity: '1/4 unidad picadita', isEssential: false },
      { ingredientId: 'aceite', amountPerServing: 1, displayQuantity: '1 cucharadita', isEssential: true },
      { ingredientId: 'sal', amountPerServing: 1, displayQuantity: 'a gusto', isEssential: true }
    ],
    cookingSteps: [
      'Picar la espinaca lavada y la cebolla en cubitos bien chicos.',
      'En una sartén pequeña con unas gotas de aceite, saltear la cebolla y la espinaca 1 minuto hasta que ablande. Retirar.',
      'Batir los dos huevos con una pizca de sal.',
      'Verter los huevos en la sartén caliente. Cuando el fondo cuaje, colocar en una mitad la espinaca y el queso.',
      'Doblar la otra mitad encima formando una medialuna. Cocinar 1 minuto más hasta que el queso se derrita.'
    ]
  },
  {
    id: 'sopa-espesa-verduras-avena',
    title: 'Sopa Espesa de Vegetales y Avena Nutritiva',
    description: 'Sustanciosa y reconfortante. La avena espesa el caldo naturalmente y brinda saciedad duradera por muy poca plata.',
    timeMinutes: 20,
    difficulty: 'Fácil',
    category: 'nutritivo',
    budgetTip: 'Usar avena para espesar sopas reemplaza cremas costosas y aporta fibra de alta calidad por centavos.',
    ingredients: [
      { ingredientId: 'avena', amountPerServing: 40, displayQuantity: '4 cdas soperas', isEssential: true },
      { ingredientId: 'zanahoria', amountPerServing: 1, displayQuantity: '1 unidad rallada', isEssential: true },
      { ingredientId: 'papa', amountPerServing: 1, displayQuantity: '1 unidad en cubitos', isEssential: true },
      { ingredientId: 'cebolla', amountPerServing: 0.5, displayQuantity: '1/2 unidad', isEssential: true },
      { ingredientId: 'caldo', amountPerServing: 0.5, displayQuantity: '1/2 cubito', isEssential: false },
      { ingredientId: 'aceite', amountPerServing: 1, displayQuantity: '1 cucharadita', isEssential: true },
      { ingredientId: 'sal', amountPerServing: 1, displayQuantity: 'a gusto', isEssential: true }
    ],
    cookingSteps: [
      'En una olla, rehogar la cebolla y la zanahoria rallada con un chorrito de aceite.',
      'Agregar la papa en cubitos muy chicos y 2 tazas de agua caliente con el medio cubito de caldo.',
      'Cocinar 10 minutos hasta que la papa esté tierna.',
      'Agregar la avena en lluvia y revolver a fuego bajo por 3 a 5 minutos hasta que la sopa tome cuerpo espeso y cremoso.',
      'Servir en tazón bien caliente.'
    ]
  }
];
