'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { Job } from '@/lib/types';
import DashboardClient from './DashboardClient';

export default function DashboardContent() {
    const [user, setUser] = useState<User | null>(null);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        async function loadData() {
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                router.push('/login');
                return;
            }

            setUser(user);

            const { data: jobsData } = await supabase
                .from('jobs')
                .select('*')
                .order('created_at', { ascending: false });

            setJobs((jobsData || []) as Job[]);
            setLoading(false);
        }

        loadData();
    }, [router, supabase]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto mb-4" />
                    <p className="text-[var(--muted)]">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return <DashboardClient user={user} initialJobs={jobs} />;
}
