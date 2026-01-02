# ANTIGRAVITY CONTEXT PROMPT – CLOSERS AI

Crea y mantén un **archivo de contexto permanente** (knowledge base) para el proyecto **Closers AI**, una aplicación SaaS basada en la metodología **ANTIGRAVITY**.

Este archivo debe servir como **fuente única de verdad** para que ningún detalle del proyecto se pierda durante el desarrollo, incluso cuando se trabajen múltiples sesiones, archivos o agentes de IA.

---

## CONTEXTO GENERAL DEL PROYECTO

Estamos construyendo un **SaaS para el mercado de Estados Unidos** llamado **Closers AI**.

El producto permite a empresas crear y entrenar un **Agente de Día (Closer AI)** que:
- Busca clientes potenciales en LinkedIn e Instagram
- Analiza perfiles públicos y publicaciones
- Califica leads según un ICP definido por el usuario
- Inicia conversaciones personalizadas
- Considera "cierre exitoso" cuando el lead **expresa explícitamente interés en hablar con la empresa**

El usuario NO sube leads.  
El sistema **descubre, analiza y contacta** de forma autónoma.

---

## ARQUITECTURA OBLIGATORIA

Respeta estrictamente este stack:

- Frontend: Next.js 14 (App Router)
- Estilos: Tailwind CSS
- Backend: Next.js Route Handlers
- Base de datos + Auth: Supabase (Postgres + RLS)
- Automatización: n8n (autoalojado)
- IA: LLMs (OpenAI o compatibles)

No propongas tecnologías alternativas.

---

## DOCUMENTOS DE REFERENCIA (CONTRATOS INMUTABLES)

Todo el desarrollo debe alinearse estrictamente con los siguientes archivos,
organizados por carpeta dentro del proyecto.

### /context
- `ANTIGRAVITY_CONTEXT_PROMPT.md`  
  → Prompt maestro de contexto permanente.  
  → Debe cargarse primero en cualquier sesión de IA.

- `ANTIGRAVITY_BASE_CLOSERS.md`  
  → Blueprint técnico base del SaaS Closers AI.

- `ANTIGRAVITY_EJEMPLO_CLOSERS.md`  
  → Ejemplo funcional del blueprint aplicado.

### /prompts
- `AGENT_MASTER_PROMPT.md`  
  → Prompt operativo del Agente de Día + Closer AI.

- `CURSOR_MASTER_PROMPT.md`  
  → Prompt único para desarrollo con Cursor / GPT / Claude.

### /definitions
- `VIBE_CODING_DEFINITIONS.md`  
  → Definiciones canónicas (enums, schemas, contratos).

- `ICP_QUESTIONNAIRE.md`  
  → Cuestionario exacto que entrena al agente.

### /database
- `DATABASE_SCHEMA.sql`  
  → Esquema SQL real para Supabase (fuente de verdad).

### /automation
- `n8n_CLOSERS_MULTI_AGENT_WORKFLOW.json`  
  → Workflow n8n multi-agente (Hunter → Analyzer → Closer).

---

Estos archivos son **contratos inmutables**.
No deben reinterpretarse, simplificarse ni duplicarse.
Cualquier desarrollo debe consultarlos antes de ejecutarse.


---

## DEFINICIONES CANÓNICAS (FUENTE DE VERDAD)

Usa exclusivamente las siguientes entidades ya definidas:

- JobStatus
- AgentStage
- LeadStatus
- JobInput (ICP estructurado)
- JobOutput (leads + summary)
- JobError

No inventes campos.
No cambies nombres.
No alteres semántica.

---

## FLUJO DEL SISTEMA (ALTO NIVEL)

1. El usuario se registra en la SaaS
2. Completa el ICP mediante un cuestionario preciso
3. Se crea un Job
4. La app llama a n8n
5. n8n ejecuta agentes:
   - Hunter → Analyzer → Closer
6. El Closer inicia contactos personalizados
7. El sistema devuelve leads con estados claros
8. "Cierre" = intención explícita de contacto humano

---

## OBJETIVO DE ESTE ARCHIVO

Este archivo debe:
- Mantener contexto completo del proyecto
- Evitar pérdida de información entre sesiones
- Alinear decisiones técnicas y de producto
- Servir como referencia constante para cualquier IA o desarrollador

Cualquier tarea futura (frontend, backend, n8n, prompts, SQL, UX) debe **consultar y respetar este contexto** antes de ejecutarse.

---

## REGLAS PARA LA IA

- No asumir requisitos no especificados
- No cambiar arquitectura
- No simplificar lógica
- Preguntar solo si falta información crítica
- Priorizar consistencia, escalabilidad y claridad

Este archivo es **el núcleo del proyecto Closers AI**.
