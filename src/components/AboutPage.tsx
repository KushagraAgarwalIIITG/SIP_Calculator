interface AboutPageProps {
  onNavigate?: (path: string) => void;
}

function LinkedInBrandIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#0A66C2" />
      <path d="M8.15 10.3v7.2H5.9v-7.2h2.25Zm.15-2.2c0 .75-.56 1.35-1.3 1.35-.74 0-1.3-.6-1.3-1.35 0-.75.56-1.35 1.3-1.35.74 0 1.3.6 1.3 1.35ZM12.1 17.5h-2.24v-7.2H12v1.02c.3-.58 1.02-1.2 2.1-1.2 2.24 0 2.65 1.47 2.65 3.38v3.99h-2.24v-3.54c0-.85-.01-1.94-1.18-1.94-1.18 0-1.36.92-1.36 1.88v3.6Z" fill="#fff"/>
    </svg>
  );
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  const navigateTo = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
      return;
    }
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-emerald-50 to-indigo-50">
      <header className="sticky top-0 z-30 border-b border-emerald-200/80 bg-white/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-white flex items-center justify-center font-bold shadow-md">
              PC
            </div>
            <div>
              <p className="text-lg font-bold text-emerald-900 leading-tight">PracticalCalculators</p>
              <p className="text-xs text-emerald-700">Smart tools for practical money decisions</p>
            </div>
          </div>

          <nav className="flex shrink-0 items-center gap-4 text-sm font-medium text-emerald-800">
            <button
              type="button"
              onClick={() => navigateTo('/home')}
              className="rounded-xl border border-cyan-200 bg-white/90 px-3 sm:px-4 py-2 text-xs sm:text-sm hover:text-cyan-600 hover:border-cyan-400 transition-colors"
            >
              Home
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-14">
        <section className="grid md:grid-cols-[1.5fr_1fr] gap-6">
          <div className="rounded-2xl border border-emerald-200/80 bg-white/90 backdrop-blur-xl p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 mb-3">Our Mission</p>
            <h1 className="text-3xl font-semibold text-emerald-900 mb-4">Financial calculators built for real Indian needs.</h1>
            <p className="text-emerald-800 leading-relaxed text-[15px]">
              PracticalCalculators exists to create financial tools that are easy to use, realistic, and actually useful
              for everyday decisions. We avoid generic templates and focus on calculators that match how people plan money
              in India.
            </p>
            <p className="text-emerald-800 leading-relaxed text-[15px] mt-3">
              We are actively building more calculators people genuinely need, with clear inputs, transparent assumptions,
              and outputs you can act on immediately.
            </p>
          </div>

          <aside className="rounded-2xl border border-emerald-200/80 bg-white/90 backdrop-blur-xl p-6 h-fit shadow-sm">
            <h2 className="text-lg font-semibold text-emerald-900 mb-4">Get in touch</h2>
            <div className="space-y-3 text-sm">
              <a
                href="https://www.linkedin.com/in/kushagraagggarwal/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-emerald-800 hover:text-cyan-600 transition-colors"
              >
                <LinkedInBrandIcon />
                Kushagra Agarwal
              </a>
              <a
                href="https://www.linkedin.com/in/priyapampati/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-emerald-800 hover:text-cyan-600 transition-colors"
              >
                <LinkedInBrandIcon />
                Priya Pampati
              </a>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
