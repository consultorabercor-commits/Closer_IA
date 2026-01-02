'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { Job, JobStatus } from '@/lib/types';

interface DashboardClientProps {
    user: User;
    initialJobs: Job[];
}

const statusConfig: Record<JobStatus, { label: string; class: string }> = {
    pending: { label: 'Pending', class: 'badge-pending' },
    running: { label: 'Running', class: 'badge-running' },
    completed: { label: 'Completed', class: 'badge-completed' },
    failed: { label: 'Failed', class: 'badge-failed' },
};

export default function DashboardClient({ user, initialJobs }: DashboardClientProps) {
    const [jobs, setJobs] = useState<Job[]>(initialJobs);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    };

    const refreshJobs = async () => {
        const response = await fetch('/api/jobs');
        if (response.ok) {
            const data = await response.json();
            setJobs(data.jobs || []);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)]">
            {/* Header */}
            <header className="border-b border-[var(--card-border)] px-8 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent-secondary)] flex items-center justify-center">
                            <span className="text-white font-bold text-xl">C</span>
                        </div>
                        <span className="text-xl font-bold">Closers AI</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-[var(--muted)]">{user.email}</span>
                        <button onClick={handleSignOut} className="btn-secondary text-sm py-2 px-4">
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-8 py-8">
                {/* Title Bar */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Your Agents</h1>
                        <p className="text-[var(--muted)] mt-1">
                            Create and manage your AI sales agents
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Agent
                    </button>
                </div>

                {/* Jobs Grid */}
                {jobs.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 rounded-full bg-[var(--card-bg)] flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold mb-2">No agents yet</h2>
                        <p className="text-[var(--muted)] mb-6">
                            Create your first AI agent to start finding leads
                        </p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="btn-primary"
                        >
                            Create Your First Agent
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {jobs.map((job) => (
                            <Link
                                key={job.id}
                                href={`/dashboard/${job.id}`}
                                className="glass-card p-6 hover:border-[var(--primary)] transition-all duration-300 group"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`badge ${statusConfig[job.status].class}`}>
                                                {statusConfig[job.status].label}
                                            </span>
                                            {job.current_stage && (
                                                <span className="text-sm text-[var(--muted)]">
                                                    Stage: {job.current_stage}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-semibold mb-1 group-hover:text-[var(--primary-light)] transition-colors">
                                            {job.input.business_context?.industry || 'Untitled Agent'}
                                        </h3>
                                        <p className="text-sm text-[var(--muted)]">
                                            Target: {job.input.ideal_customer?.role || 'Not specified'} •
                                            Platforms: {job.input.search_rules?.platforms?.join(', ') || 'All'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        {job.output?.summary && (
                                            <div className="text-sm">
                                                <span className="text-[var(--success)]">{job.output.summary.leads_found}</span>
                                                <span className="text-[var(--muted)]"> leads found</span>
                                            </div>
                                        )}
                                        <div className="text-xs text-[var(--muted)] mt-1">
                                            {new Date(job.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Refresh button */}
                <div className="mt-6 text-center">
                    <button
                        onClick={refreshJobs}
                        className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                    >
                        ↻ Refresh
                    </button>
                </div>
            </main>

            {/* Create Modal */}
            {showCreateModal && (
                <CreateAgentModal
                    onClose={() => setShowCreateModal(false)}
                    onCreated={() => {
                        setShowCreateModal(false);
                        refreshJobs();
                    }}
                />
            )}
        </div>
    );
}

// Create Agent Modal Component
function CreateAgentModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    // Form state
    const [formData, setFormData] = useState({
        industry: '',
        offer_type: '',
        b2b_or_b2c: 'B2B' as 'B2B' | 'B2C',
        role: '',
        company_size: '',
        location: '',
        keywords: '',
        pain_points: '',
        platforms: ['linkedin'] as ('linkedin' | 'instagram')[],
        must_have_signals: '',
        must_not_have_signals: '',
        tone: 'casual' as 'formal' | 'casual' | 'direct',
        goal: 'conversation' as 'conversation' | 'meeting',
        cta_type: 'soft' as 'soft' | 'direct',
    });

    const updateField = (field: string, value: unknown) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        const jobInput = {
            business_context: {
                industry: formData.industry,
                offer_type: formData.offer_type,
                b2b_or_b2c: formData.b2b_or_b2c,
            },
            ideal_customer: {
                role: formData.role,
                company_size: formData.company_size,
                location: formData.location,
                keywords: formData.keywords.split(',').map(k => k.trim()).filter(Boolean),
                pain_points: formData.pain_points.split(',').map(p => p.trim()).filter(Boolean),
            },
            search_rules: {
                platforms: formData.platforms,
                must_have_signals: formData.must_have_signals.split(',').map(s => s.trim()).filter(Boolean),
                must_not_have_signals: formData.must_not_have_signals.split(',').map(s => s.trim()).filter(Boolean),
            },
            contact_strategy: {
                tone: formData.tone,
                goal: formData.goal,
                cta_type: formData.cta_type,
            },
        };

        try {
            const response = await fetch('/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input: jobInput }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to create agent');
            }

            const data = await response.json();
            onCreated();
            router.push(`/dashboard/${data.job.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-[var(--card-border)]">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">Create New Agent</h2>
                        <button onClick={onClose} className="text-[var(--muted)] hover:text-[var(--foreground)]">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    {/* Progress indicator */}
                    <div className="flex gap-2 mt-4">
                        {[1, 2, 3, 4].map((s) => (
                            <div
                                key={s}
                                className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? 'bg-[var(--primary)]' : 'bg-[var(--card-border)]'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                <div className="p-6">
                    {/* Step 1: Business Context */}
                    {step === 1 && (
                        <div className="space-y-5">
                            <h3 className="text-lg font-semibold mb-4">Business Context</h3>
                            <div>
                                <label className="block text-sm font-medium mb-2">Industry</label>
                                <input
                                    type="text"
                                    value={formData.industry}
                                    onChange={(e) => updateField('industry', e.target.value)}
                                    className="input-field"
                                    placeholder="e.g., Technology, Healthcare, Finance"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">What are you selling?</label>
                                <input
                                    type="text"
                                    value={formData.offer_type}
                                    onChange={(e) => updateField('offer_type', e.target.value)}
                                    className="input-field"
                                    placeholder="e.g., SaaS Platform, Consulting Services"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Business Type</label>
                                <div className="flex gap-3">
                                    {(['B2B', 'B2C'] as const).map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => updateField('b2b_or_b2c', type)}
                                            className={`flex-1 py-3 rounded-lg border transition-all ${formData.b2b_or_b2c === type
                                                    ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                                                    : 'border-[var(--card-border)] hover:border-[var(--muted)]'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Ideal Customer */}
                    {step === 2 && (
                        <div className="space-y-5">
                            <h3 className="text-lg font-semibold mb-4">Ideal Customer Profile</h3>
                            <div>
                                <label className="block text-sm font-medium mb-2">Target Role/Title</label>
                                <input
                                    type="text"
                                    value={formData.role}
                                    onChange={(e) => updateField('role', e.target.value)}
                                    className="input-field"
                                    placeholder="e.g., CEO, Marketing Director, VP of Sales"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Company Size</label>
                                <select
                                    value={formData.company_size}
                                    onChange={(e) => updateField('company_size', e.target.value)}
                                    className="input-field"
                                >
                                    <option value="">Select size...</option>
                                    <option value="1-10">1-10 employees</option>
                                    <option value="11-50">11-50 employees</option>
                                    <option value="51-200">51-200 employees</option>
                                    <option value="200+">200+ employees</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => updateField('location', e.target.value)}
                                    className="input-field"
                                    placeholder="e.g., United States, New York, Global"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Keywords (comma-separated)</label>
                                <input
                                    type="text"
                                    value={formData.keywords}
                                    onChange={(e) => updateField('keywords', e.target.value)}
                                    className="input-field"
                                    placeholder="e.g., growth, scaling, automation"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 3: Search Rules */}
                    {step === 3 && (
                        <div className="space-y-5">
                            <h3 className="text-lg font-semibold mb-4">Search Criteria</h3>
                            <div>
                                <label className="block text-sm font-medium mb-2">Platforms</label>
                                <div className="flex gap-3">
                                    {(['linkedin', 'instagram'] as const).map((platform) => (
                                        <button
                                            key={platform}
                                            onClick={() => {
                                                const platforms = formData.platforms.includes(platform)
                                                    ? formData.platforms.filter(p => p !== platform)
                                                    : [...formData.platforms, platform];
                                                updateField('platforms', platforms.length > 0 ? platforms : [platform]);
                                            }}
                                            className={`flex-1 py-3 rounded-lg border transition-all capitalize ${formData.platforms.includes(platform)
                                                    ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                                                    : 'border-[var(--card-border)] hover:border-[var(--muted)]'
                                                }`}
                                        >
                                            {platform}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Must-have signals (comma-separated)</label>
                                <input
                                    type="text"
                                    value={formData.must_have_signals}
                                    onChange={(e) => updateField('must_have_signals', e.target.value)}
                                    className="input-field"
                                    placeholder="e.g., hiring, growth, fundraising"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Exclude signals (comma-separated)</label>
                                <input
                                    type="text"
                                    value={formData.must_not_have_signals}
                                    onChange={(e) => updateField('must_not_have_signals', e.target.value)}
                                    className="input-field"
                                    placeholder="e.g., not hiring, downsizing"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 4: Contact Strategy */}
                    {step === 4 && (
                        <div className="space-y-5">
                            <h3 className="text-lg font-semibold mb-4">Contact Strategy</h3>
                            <div>
                                <label className="block text-sm font-medium mb-2">Message Tone</label>
                                <div className="flex gap-3">
                                    {(['formal', 'casual', 'direct'] as const).map((tone) => (
                                        <button
                                            key={tone}
                                            onClick={() => updateField('tone', tone)}
                                            className={`flex-1 py-3 rounded-lg border transition-all capitalize ${formData.tone === tone
                                                    ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                                                    : 'border-[var(--card-border)] hover:border-[var(--muted)]'
                                                }`}
                                        >
                                            {tone}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Contact Goal</label>
                                <div className="flex gap-3">
                                    {(['conversation', 'meeting'] as const).map((goal) => (
                                        <button
                                            key={goal}
                                            onClick={() => updateField('goal', goal)}
                                            className={`flex-1 py-3 rounded-lg border transition-all capitalize ${formData.goal === goal
                                                    ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                                                    : 'border-[var(--card-border)] hover:border-[var(--muted)]'
                                                }`}
                                        >
                                            {goal === 'conversation' ? 'Start Conversation' : 'Request Meeting'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Call-to-Action Style</label>
                                <div className="flex gap-3">
                                    {(['soft', 'direct'] as const).map((cta) => (
                                        <button
                                            key={cta}
                                            onClick={() => updateField('cta_type', cta)}
                                            className={`flex-1 py-3 rounded-lg border transition-all ${formData.cta_type === cta
                                                    ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                                                    : 'border-[var(--card-border)] hover:border-[var(--muted)]'
                                                }`}
                                        >
                                            {cta === 'soft' ? 'Soft CTA' : 'Direct CTA'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 p-3 rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/20 text-[var(--error)] text-sm">
                            {error}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[var(--card-border)] flex justify-between">
                    <button
                        onClick={() => step > 1 ? setStep(step - 1) : onClose()}
                        className="btn-secondary"
                    >
                        {step > 1 ? 'Back' : 'Cancel'}
                    </button>
                    {step < 4 ? (
                        <button onClick={() => setStep(step + 1)} className="btn-primary">
                            Continue
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="btn-primary disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Launch Agent'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
