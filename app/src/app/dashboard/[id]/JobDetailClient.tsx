'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Job, Lead, JobStatus, LeadStatus } from '@/lib/types';

interface JobDetailClientProps {
    job: Job;
    initialLeads: Lead[];
}

const statusConfig: Record<JobStatus, { label: string; class: string; description: string }> = {
    pending: { label: 'Pending', class: 'badge-pending', description: 'Waiting to start...' },
    running: { label: 'Running', class: 'badge-running', description: 'AI agents are working...' },
    completed: { label: 'Completed', class: 'badge-completed', description: 'All tasks finished' },
    failed: { label: 'Failed', class: 'badge-failed', description: 'An error occurred' },
};

const leadStatusConfig: Record<LeadStatus, { label: string; class: string }> = {
    found: { label: 'Found', class: 'lead-found' },
    qualified: { label: 'Qualified', class: 'lead-qualified' },
    contacted: { label: 'Contacted', class: 'lead-contacted' },
    interested: { label: 'Interested', class: 'lead-interested' },
    meeting_requested: { label: 'Meeting', class: 'lead-meeting_requested' },
    discarded: { label: 'Discarded', class: 'lead-discarded' },
};

export default function JobDetailClient({ job: initialJob, initialLeads }: JobDetailClientProps) {
    const [job, setJob] = useState(initialJob);
    const [leads, setLeads] = useState(initialLeads);
    const [isPolling, setIsPolling] = useState(job.status === 'pending' || job.status === 'running');

    // Poll for updates when job is in progress
    useEffect(() => {
        if (!isPolling) return;

        const interval = setInterval(async () => {
            try {
                const response = await fetch(`/api/jobs/${job.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setJob(data.job);
                    setLeads(data.leads || []);

                    if (data.job.status === 'completed' || data.job.status === 'failed') {
                        setIsPolling(false);
                    }
                }
            } catch (error) {
                console.error('Polling error:', error);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [isPolling, job.id]);

    const config = statusConfig[job.status];

    return (
        <div className="min-h-screen bg-[var(--background)]">
            {/* Header */}
            <header className="border-b border-[var(--card-border)] px-8 py-4">
                <div className="max-w-7xl mx-auto flex items-center gap-4">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-8 py-8">
                {/* Status Header */}
                <div className="glass-card p-6 mb-8">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`badge ${config.class}`}>
                                    {config.label}
                                </span>
                                {job.current_stage && (
                                    <span className="text-sm text-[var(--muted)]">
                                        Current stage: <span className="capitalize">{job.current_stage}</span>
                                    </span>
                                )}
                            </div>
                            <h1 className="text-2xl font-bold">
                                {job.input.business_context?.industry || 'Agent'} - {job.input.ideal_customer?.role || 'Lead Search'}
                            </h1>
                            <p className="text-[var(--muted)] mt-1">{config.description}</p>
                        </div>
                        <div className="text-right text-sm text-[var(--muted)]">
                            <div>Created: {new Date(job.created_at).toLocaleString()}</div>
                            <div>Updated: {new Date(job.updated_at).toLocaleString()}</div>
                        </div>
                    </div>

                    {/* Progress indicators for running jobs */}
                    {job.status === 'running' && (
                        <div className="flex gap-4">
                            {(['hunter', 'analyzer', 'closer'] as const).map((stage, index) => {
                                const stageIndex = ['hunter', 'analyzer', 'closer'].indexOf(job.current_stage || 'hunter');
                                const isActive = job.current_stage === stage;
                                const isComplete = index < stageIndex;

                                return (
                                    <div
                                        key={stage}
                                        className={`flex-1 p-4 rounded-lg border transition-all ${isActive
                                                ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                                                : isComplete
                                                    ? 'border-[var(--success)]/50 bg-[var(--success)]/5'
                                                    : 'border-[var(--card-border)]'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            {isComplete ? (
                                                <svg className="w-5 h-5 text-[var(--success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : isActive ? (
                                                <div className="w-5 h-5 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin" />
                                            ) : (
                                                <div className="w-5 h-5 rounded-full border-2 border-[var(--muted)]" />
                                            )}
                                            <span className={`font-medium capitalize ${isActive ? 'text-[var(--primary-light)]' : ''}`}>
                                                {stage}
                                            </span>
                                        </div>
                                        <p className="text-xs text-[var(--muted)]">
                                            {stage === 'hunter' && 'Finding profiles'}
                                            {stage === 'analyzer' && 'Scoring leads'}
                                            {stage === 'closer' && 'Crafting messages'}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Summary stats for completed jobs */}
                    {job.status === 'completed' && job.output?.summary && (
                        <div className="grid grid-cols-4 gap-4 mt-4">
                            <div className="text-center p-4 rounded-lg bg-[var(--card-bg)]">
                                <div className="text-2xl font-bold text-[var(--foreground)]">
                                    {job.output.summary.leads_found}
                                </div>
                                <div className="text-sm text-[var(--muted)]">Found</div>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-[var(--card-bg)]">
                                <div className="text-2xl font-bold text-[var(--accent)]">
                                    {job.output.summary.leads_contacted}
                                </div>
                                <div className="text-sm text-[var(--muted)]">Contacted</div>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-[var(--card-bg)]">
                                <div className="text-2xl font-bold text-[var(--accent-secondary)]">
                                    {job.output.summary.leads_interested}
                                </div>
                                <div className="text-sm text-[var(--muted)]">Interested</div>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-[var(--card-bg)]">
                                <div className="text-2xl font-bold text-[var(--success)]">
                                    {job.output.summary.meetings_requested}
                                </div>
                                <div className="text-sm text-[var(--muted)]">Meetings</div>
                            </div>
                        </div>
                    )}

                    {/* Error display */}
                    {job.status === 'failed' && job.error && (
                        <div className="mt-4 p-4 rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/20">
                            <div className="font-medium text-[var(--error)]">{job.error.code}</div>
                            <div className="text-sm text-[var(--error)]/80">{job.error.message}</div>
                            {job.error.details && (
                                <div className="text-xs text-[var(--muted)] mt-2">{job.error.details}</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Leads List */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Leads ({leads.length})</h2>
                        {isPolling && (
                            <span className="text-sm text-[var(--muted)] flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
                                Updating...
                            </span>
                        )}
                    </div>

                    {leads.length === 0 ? (
                        <div className="glass-card p-12 text-center">
                            {job.status === 'running' || job.status === 'pending' ? (
                                <>
                                    <div className="w-16 h-16 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mx-auto mb-4">
                                        <div className="w-8 h-8 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin" />
                                    </div>
                                    <p className="text-[var(--muted)]">Searching for leads...</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 rounded-full bg-[var(--card-bg)] flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-[var(--muted)]">No leads found</p>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {leads.map((lead) => (
                                <div key={lead.id} className="glass-card p-5 hover:border-[var(--primary)]/50 transition-all">
                                    <div className="flex items-start gap-4">
                                        {/* Avatar placeholder */}
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent-secondary)] flex items-center justify-center flex-shrink-0">
                                            <span className="text-white font-semibold text-lg">
                                                {lead.name?.charAt(0)?.toUpperCase() || '?'}
                                            </span>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-semibold truncate">{lead.name}</h3>
                                                <span className={`badge text-xs ${leadStatusConfig[lead.lead_status]?.class || ''}`}>
                                                    {leadStatusConfig[lead.lead_status]?.label || lead.lead_status}
                                                </span>
                                                {lead.score !== undefined && lead.score > 0 && (
                                                    <span className="text-sm text-[var(--muted)]">
                                                        Score: <span className="text-[var(--success)]">{lead.score}</span>
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3 text-sm text-[var(--muted)] mb-2">
                                                <span className="capitalize">{lead.platform}</span>
                                                <a
                                                    href={lead.profile_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[var(--primary-light)] hover:underline truncate"
                                                >
                                                    {lead.profile_url}
                                                </a>
                                            </div>

                                            {lead.analysis && (
                                                <p className="text-sm text-[var(--muted)] mb-2">{lead.analysis}</p>
                                            )}

                                            {lead.message_sent && (
                                                <div className="mt-3 p-3 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)]">
                                                    <div className="text-xs text-[var(--muted)] mb-1">Message sent:</div>
                                                    <p className="text-sm">{lead.message_sent}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ICP Configuration Preview */}
                <details className="glass-card">
                    <summary className="p-4 cursor-pointer hover:bg-[var(--card-bg)] transition-colors">
                        <span className="font-medium">View Agent Configuration</span>
                    </summary>
                    <div className="p-4 pt-0 border-t border-[var(--card-border)] mt-4">
                        <pre className="text-sm text-[var(--muted)] overflow-x-auto">
                            {JSON.stringify(job.input, null, 2)}
                        </pre>
                    </div>
                </details>
            </main>
        </div>
    );
}
