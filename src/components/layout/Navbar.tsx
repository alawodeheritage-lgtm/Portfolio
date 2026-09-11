import React, { useState, useEffect } from 'react';
import { Container } from '../ui/Container';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';
import { NAV_ITEMS, BRAND_TAGLINE } from '../../types/navigation';

export interface NavbarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath = '/',
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(href);
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-200 ${
        scrolled
          ? 'bg-stone-50/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs'
          : 'bg-stone-50 border-b border-stone-200/60'
      }`}
      role="banner"
    >
      <Container size="default">
        <div className="flex items-center justify-between h-18">
          {/* Brand & Identity Marker */}
          <div className="flex items-center gap-3">
            <a
              href="/"
              onClick={(e) => handleLinkClick(e, '/')}
              className="group flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 rounded-sm"
              aria-label="Home"
            >
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg text-stone-900 tracking-tight group-hover:text-stone-700 transition-colors">
                  Heritage Tech Labs
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-stone-200/70 text-stone-700">
                  CS & Dev
                </span>
              </div>
              <span className="text-[11px] text-stone-500 font-medium tracking-normal hidden sm:block">
                {BRAND_TAGLINE}
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-1"
            role="navigation"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = currentPath === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 ${
                    isActive
                      ? 'text-stone-950 bg-stone-200/60 font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </a>
              );
            })}

            <div className="ml-3 pl-3 border-l border-stone-200">
              <Button
                variant="primary"
                size="sm"
                rightIcon="arrow_forward"
                onClick={(e) => handleLinkClick(e, '/contact')}
              >
                Contact
              </Button>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-stone-700 hover:text-stone-950 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close main menu' : 'Open main menu'}
            >
              <Icon name={mobileMenuOpen ? 'close' : 'menu'} size="lg" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-stone-200 animate-in fade-in duration-150">
            <div className="flex flex-col gap-1 pb-3">
              <div className="px-3 py-1.5 text-xs font-mono text-stone-500 uppercase tracking-wider">
                {BRAND_TAGLINE}
              </div>
              {NAV_ITEMS.map((item) => {
                const isActive = currentPath === item.href;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    className={`px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? 'text-stone-950 bg-stone-200/80 font-semibold'
                        : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
            <div className="pt-2 border-t border-stone-200 px-1">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                rightIcon="arrow_forward"
                onClick={(e) => handleLinkClick(e, '/contact')}
              >
                Get in Touch
              </Button>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
};
