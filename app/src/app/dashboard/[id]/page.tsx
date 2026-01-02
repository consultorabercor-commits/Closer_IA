import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import JobDetailClient from './JobDetailClient';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect('/login');
    }

    // Fetch job
    const { data: job, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();

    if (jobError || !job) {
        notFound();
    }

    // Fetch leads
    const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .eq('job_id', id)
        .order('created_at', { ascending: false });

    return <JobDetailClient job={job} initialLeads={leads || []} />;
}
