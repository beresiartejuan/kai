# 🏗️ Arquitectura de Kai

Kai utiliza una arquitectura de **Capas de Cebolla (Onion Architecture)** altamente desacoplada, diseñada para ser modular y resistente al cambio.

## 🌀 Capas del Sistema

### 1. Núcleo (Core)
El cerebro del asistente. No sabe *cómo* se conectan los modelos ni *qué* base de datos se usa, solo sabe orquestar el flujo:
- **`ai.ts`**: Orquestador de LLMs. Decide quién responde y procesa las herramientas.
- **`history.ts`**: Gestor de contexto. Mantiene la memoria de corto plazo (caché) y sincroniza con la persistencia.
- **`prompts.ts`**: Interfaz visual de usuario.

### 2. Proveedores (Providers)
Adaptadores técnicos para servicios externos. Si quieres cambiar de OpenAI a Anthropic, solo tocas esta capa.
- **Ollama**: Modelos locales (Gemma, Llama).
- **OpenRouter**: Acceso a modelos de nube gratuitos/pagos.
- **Gemini**: Capacidades de razonamiento y búsqueda avanzada.

### 3. Herramientas (Tools)
Capacidades extendidas que el modelo puede "invocar":
- **Terminal**: Ejecución segura de comandos.
- **Memory**: Persistencia de datos clave.
- **Web**: Acceso a información en tiempo real.

## 🔄 Flujo de Datos

1. **Input**: El usuario escribe un mensaje.
2. **Contexto**: `History` recupera los últimos 15 mensajes.
3. **Orquestación**: `AI` elige un modelo (Main o Second) y le pasa el contexto + herramientas.
4. **Ejecución**: Si el modelo pide una herramienta, `AI` la ejecuta y le devuelve el resultado.
5. **Output**: Se muestra la respuesta final al usuario y se guarda en `DB`.
