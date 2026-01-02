import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/admin';
import type { N8nWebhookPayload, Lead } from '@/lib/types';

// POST /api/webhooks/n8n - Callback from n8n workflow
export async function POST(request: NextRequest) {
    try {
        // Verify callback secret
        const callbackSecret = request.headers.get('x-callback-secret');
        const expectedSecret = process.env.N8N_CALLBACK_SECRET;

        if (!expectedSecret || callbackSecret !== expectedSecret) {
            console.error('Invalid callback secret');
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Parse payload
        const payload: N8nWebhookPayload = await request.json();

        if (!payload.job_id) {
            return NextResponse.json(
                { error: 'Missing job_id' },
                { status: 400 }
            );
        }

        // Use service client to bypass RLS
        const supabase = createServiceClient();

        // Check if job exists and hasn't been processed already (idempotency)
        const { data: existingJob, error: fetchError } = await supabase
            .from('jobs')
            .select('id, status')
            .eq('id', payload.job_id)
            .single();

        if (fetchError || !existingJob) {
            console.error('Job not found:', payload.job_id);
            return NextResponse.json(
                { error: 'Job not found' },
                { status: 404 }
            );
        }

        // Idempotency check: don't process if already completed or failed
        if (existingJob.status === 'completed' || existingJob.status === 'failed') {
            console.log(`Job ${payload.job_id} already processed, skipping`);
            return NextResponse.json({
                success: true,
                message: 'Already processed'
            });
        }

        // Update job status and output
        const updateData: Record<string, unknown> = {
            status: payload.status,
            updated_at: new Date().toISOString(),
        };

        if (payload.output) {
            updateData.output = payload.output;
        }

        if (payload.error) {
            updateData.error = payload.error;
        }

        const { error: updateError } = await supabase
            .from('jobs')
            .update(updateData)
            .eq('id', payload.job_id);

        if (updateError) {
            console.error('Failed to update job:', updateError);
            return NextResponse.json(
                { error: 'Failed to update job' },
                { status: 500 }
            );
        }

        // Insert leads if provided
        if (payload.output?.leads && payload.output.leads.length > 0) {
            const leadsToInsert = payload.output.leads.map((lead: Lead) => ({
                job_id: payload.job_id,
                name: lead.name,
                platform: lead.platform,
                profile_url: lead.profile_url,
                analysis: lead.analysis || null,
                score: lead.score || 0,
                message_sent: lead.message_sent || null,
                lead_status: lead.lead_status || 'found',
            }));

            const { error: leadsError } = await supabase
                .from('leads')
                .insert(leadsToInsert);

            if (leadsError) {
                console.error('Failed to insert leads:', leadsError);
                // Don't fail the whole request, job was updated successfully
            }
        }

        console.log(`Job ${payload.job_id} updated to ${payload.status}`);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Unexpected error in n8n webhook:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
