import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { CreateJobRequest, CreateJobResponse, Job, JobStatus } from '@/lib/types';

// POST /api/jobs - Create a new job and trigger n8n
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

        // Trigger n8n webhook
        const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
        if (n8nWebhookUrl) {
            try {
                const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/n8n`;
                const callbackSecret = process.env.N8N_CALLBACK_SECRET;

                // Update job status to running
                await supabase
                    .from('jobs')
                    .update({ status: 'running' })
                    .eq('id', typedJob.id);

                // Fire and forget - don't wait for n8n to complete
                fetch(n8nWebhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        job_id: typedJob.id,
                        input: body.input,
                        callback_url: callbackUrl,
                        callback_secret: callbackSecret,
                    }),
                }).catch((err) => {
                    console.error('Failed to trigger n8n webhook:', err);
                });

                // Return job with updated status
                const updatedJob: Job = { ...typedJob, status: 'running' };
                const response: CreateJobResponse = { job: updatedJob };
                return NextResponse.json(response, { status: 201 });
            } catch (webhookError) {
                console.error('Error triggering n8n:', webhookError);
            }
        }

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
