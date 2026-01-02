import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { GetJobResponse, Job, Lead } from '@/lib/types';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
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

        // Fetch job (RLS ensures user can only see their own jobs)
        const { data: job, error: jobError } = await supabase
            .from('jobs')
            .select('*')
            .eq('id', id)
            .single();

        if (jobError || !job) {
            return NextResponse.json(
                { error: 'Job not found' },
                { status: 404 }
            );
        }

        // Fetch leads for this job
        const { data: leads, error: leadsError } = await supabase
            .from('leads')
            .select('*')
            .eq('job_id', id)
            .order('created_at', { ascending: false });

        if (leadsError) {
            console.error('Failed to fetch leads:', leadsError);
        }

        const response: GetJobResponse = {
            job: job as unknown as Job,
            leads: (leads || []) as unknown as Lead[],
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Unexpected error in GET /api/jobs/[id]:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/jobs/[id] - Delete a job
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
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

        // Delete job (RLS ensures user can only delete their own jobs)
        const { error: deleteError } = await supabase
            .from('jobs')
            .delete()
            .eq('id', id);

        if (deleteError) {
            console.error('Failed to delete job:', deleteError);
            return NextResponse.json(
                { error: 'Failed to delete job' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Unexpected error in DELETE /api/jobs/[id]:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
