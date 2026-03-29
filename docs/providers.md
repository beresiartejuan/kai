# 🔌 Proveedores de LLM

Kai está diseñado para no depender de un solo "cerebro". Utiliza un sistema de proveedores que permite alternar entre modelos locales y en la nube.

## 🤖 Modelos Actuales

| Rol | Proveedor | Modelo | Motivo |
| :--- | :--- | :--- | :--- |
| **Principal** | Ollama | `gpt-oss:20b-cloud` | Potencia y privacidad. |
| **Secundario** | OpenRouter | `openai/gpt-oss-20b:free` | Respaldo gratuito y diversidad. |
| **Resumen** | Ollama | `gemma3:1b` | Rapidez y eficiencia local. |
| **Internet** | Gemini | `gemini-2.5-flash` | Búsqueda nativa de alta calidad. |

## 🛠️ Cómo añadir un Proveedor

1. Crea un archivo en `src/providers/nuevo_prov.ts`.
2. Exporta el cliente configurado y las constantes de modelos.
3. Agrégalo al `src/providers/index.ts`.
4. Úsalo en `src/core/ai.ts` dentro de la lógica de orquestación.

## 🔄 Sistema de Alternancia (Round Robin)

En `src/core/ai.ts`, Kai utiliza un contador simple para alternar entre el modelo principal y el secundario en cada mensaje. Esto asegura que el sistema siga respondiendo incluso si un proveedor tiene límites de tasa o caídas temporales.
