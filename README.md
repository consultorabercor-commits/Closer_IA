# Closers AI 🚀

AI-powered SaaS for autonomous lead generation and outreach on LinkedIn and Instagram.

## Features

- **Hunter Agent** - Discovers profiles matching your ICP
- **Analyzer Agent** - Scores and qualifies leads
- **Closer Agent** - Crafts personalized outreach messages

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Automation**: n8n workflows
- **AI**: OpenAI GPT-4o-mini

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- n8n instance (cloud or self-hosted)
- OpenAI API key

### Installation

```bash
cd app
npm install
```

### Environment Variables

Create `.env.local` in the `app` folder:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
N8N_WEBHOOK_URL=your_n8n_webhook_url
N8N_CALLBACK_SECRET=your_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Setup

Run the SQL schema in your Supabase SQL Editor:
- `database/DATABASE_SCHEMA.sql`

### n8n Workflow

Import the workflow from:
- `automation/n8n_CLOSERS_MULTI_AGENT_WORKFLOW.json`

### Run Development Server

```bash
cd app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
closers-ai/
├── app/                    # Next.js application
├── context/                # ANTIGRAVITY documentation
├── prompts/                # Agent prompts
├── definitions/            # Type definitions
├── database/               # SQL schemas
└── automation/             # n8n workflows
```

## License

MIT
