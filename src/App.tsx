import { useState, useEffect } from 'react';
import { RootLayout } from './components/layout/RootLayout';
import { Container } from './components/ui/Container';
import { Button } from './components/ui/Button';
import { Icon } from './components/ui/Icon';
import { SelectedWorkSection } from './components/home/SelectedWorkSection';
import { SkillsSection } from './components/home/SkillsSection';
import { AboutPage } from './components/about/AboutPage';
import { ExperiencePage } from './components/experience/ExperiencePage';
import { ContactPage } from './components/contact/ContactPage';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminProjects } from './components/admin/AdminProjects';
import { AdminReviews } from './components/admin/AdminReviews';
import { AdminMessages } from './components/admin/AdminMessages';
import { AdminAnalytics } from './components/admin/AdminAnalytics';
import { BRAND_TAGLINE, CORE_MESSAGE } from './types/navigation';
import { SELECTED_PROJECTS } from './data/projects';
import { AuthenticatedAdmin, getCurrentAdmin } from './lib/auth';

export default function App() {
  const [currentPath, setCurrentPath] = useState('/');
  const [admin, setAdmin] = useState<AuthenticatedAdmin | null>(null);
  const [authState, setAuthState] = useState<'idle' | 'checking' | 'authenticated' | 'unauthenticated'>('idle');

  const isAdminRoute = currentPath === '/admin' || currentPath.startsWith('/admin/');
  const isProtectedAdminRoute = isAdminRoute && currentPath !== '/admin/login';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPath]);

  useEffect(() => {
    if (!isProtectedAdminRoute) {
      return;
    }

    let isActive = true;
    setAuthState('checking');

    getCurrentAdmin()
      .then((currentAdmin) => {
        if (!isActive) return;
        setAdmin(currentAdmin);
        setAuthState(currentAdmin ? 'authenticated' : 'unauthenticated');
        if (!currentAdmin) setCurrentPath('/admin/login');
      })
      .catch(() => {
        if (!isActive) return;
        setAdmin(null);
        setAuthState('unauthenticated');
        setCurrentPath('/admin/login');
      });

    return () => {
      isActive = false;
    };
  }, [isProtectedAdminRoute]);

  // If visiting a specific project case-study placeholder route
  if (currentPath.startsWith('/projects/') && currentPath !== '/projects') {
    const slug = currentPath.replace('/projects/', '');
    const matchedProject = SELECTED_PROJECTS.find((p) => p.slug === slug);

    return (
      <RootLayout currentPath={currentPath} onNavigate={setCurrentPath}>
        <div className="py-16 sm:py-24 bg-[#FAFAF9] flex-1">
          <Container size="narrow">
            <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-12 space-y-6 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
                <span className="uppercase">{matchedProject?.category || 'Project Case Study'}</span>
                <span>•</span>
                <span className="text-stone-700 font-semibold">{currentPath}</span>
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl font-bold font-display text-stone-900 tracking-tight">
                  {matchedProject ? matchedProject.title : 'Project Case Study'}
                </h1>
                <p className="mt-2 text-stone-600 text-lg">
                  {matchedProject?.tagline || 'In-depth engineering documentation'}
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 text-sm text-stone-700 space-y-2 font-mono">
                <div className="flex items-center gap-2 text-stone-900 font-semibold">
                  <Icon name="info" size="sm" className="text-stone-700" />
                  <span>Case Study Route Placeholder</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed font-sans">
                  The full architectural case study—covering the problem definition, system architecture, database schema, trade-offs, and lessons learned—will be implemented in the dedicated Project Case Studies phase.
                </p>
              </div>

              {matchedProject?.technologies && (
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-stone-500">
                    Technology Stack
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {matchedProject.technologies.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded text-xs font-mono bg-stone-100 border border-stone-200 text-stone-800"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-stone-100 flex items-center gap-3">
                <Button
                  variant="primary"
                  size="md"
                  leftIcon="arrow_back"
                  onClick={() => setCurrentPath('/')}
                >
                  Return to Selected Work
                </Button>
              </div>
            </div>
          </Container>
        </div>
      </RootLayout>
    );
  }

  // Dedicated Projects Directory page (/projects)
  if (currentPath === '/projects') {
    return (
      <RootLayout currentPath={currentPath} onNavigate={setCurrentPath}>
        <div className="py-12 sm:py-20 bg-[#FAFAF9] flex-1">
          <Container size="default">
            <div className="space-y-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-stone-200">
                <div>
                  <span className="font-mono text-xs font-semibold tracking-wider text-stone-500 uppercase">
                    DIRECTORY
                  </span>
                  <h1 className="mt-1 text-3xl sm:text-4xl font-bold font-display text-stone-900 tracking-tight">
                    All Engineering Projects
                  </h1>
                  <p className="mt-2 text-stone-600 text-base sm:text-lg max-w-2xl">
                    Comprehensive overview of practical systems, tools, and technical experiments.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon="arrow_back"
                  onClick={() => setCurrentPath('/')}
                >
                  Back to Homepage
                </Button>
              </div>

              {/* Projects Grid */}
              <SelectedWorkSection onNavigate={setCurrentPath} />
            </div>
          </Container>
        </div>
      </RootLayout>
    );
  }

  // Dedicated About Page (/about)
  if (currentPath === '/about') {
    return (
      <RootLayout currentPath={currentPath} onNavigate={setCurrentPath}>
        <AboutPage onNavigate={setCurrentPath} />
      </RootLayout>
    );
  }

  // Dedicated Experience Page (/experience)
  if (currentPath === '/experience') {
    return (
      <RootLayout currentPath={currentPath} onNavigate={setCurrentPath}>
        <ExperiencePage onNavigate={setCurrentPath} />
      </RootLayout>
    );
  }

  // Dedicated Contact Page (/contact)
  if (currentPath === '/contact') {
    return (
      <RootLayout currentPath={currentPath} onNavigate={setCurrentPath}>
        <ContactPage onNavigate={setCurrentPath} />
      </RootLayout>
    );
  }

  // ================= ADMIN CONSOLE ROUTES =================

  // Admin Login (/admin/login)
  if (currentPath === '/admin/login') {
    return (
      <AdminLogin
        onNavigate={setCurrentPath}
        onLoginSuccess={(authenticatedAdmin) => {
          setAdmin(authenticatedAdmin);
          setAuthState('authenticated');
        }}
      />
    );
  }

  if (isProtectedAdminRoute && authState !== 'authenticated') {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center text-sm text-stone-600">
        {authState === 'checking' ? 'Checking admin session...' : 'Redirecting to admin login...'}
      </div>
    );
  }

  // Admin Dashboard (/admin/dashboard or /admin)
  if (currentPath === '/admin/dashboard' || currentPath === '/admin') {
    return (
      <AdminLayout
        currentPath={currentPath}
        onNavigate={setCurrentPath}
        pageTitle="System Overview"
        pageDescription="Central operational console for monitoring project publications, contact inquiries, and peer endorsements."
        onLogout={() => setAdmin(null)}
      >
        <AdminDashboard onNavigate={setCurrentPath} />
      </AdminLayout>
    );
  }

  // Admin Projects (/admin/projects)
  if (currentPath === '/admin/projects') {
    return (
      <AdminLayout
        currentPath={currentPath}
        onNavigate={setCurrentPath}
        pageTitle="Projects Directory"
        pageDescription="Manage portfolio software systems, repository links, publish status, and featured assignments."
        onLogout={() => setAdmin(null)}
      >
        <AdminProjects onNavigate={setCurrentPath} />
      </AdminLayout>
    );
  }

  // Admin Reviews (/admin/reviews)
  if (currentPath === '/admin/reviews') {
    return (
      <AdminLayout
        currentPath={currentPath}
        onNavigate={setCurrentPath}
        pageTitle="Reviews & Endorsements"
        pageDescription="Review, moderate, and approve endorsements from academic peers, BCOS ICT mentors, and clients."
        onLogout={() => setAdmin(null)}
      >
        <AdminReviews />
      </AdminLayout>
    );
  }

  // Admin Messages (/admin/messages)
  if (currentPath === '/admin/messages') {
    return (
      <AdminLayout
        currentPath={currentPath}
        onNavigate={setCurrentPath}
        pageTitle="Inbound Messages"
        pageDescription="Review inquiries and feedback submitted through the public contact channel."
        onLogout={() => setAdmin(null)}
      >
        <AdminMessages />
      </AdminLayout>
    );
  }

  // Admin Analytics (/admin/analytics)
  if (currentPath === '/admin/analytics') {
    return (
      <AdminLayout
        currentPath={currentPath}
        onNavigate={setCurrentPath}
        pageTitle="Traffic & Inquiries"
        pageDescription="Engagement metrics, case-study readership patterns, and referral sources."
        onLogout={() => setAdmin(null)}
      >
        <AdminAnalytics />
      </AdminLayout>
    );
  }

  // Primary Homepage View with Hero and the newly implemented Selected Work section
  return (
    <RootLayout currentPath={currentPath} onNavigate={setCurrentPath}>
      {/* Editorial Hero Area */}
      <section className="py-14 sm:py-20 lg:py-24 border-b border-stone-200/80 bg-stone-50/50">
        <Container size="default">
          <div className="flex flex-col items-start max-w-3xl space-y-6">
            {/* Status & Identity Marker */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-xs font-mono text-stone-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Computer Science Student & Developer</span>
            </div>

            {/* Core Identity Statement */}
            <div className="space-y-2">
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-950 leading-[1.1]">
                {BRAND_TAGLINE}
              </h1>
              <p className="font-mono text-xs sm:text-sm text-stone-500 tracking-wide pt-1">
                Practical Systems • Clean Architecture • Purpose-Driven Craft
              </p>
            </div>

            {/* Guiding Message */}
            <p className="text-lg sm:text-xl text-stone-700 leading-relaxed max-w-2xl">
              “{CORE_MESSAGE}”
            </p>
            <p className="text-base text-stone-600 max-w-2xl leading-relaxed">
              I am a Computer Science student and software developer who builds practical projects while continuously learning and growing.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                rightIcon="arrow_downward"
                onClick={() => {
                  const el = document.getElementById('selected-work');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore Selected Work
              </Button>
              <Button
                variant="outline"
                size="lg"
                leftIcon="terminal"
                onClick={() => {
                  const el = document.getElementById('skills-and-learning');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Toolkit & Learning
              </Button>
              <Button
                variant="ghost"
                size="lg"
                leftIcon="mail"
                onClick={() => setCurrentPath('/contact')}
              >
                Contact
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Selected Work Section (ASOCOMMS, FinTrack, SwiftTask, Netflix Clone) */}
      <SelectedWorkSection onNavigate={setCurrentPath} />

      {/* Skills & Ongoing Exploration Section */}
      <SkillsSection />
    </RootLayout>
  );
}
