# 📜 Historial Completo de Prompts de Usuario

Este documento registra de forma textual y cronológica todos los requerimientos y solicitudes formulados para el desarrollo, depuración y evolución de la aplicación **Plato Económico**.

---

## Prompt 0: Creación Inicial de la Aplicación

> **Problema y objetivo planteado:**
> 
> "Permitir que un estudiante o una familia con presupuesto ajustado resuelva su almuerzo diario al menor costo posible, aprovechando lo que ya tiene en la alacena y conociendo con exactitud cuánto dinero necesita para comprar únicamente los ingredientes que le faltan."
> 
> Desarrollar una versión con enfoque *mobile-first* (para celulares), sin librerías de pago, sin login ni backend complejo, con estas tres funciones y nada más:
> 1. Elegir los ingredientes que hay en casa
> 2. Armar un almuerzo con costo estimado
> 3. Generar la lista de lo que falta comprar

---

## Prompt 1: Corrección de navegación, Modo Oscuro y Sugerencias

> algo q he notado es que la app se reinicia por si sola varias veces y se regresa a la pagina anterior, quiero q arregles eso, tambien implementa la opcion para activar el modo oscuro y si tienes alguna otra sugerencia de alguna funcionalidad dimela

---

## Prompt 2: Persistencia de datos, LocalStorage vs JSON/BBDD y Respaldo

> oe la app parece q se sigue reiniciando, incluso sin hacer nada, arregla eso xfavor, y luego has esto: Quiero que los datos de la app no se pierdan al cerrarla.
> 
> Usá [localStorage / archivo JSON / SQLite / MySQL] y explicame:
> 1. Dónde queda guardada la información exactamente.
> 2. Qué pasa si el usuario borra el caché o cambia de dispositivo.
> 3. Cómo hago para exportar los datos a un archivo, por si quiero respaldarlos.
> 
> Dame el código de guardar, leer y borrar, y un dato de ejemplo ya cargado para probar.
> si ya lo tiene solo dimelo

---

## Prompt 3: Ajustes estrictos de interfaz y accesibilidad móvil

> Ajustá la interfaz de la app con estos requisitos, sin cambiar la lógica:
> 
> 1. Se usa bien desde 320 px de ancho, con una sola mano y sin hacer zoom.
> 2. Contraste suficiente para leerse al sol; texto nunca menor a 16 px.
> 3. Todos los campos con etiqueta visible, no solo con texto de ejemplo dentro.
> 4. Un solo botón principal por pantalla; los demás, secundarios.
> 5. Estado vacío: qué se muestra cuando todavía no hay ningún dato, con una frase que invite a la primera acción.
> 6. Mensajes de éxito y de error visibles, en español, sin palabras técnicas.
> 
> Dame los cambios y decime cuál de los seis puntos NO pudiste cumplir y por qué.
> y aun se sigue reiniciando x si sola la app

---

## Prompt 4: Reversión selectiva y persistencia del problema de reinicios

> vuelve a como estaba antes solo deja lo de estado vacio, por cierto la app se sigue reiniciando x si sola y ya probe en telefono y siempre pasa

---

## Prompt 5: Auditoría de Calidad y Pruebas Destructivas (Rol Tester)

> Actuá como tester de software, no como programador.
> 
> Dame diez formas concretas de romper esta app desde la interfaz
> 
> Para cada una decime: qué pasaría hoy, qué debería pasar, y el código mínimo que lo evita. No cambies el diseño ni agregues funciones nuevas.

---

## Prompt 6: Integración de la API de Gemini (Grupos de Alimentos y Guías Oficiales)

> Integrá una llamada a la API de Gemini dentro de la app para esta tarea concreta:
> La IA propone tres combinaciones que completen los grupos de alimentos y cita la guía alimentaria que usó.
> 
> Requisitos:
> 1. La respuesta debe venir como JSON con un esquema fijo (responseSchema), no como texto libre. Dame el esquema.
> 2. La app consume ese JSON y lo muestra en pantalla como dato, no como párrafo.
> 3. La llave de API se lee de una variable de entorno; mostrame cómo configurarla.
> 4. Manejo de fallo: qué se muestra si la IA no responde, responde lento o devuelve algo que no cumple el esquema.
> 5. Un ejemplo de respuesta de prueba para desarrollar sin gastar llamadas.

---

## Prompt 7: Generación de Documentación (README y prompt.md)

> Crea un readme para esta aplicacion y crea otro archivo .md y llamalo prompt.md ahi iran todos los prompt q te he hecho
