import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { CreateJobRequest, CreateJobResponse, Job, JobStatus } from '@/lib/types';

// Extended response type that includes webhook info for client-side triggering
interface CreateJobWithWebhookResponse extends CreateJobResponse {
    webhook?: {
        url: string;
        payload: {
            job_id: string;
            input: unknown;
            callback_url: string;
            callback_secret: string | undefined;
        };
    };
}

// POST /api/jobs - Create a new job and return webhook info for client to trigger n8n
// NOTE: We don't call n8n from server because Cloudflare blocks Vercel IPs
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Get authenticated user
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Parse and validate request body
        const body: CreateJobRequest = await request.json();

        if (!body.input) {
            return NextResponse.json(
                { error: 'Missing input field' },
                { status: 400 }
            );
        }

        // Create job in database
        const { data: job, error: insertError } = await supabase
            .from('jobs')
            .insert({
                user_id: user.id,
                status: 'pending' as JobStatus,
                input: body.input,
            })
            .select()
            .single();

        if (insertError || !job) {
            console.error('Failed to create job:', insertError);
            return NextResponse.json(
                { error: 'Failed to create job' },
                { status: 500 }
            );
        }

        const typedJob = job as Job;

        // Prepare n8n webhook data for client-side triggering
        const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
        const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/n8n`;
        const callbackSecret = process.env.N8N_CALLBACK_SECRET;

        if (n8nWebhookUrl) {
            // Update job status to running
            await supabase
                .from('jobs')
                .update({ status: 'running' })
                .eq('id', typedJob.id);

            const updatedJob: Job = { ...typedJob, status: 'running' };

            // Return job with webhook info for client to trigger
            const response: CreateJobWithWebhookResponse = {
                job: updatedJob,
                webhook: {
                    url: n8nWebhookUrl,
                    payload: {
                        job_id: typedJob.id,
                        input: body.input,
                        callback_url: callbackUrl,
                        callback_secret: callbackSecret,
                    },
                },
            };

            return NextResponse.json(response, { status: 201 });
        }

        // Fallback if webhook URL not configured
        const response: CreateJobResponse = { job: typedJob };
        return NextResponse.json(response, { status: 201 });
    } catch (error) {
        console.error('Unexpected error in POST /api/jobs:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET /api/jobs - List all jobs for the authenticated user
export async function GET() {
    try {
        const supabase = await createClient();

        // Get authenticated user
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Fetch user's jobs
        const { data: jobs, error: fetchError } = await supabase
            .from('jobs')
            .select('*')
            .order('created_at', { ascending: false });

        if (fetchError) {
            console.error('Failed to fetch jobs:', fetchError);
            return NextResponse.json(
                { error: 'Failed to fetch jobs' },
                { status: 500 }
            );
        }

        return NextResponse.json({ jobs: (jobs || []) as Job[] });
    } catch (error) {
        console.error('Unexpected error in GET /api/jobs:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
