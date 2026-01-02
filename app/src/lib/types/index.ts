// ============================================
// CLOSERS AI - TypeScript Type Definitions
// Source of truth: /definitions/VIBE_CODING_DEFINITIONS.md
// ============================================

// ============================================
// ENUMS
// ============================================

export type JobStatus = 'pending' | 'running' | 'completed' | 'failed';

export type AgentStage = 'hunter' | 'analyzer' | 'closer';

export type LeadStatus =
    | 'found'
    | 'qualified'
    | 'contacted'
    | 'interested'
    | 'meeting_requested'
    | 'discarded';

export type Platform = 'linkedin' | 'instagram';

export type Tone = 'formal' | 'casual' | 'direct';

export type ContactGoal = 'conversation' | 'meeting';

export type CtaType = 'soft' | 'direct';

export type BusinessType = 'B2B' | 'B2C';

// ============================================
// SCHEMAS
// ============================================

export interface JobInput {
    business_context: {
        industry: string;
        offer_type: string;
        b2b_or_b2c: BusinessType;
    };
    ideal_customer: {
        role: string;
        company_size: string;
        location: string;
        keywords: string[];
        pain_points: string[];
    };
    search_rules: {
        platforms: Platform[];
        must_have_signals: string[];
        must_not_have_signals: string[];
    };
    contact_strategy: {
        tone: Tone;
        goal: ContactGoal;
        cta_type: CtaType;
    };
}

export interface Lead {
    id?: string;
    job_id?: string;
    name: string;
    platform: Platform;
    profile_url: string;
    analysis: string;
    score: number;
    message_sent: string;
    lead_status: LeadStatus;
    created_at?: string;
}

export interface JobOutput {
    summary: {
        leads_found: number;
        leads_contacted: number;
        leads_interested: number;
        meetings_requested: number;
    };
    leads: Lead[];
}

export interface JobError {
    code: string;
    message: string;
    details: string | null;
}

// ============================================
// DATABASE ENTITIES
// ============================================

export interface Profile {
    id: string;
    email: string;
    full_name?: string;
    company_name?: string;
    created_at: string;
    updated_at: string;
}

export interface Job {
    id: string;
    user_id: string;
    status: JobStatus;
    input: JobInput;
    output?: JobOutput;
    error?: JobError;
    current_stage?: AgentStage;
    created_at: string;
    updated_at: string;
}

// ============================================
// API TYPES
// ============================================

export interface CreateJobRequest {
    input: JobInput;
}

export interface CreateJobResponse {
    job: Job;
}

export interface GetJobResponse {
    job: Job;
    leads: Lead[];
}

export interface N8nWebhookPayload {
    job_id: string;
    status: JobStatus;
    output?: JobOutput;
    error?: JobError;
    meta?: {
        completed_at: string;
    };
}

// ============================================
// SUPABASE DATABASE TYPES
// ============================================

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: Profile;
                Insert: Omit<Profile, 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
            };
            jobs: {
                Row: Job;
                Insert: Omit<Job, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Job, 'id' | 'user_id' | 'created_at'>>;
            };
            leads: {
                Row: Lead & { id: string; job_id: string; created_at: string };
                Insert: Omit<Lead, 'id' | 'created_at'> & { job_id: string };
                Update: Partial<Omit<Lead, 'id' | 'job_id' | 'created_at'>>;
            };
        };
        Enums: {
            job_status: JobStatus;
            lead_status: LeadStatus;
            agent_stage: AgentStage;
        };
    };
}
