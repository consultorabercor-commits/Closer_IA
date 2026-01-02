# VIBE CODING DEFINITIONS – CLOSERS AI

## Canonical Types (Source of Truth)

All code must use these exact definitions. Do not modify names or semantics.

---

## Enums

### JobStatus
```typescript
type JobStatus = 'pending' | 'running' | 'completed' | 'failed';
```

### AgentStage
```typescript
type AgentStage =
  | 'hunter'     // Profile discovery
  | 'analyzer'   // Analysis and scoring
  | 'closer';    // Contact and closing
```

### LeadStatus
```typescript
type LeadStatus =
  | 'found'              // Profile detected
  | 'qualified'          // Matches ICP
  | 'contacted'          // Message sent
  | 'interested'         // Responded with interest
  | 'meeting_requested'  // Wants human contact
  | 'discarded';         // Not relevant
```

---

## Schemas

### JobInput
```typescript
interface JobInput {
  business_context: {
    industry: string;
    offer_type: string;
    b2b_or_b2c: 'B2B' | 'B2C';
  };
  ideal_customer: {
    role: string;
    company_size: string;
    location: string;
    keywords: string[];
    pain_points: string[];
  };
  search_rules: {
    platforms: ('linkedin' | 'instagram')[];
    must_have_signals: string[];
    must_not_have_signals: string[];
  };
  contact_strategy: {
    tone: 'formal' | 'casual' | 'direct';
    goal: 'conversation' | 'meeting';
    cta_type: 'soft' | 'direct';
  };
}
```

### JobOutput
```typescript
interface JobOutput {
  summary: {
    leads_found: number;
    leads_contacted: number;
    leads_interested: number;
    meetings_requested: number;
  };
  leads: Lead[];
}

interface Lead {
  name: string;
  platform: 'linkedin' | 'instagram';
  profile_url: string;
  analysis: string;
  score: number;
  message_sent: string;
  lead_status: LeadStatus;
}
```

### JobError
```typescript
interface JobError {
  code: string;
  message: string;
  details: string | null;
}
```

---

## Database Contracts

- Table `profiles`: User accounts
- Table `jobs`: Agent execution records
- Table `leads`: Discovered and processed leads

All tables use Row Level Security (RLS) to isolate user data.
