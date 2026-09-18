import React, { useState } from 'react';
import { Icon } from '../ui/Icon';
import { ADMIN_NAV_ITEMS } from '../../data/adminMockData';
import { logoutAdmin } from '../../lib/auth';

interface AdminLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
  pageTitle: string;
  pageDescription?: string;
  pageAction?: React.ReactNode;
  onLogout?: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentPath,
  onNavigate,
  children,
  pageTitle,
  pageDescription,
  pageAction,
  onLogout,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState('');

  const handleNav = (href: string) => {
    setMobileSidebarOpen(false);
    onNavigate(href);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setLogoutError('');
    try {
      await logoutAdmin();
      onLogout?.();
      onNavigate('/admin/login');
    } catch {
      setLogoutError('Unable to sign out. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col antialiased text-stone-900 font-sans" id="admin-root">
      {/* Top Utility Header */}
      <header className="h-14 bg-stone-900 text-stone-100 border-b border-stone-800 px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-1.5 rounded text-stone-400 hover:text-white hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400"
            aria-label="Toggle admin sidebar"
          >
            <Icon name={mobileSidebarOpen ? 'close' : 'menu'} size="md" />
          </button>

          {/* Admin Brand Marker */}
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
            <span className="font-display font-bold text-sm tracking-tight text-white">
              Portfolio Console
            </span>
            <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-stone-800 text-stone-400 border border-stone-700">
              Admin
            </span>
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors border border-stone-700"
            title="Switch to public website"
          >
            <Icon name="open_in_new" size="sm" className="text-stone-400" />
            <span>Public Site</span>
          </button>

          <div className="h-4 w-px bg-stone-800 hidden sm:block" />

          {/* Administrator Profile Tag */}
          <div className="flex items-center gap-2 text-stone-300">
            <span className="w-6 h-6 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center font-bold text-[11px] text-amber-400">
              H
            </span>
            <span className="hidden md:inline font-sans text-xs font-medium text-stone-300">
              Heritage Alawode
            </span>
          </div>

          {/* Logout Action */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-1 px-2.5 py-1 rounded text-stone-400 hover:text-rose-400 hover:bg-stone-800/80 transition-colors"
            title="Log out of admin session"
          >
            <Icon name="logout" size="sm" />
            <span className="hidden sm:inline">Logout</span>
          </button>
          {logoutError && (
            <span className="text-rose-300 text-[11px]" role="alert">
              {logoutError}
            </span>
          )}
        </div>
      </header>

      {/* Main Workspace Body: Sidebar + Scrollable Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs z-40 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar Navigation */}
        <aside
          className={`fixed md:static inset-y-14 left-0 z-40 w-64 bg-stone-900 text-stone-300 flex flex-col justify-between border-r border-stone-800 transition-transform duration-200 ease-in-out md:translate-x-0 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          aria-label="Admin Sidebar"
        >
          <div className="p-4 space-y-6 overflow-y-auto">
            {/* Context Notice */}
            <div className="px-3 py-2 rounded-lg bg-stone-800/60 border border-stone-800 text-[11px] font-mono text-stone-400 space-y-1">
              <div className="text-stone-300 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Private Console</span>
              </div>
              <div>Single-tenant management UI</div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1" role="navigation" aria-label="Admin Sections">
              {ADMIN_NAV_ITEMS.map((item) => {
                const isActive =
                  currentPath === item.href ||
                  (item.id === 'dashboard' && currentPath === '/admin');

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNav(item.href)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors select-none ${isActive
                        ? 'bg-stone-800 text-white font-semibold shadow-xs'
                        : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
                      }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        name={item.icon}
                        size="sm"
                        className={isActive ? 'text-amber-400' : 'text-stone-500'}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${isActive
                            ? 'bg-stone-700 text-stone-200'
                            : 'bg-stone-800 text-stone-400'
                          }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Sidebar Footer */}
          <div className="p-4 border-t border-stone-800 space-y-3">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-stone-800/80 hover:bg-stone-800 text-xs font-mono text-stone-300 hover:text-white transition-colors border border-stone-700/60"
            >
              <Icon name="visibility" size="sm" />
              <span>Preview Public Site</span>
            </button>
            <div className="text-[10px] font-mono text-stone-500 text-center">
              Version 1.0.0 • Local Preview
            </div>
          </div>
        </aside>

        {/* Main Work Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#F5F5F4]" role="main">
          {/* Page Top Banner / Title Header */}
          <div className="bg-white border-b border-stone-200 px-6 py-6 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
                  <span className="hover:underline cursor-pointer" onClick={() => onNavigate('/admin/dashboard')}>
                    Console
                  </span>
                  <span>/</span>
                  <span className="text-stone-800 font-semibold">{pageTitle}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold font-display text-stone-950 tracking-tight">
                  {pageTitle}
                </h1>
                {pageDescription && (
                  <p className="text-sm text-stone-600 leading-relaxed max-w-3xl">
                    {pageDescription}
                  </p>
                )}
              </div>

              {pageAction && <div className="shrink-0">{pageAction}</div>}
            </div>
          </div>

          {/* Render Page Content */}
          <div className="p-6 sm:p-8 flex-1">{children}</div>
        </main>
      </div>
    </div>
  );
};
