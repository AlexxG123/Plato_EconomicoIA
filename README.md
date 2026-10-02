# 🍽️ Plato Económico

> **Almuerzos al menor costo posible aprovechando lo que ya tenés en casa.**  
> Aplicación web *mobile-first* diseñada para estudiantes y familias con presupuesto ajustado, permitiendo planificar comidas diarias, conocer el gasto exacto de bolsillo y balancear grupos nutricionales con Inteligencia Artificial.

---

## 🎯 Problema que resuelve

En hogares con presupuestos ajustados y estudiantes que viven solos, la planificación de las comidas suele generar dos grandes problemas:
1. **Comprar de más o duplicar ingredientes** por no recordar qué hay en la alacena.
2. **Desbalance nutricional** por no saber cómo combinar alimentos económicos (como arroz o fideos) con proteínas y vegetales según pautas de salud pública.

**Plato Económico** resuelve esto en 3 pasos directos, sin registros obligatorios ni publicidad:
1. **Elegir lo que hay en casa:** Marcás tus ingredientes con un toque.
2. **Armar el almuerzo con costo estimado:** Elegís una receta sugerida, armás tu propio plato o pedís combinaciones balanceadas a la IA.
3. **Generar la lista exacta de compras:** Sabés de antemano cuánto dinero necesitás para comprar únicamente los faltantes.

---

## ✨ Características Principales

### 1. 🏠 Alacena en Casa (Paso 1)
- Catálogo visual por categorías: *Cereales y Harinas*, *Legumbres*, *Huevos y Carnes*, *Verduras y Frutas*, *Lácteos y Grasas*, *Alacena y Condimentos*.
- **Presets rápidos:** Botón *"Tengo lo básico"* para marcar al instante sal, aceite, arroz, papa y huevos.
- **Buscador en tiempo real** y soporte para **ingredientes personalizados** con precio por paquete y rendimiento por porción.
- Persistencia automática en el navegador (`localStorage`).

### 2. 🍲 Armador de Almuerzo y Costo Estimado (Paso 2)
- **Recetario popular económico:** Guisos de lentejas, arroz salteado, fideos con salsa, tortillas, ensaladas completas, etc.
- **Doble cálculo financiero:**
  - *Costo por porción consumida:* Valor real de lo que comés.
  - *Gasto de bolsillo a desembolsar hoy:* Cuánto tenés que gastar en el mercado hoy para comprar únicamente lo que no tenés.
- **Selector de comensales:** Ajuste automático de costos y cantidades para 1 persona (estudiante/solo), 2 personas (dúo/pareja) o 4 personas (familia).
- **Armador a Medida:** Constructor libre seleccionando base de carbohidratos, proteína, vegetales y aderezos.
- **🤖 Asesor Nutricional IA (Gemini 3.8 Flash):**
  - Propone 3 combinaciones para completar los 4 grupos de alimentos.
  - Cita la Guía Alimentaria oficial aplicada (ej. *GAPA - Ministerio de Salud de la Nación / OPS*).
  - Devuelve los datos en formato estructurado (no párrafos), con desglose por grupo, estado de alacena y botón directo *"Anotar en compras"* para el ingrediente clave faltante.
  - Incluye modo de prueba sin consumo de API para desarrollo offline.

### 3. 🛒 Lista Interactiva de Compras (Paso 3)
- Lista filtrada exclusivamente con los ingredientes faltantes para la receta seleccionada.
- Posibilidad de agregar **ítems extra libres** (ej. fruta, pan, leche) con su precio estimado.
- Indicador de presupuesto en tiempo real: **Presupuesto Total** vs. **Gastado en el Carrito**.
- Función para tachar/marcar items comprados a medida que recorrés el supermercado o verdulería.
- Botón para compartir o copiar la lista en texto plano para WhatsApp.

### 4. 💾 Respaldo y Portabilidad de Datos
- **Exportación a archivo JSON (.json):** Descarga una copia de seguridad completa con tu alacena, recetas y compras.
- **Importación de archivo JSON:** Restaura tus datos en cualquier otro celular o computadora sin depender de una cuenta en la nube.
- **Carga de perfil de prueba de estudiante:** Permite probar toda la app con un clic.
- **Reinicio de fábrica:** Borra datos locales si querés empezar desde cero.

### 5. 🌓 Modo Oscuro y Diseño Ergonómico
- Modo oscuro y claro con conmutador manual y sincronización con el sistema operativo.
- Usabilidad comprobada desde **320 px de ancho**, operable con una sola mano sin necesidad de hacer zoom.
- Prevención técnica de recargas involuntarias (*pull-to-refresh* y desconexión de WebSocket en móviles).

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Lucide Icons |
| **Backend** | Node.js, Express, tsx |
| **Inteligencia Artificial** | `@google/genai` (SDK oficial Google Gen AI) con modelo `gemini-3.8-flash` y `responseSchema` |
| **Almacenamiento** | `localStorage` con opción de exportación/importación en formato JSON |
| **Herramienta de Build** | Vite 8 en modo middleware integrado |

---

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o bun

### 1. Clonar el repositorio e instalar dependencias
```bash
git clone <URL_DEL_REPOSITORIO>
cd plato-economico
npm install
```

### 2. Configurar variables de entorno
Copia el archivo de ejemplo `.env.example` a `.env`:
```bash
cp .env.example .env
```
Edita `.env` y coloca tu clave de API de Google AI Studio:
```env
GEMINI_API_KEY="AIzaSyTuClaveRealDeGoogleAIStudio"
PORT=3000
```
> *Nota: Si no configuras la clave de Gemini, la aplicación funcionará de todas maneras utilizando el motor de datos simulados estructurados.*

### 3. Iniciar el servidor de desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000`.

### 4. Compilar para producción
```bash
npm run build
npm start
```

---

## 📡 Endpoints del Servidor Backend

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/gemini/status` | Verifica si la variable `GEMINI_API_KEY` está configurada y retorna el modelo activo. |
| `POST` | `/api/gemini/food-combinations` | Genera 3 combinaciones nutricionales con `gemini-3.8-flash` respetando el `responseSchema` JSON y citando la guía alimentaria correspondiente. Acepta el flag `forceMock: true` para pruebas sin consumo de tokens. |

---

## 📄 Licencia

Este proyecto está bajo la licencia **Apache-2.0**.
