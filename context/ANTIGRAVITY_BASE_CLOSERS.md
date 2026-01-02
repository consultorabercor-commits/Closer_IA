## QUÉ ESTOY CONSTRUYENDO

**Aplicación SaaS que permite a empresas crear, entrenar y ejecutar un Agente de Día (Closer AI) capaz de buscar, analizar, contactar y cerrar clientes potenciales de forma autónoma en redes sociales como LinkedIn e Instagram.**

---

## 1) MI AUTOMATIZACIÓN EN N8N

**Objetivo del workflow:**  
Recibir la definición del cliente ideal (ICP) y las reglas del negocio, ejecutar agentes de IA que detecten prospectos calificados en redes sociales, analicen sus perfiles y publicaciones, inicien contacto personalizado y devuelvan leads con intención real de conversación.

**Entrada (input):**  
Formulario estructurado con:
- Rubro del negocio  
- Tipo de cliente (B2B / B2C)  
- Cargo / rol objetivo  
- Industria  
- Ubicación geográfica  
- Intereses clave  
- Palabras clave  
- Tipo de mensaje deseado  
- Objetivo del contacto  

**Validaciones:**  
- Campos obligatorios completos  
- Longitud máxima por campo  
- Coherencia semántica del ICP  
- Evitar definiciones demasiado amplias o ambiguas  

**Salida (output):**  
JSON estructurado con:
- Lista de leads encontrados  
- Plataforma (LinkedIn / Instagram)  
- URL del perfil  
- Análisis del perfil  
- Score de calificación  
- Estado del lead: `found | contacted | interested | meeting_requested`

**Webhook de n8n (trigger):**  
[Se configura con variable de entorno N8N_WEBHOOK_URL]

---

## 2) FRONTEND

**Framework:** Next.js 14 con **App Router** (NO Pages Router)  
**Estilos:** Tailwind CSS  

**Motivo:** Frontend + API en un solo proyecto, despliegue fácil, y muy conocido por asistentes de IA.

**Rutas/páginas necesarias:**
- `/` (landing)  
- `/login`  
- `/signup`  
- `/dashboard` (crear agentes y ver historial)  
- `/dashboard/[id]` (detalle del agente y leads)

**UX mínima recomendada:**
- Estados: `idle | searching | contacting | completed | failed`  
- Polling cada X segundos en vista detalle  
- Manejo visible de errores  

---

## 3) BACKEND / API

**Tecnología:** Next.js Route Handlers / API Routes  
**Motivo:** Sin servidor backend separado.

**Endpoints necesarios (contratos claros):**
- `POST /api/jobs` → crea agente y dispara n8n  
- `GET /api/jobs/[id]` → devuelve estado y resultados  
- `POST /api/webhooks/n8n` → callback de resultados  

**Requisitos técnicos:**
- Autenticación obligatoria  
- Control de permisos por usuario  
- Idempotencia en callbacks  

---

## 4) BASE DE DATOS

**Base de datos:** Supabase (Postgres)  

**Tablas mínimas:**
- `profiles`  
- `jobs`  
- `leads`  

**Campos recomendados en `jobs`:**
- `id` (uuid)  
- `user_id` (uuid)  
- `status` (`pending|running|completed|failed`)  
- `input` (jsonb)  
- `output` (jsonb)  
- `created_at`  
- `updated_at`  

---

## 5) AUTENTICACIÓN

**Auth:** Supabase Auth  

**Flujo:**
- Sign up  
- Log in  
- Acceso a dashboard  

---

## 6) HOSTING

**App:** Vercel  
**n8n:** Autoalojado  

---

## 7) CONEXIÓN N8N con la APP

**Flujo:**
1. Usuario define ICP  
2. Se crea job  
3. n8n ejecuta agentes  
4. Callback con resultados  
5. UI muestra leads  

---

## 8) VARIABLES DE ENTORNO

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
N8N_WEBHOOK_URL=
N8N_CALLBACK_SECRET=
```
