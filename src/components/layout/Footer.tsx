import React from 'react';
import { Container } from '../ui/Container';
import { Icon } from '../ui/Icon';
import { NAV_ITEMS, BRAND_TAGLINE, CORE_MESSAGE } from '../../types/navigation';

export interface FooterProps {
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(href);
    }
  };

  return (
    <footer className="border-t border-stone-200 bg-stone-100/60 text-stone-700" role="contentinfo">
      <Container size="default" className="py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-12 border-b border-stone-200/80">
          {/* Identity Column */}
          <div className="md:col-span-6 flex flex-col items-start space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg text-stone-900 tracking-tight">
                Developer Portfolio
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-stone-200 text-stone-800">
                Active Project
              </span>
            </div>
            <p className="text-sm font-medium text-stone-900">
              {BRAND_TAGLINE}
            </p>
            <p className="text-sm text-stone-600 max-w-md leading-relaxed">
              {CORE_MESSAGE} A Computer Science student and software developer building practical systems, leading with responsibility, and growing through disciplined practice.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-stone-900">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    className="text-stone-600 hover:text-stone-950 transition-colors inline-flex items-center gap-1 group"
                  >
                    <span>{item.label}</span>
                    <Icon
                      name="arrow_forward"
                      size="sm"
                      className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-stone-400"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Channels & Connect */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-stone-900">
              Connect
            </h3>
            <ul className="space-y-2 text-sm text-stone-600">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-stone-950 transition-colors"
                >
                  <Icon name="code" size="sm" />
                  <span>GitHub</span>
                  <Icon name="open_in_new" size="sm" className="text-stone-400 text-[14px]" />
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-stone-950 transition-colors"
                >
                  <Icon name="link" size="sm" />
                  <span>LinkedIn</span>
                  <Icon name="open_in_new" size="sm" className="text-stone-400 text-[14px]" />
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => handleLinkClick(e, '/contact')}
                  className="inline-flex items-center gap-1.5 hover:text-stone-950 transition-colors"
                >
                  <Icon name="mail" size="sm" />
                  <span>Direct Message</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {currentYear} Personal Portfolio. Built with React, TypeScript, and Tailwind CSS.</p>
          <div className="flex items-center gap-4 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span>Learning in public</span>
            </div>
            <span>•</span>
            <a
              href="/admin/login"
              onClick={(e) => handleLinkClick(e, '/admin/login')}
              className="text-stone-400 hover:text-stone-700 hover:underline flex items-center gap-1"
            >
              <Icon name="lock" size="sm" className="text-[12px]" />
              <span>Admin Console</span>
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};
