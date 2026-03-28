# 🤖 Kai AI - Terminal Assistant

Kai es un asistente de terminal inteligente y extensible construido con **Bun**, **Ollama** y **Drizzle ORM**. Diseñado para ser una herramienta potente pero amigable, Kai combina la potencia de modelos en la nube con la privacidad y eficiencia de modelos locales.

## ✨ Características Principales

- 🧠 **Memoria a Largo Plazo**: Kai puede recordar preferencias, nombres y datos clave entre sesiones utilizando un sistema de almacenamiento persistente.
- 🐚 **Ejecución de Comandos**: Capacidad para ejecutar comandos en tu terminal (siempre bajo tu supervisión y confirmación manual).
- 📝 **Resumen Inteligente**: Utiliza un modelo local ligero (`gemma3:1b`) para resumir mensajes largos (>500 caracteres), manteniendo la base de datos limpia y eficiente.
- ☁️ **Cerebro Híbrido**: El agente principal corre sobre modelos potentes (`deepseek-v3`) mientras que las tareas auxiliares se procesan localmente.
- 🎨 **Interfaz Elegante**: Construido con `@clack/prompts` para una experiencia visualmente atractiva y limpia en la CLI.
- 🗄️ **Persistencia Robusta**: Historial de chat y memorias guardadas en SQLite mediante Drizzle ORM.

## 🚀 Tecnologías

- **Runtime**: [Bun](https://bun.sh/)
- **AI Engine**: [Ollama](https://ollama.com/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Database**: [LibSQL / SQLite](https://turso.tech/libsql)
- **CLI UI**: [@clack/prompts](https://github.com/natemoo-re/clack)

## 🛠️ Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone <tu-repositorio>
   cd kai
   ```

2. **Instalar dependencias:**
   ```bash
   bun install
   ```

3. **Configurar Ollama:**
   Asegúrate de tener instalados los modelos necesarios:
   ```bash
   ollama pull deepseek-v3  # Modelo principal
   ollama pull gemma3:1b    # Modelo de resumen
   ```

4. **Variables de Entorno:**
   Crea un archivo `.env` (si usas Turso/LibSQL remoto):
   ```env
   TURSO_DATABASE_URL=file:local.db
   TURSO_AUTH_TOKEN=
   ```

## 🎮 Uso

Para iniciar el asistente, simplemente ejecuta:

```bash
bun start
```

### Comandos Disponibles dentro del Chat:
- **`salir` o `exit`**: Termina la conversación de forma segura.
- **Herramientas**: El modelo invocará automáticamente herramientas como `execute_command` o `create_memory` cuando lo considere necesario.

## 📂 Estructura del Proyecto

```text
src/
├── core/           # Lógica central (AI, Historial, Prompts)
├── db/             # Esquema y consultas (Drizzle)
├── tools/          # Herramientas que el modelo puede usar
└── index.ts        # Punto de entrada de la aplicación
```

## 🛡️ Seguridad

Kai nunca ejecutará un comando en tu terminal sin tu permiso explícito. Cada vez que el modelo intente realizar una acción de sistema, se te presentará un prompt de confirmación `(y/N)`.
