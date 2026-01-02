import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500 opacity-10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-400 opacity-10 blur-[150px] rounded-full" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-green-400 opacity-5 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="text-xl font-bold">Closers AI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="btn-secondary">
            Log In
          </Link>
          <Link href="/signup" className="btn-primary">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-[var(--muted)]">AI-Powered Lead Generation</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Your AI{' '}
            <span className="gradient-text">Day Agent</span>
            <br />
            That Closes Deals
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto mb-10">
            Automate your outreach on LinkedIn and Instagram. Closers AI discovers, 
            qualifies, and contacts your ideal customers—while you focus on closing.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/signup" className="btn-primary text-lg px-8 py-4 glow-sm">
              Start Free Trial
            </Link>
            <button className="btn-secondary flex items-center gap-2 text-lg px-8 py-4">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">10x</div>
              <div className="text-sm text-[var(--muted)]">More Leads</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">24/7</div>
              <div className="text-sm text-[var(--muted)]">Prospecting</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">80%</div>
              <div className="text-sm text-[var(--muted)]">Time Saved</div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="mt-32">
          <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-[var(--muted)] text-center max-w-xl mx-auto mb-16">
            Three AI agents working together to find and close your ideal customers
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Hunter Agent */}
            <div className="glass-card p-8 hover:border-emerald-500 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Hunter Agent</h3>
              <p className="text-[var(--muted)]">
                Scans LinkedIn and Instagram to discover profiles matching your ideal customer profile.
              </p>
            </div>

            {/* Analyzer Agent */}
            <div className="glass-card p-8 hover:border-teal-400 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Analyzer Agent</h3>
              <p className="text-[var(--muted)]">
                Scores and qualifies each lead based on their posts, bio, and engagement signals.
              </p>
            </div>

            {/* Closer Agent */}
            <div className="glass-card p-8 hover:border-green-400 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Closer Agent</h3>
              <p className="text-[var(--muted)]">
                Crafts personalized messages and initiates conversations that lead to meetings.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-32 text-center">
          <div className="glass-card p-12 glow max-w-3xl mx-auto gradient-border">
            <h2 className="text-3xl font-bold mb-4">Ready to Close More Deals?</h2>
            <p className="text-[var(--muted)] mb-8">
              Join hundreds of businesses using AI to automate their sales outreach.
            </p>
            <Link href="/signup" className="btn-primary text-lg px-10 py-4 inline-block">
              Start Your Free Trial
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--card-border)] py-8 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-[var(--muted)]">
          <span>© 2025 Closers AI. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[var(--foreground)] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[var(--foreground)] transition-colors">Terms</a>
            <a href="#" className="hover:text-[var(--foreground)] transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
