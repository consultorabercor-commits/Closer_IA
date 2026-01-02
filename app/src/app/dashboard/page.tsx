'use client';

import dynamic from 'next/dynamic';

// Dynamically import with no SSR to avoid any hydration issues
const DashboardContent = dynamic(() => import('./DashboardContent'), {
    ssr: false,
    loading: () => (
        <div className="min-h-screen bg-[#0a0f0a] flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Loading dashboard...</p>
            </div>
        </div>
    ),
});

export default function DashboardPage() {
    return <DashboardContent />;
}
