import React from 'react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { EXPERIENCE_ENTRIES } from '../../data/experience';

interface ExperiencePageProps {
  onNavigate: (path: string) => void;
}

export const ExperiencePage: React.FC<ExperiencePageProps> = ({ onNavigate }) => {
  return (
    <article className="py-12 sm:py-20 lg:py-24 bg-[#FAFAF9] flex-1 text-stone-900" id="experience-page-root">
      {/* 1. Page Introduction */}
      <section className="pb-16 sm:pb-20 border-b border-stone-200/80" id="experience-intro">
        <Container size="default">
          <div className="max-w-3xl space-y-6">
            {/* Identity Badge */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-xs font-mono text-stone-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Progression & Hands-on Work</span>
            </div>

            <div className="space-y-3">
              <span className="font-mono text-xs font-semibold tracking-wider text-stone-500 uppercase">
                EXPERIENCE & LEARNING
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight text-stone-950 leading-[1.15]">
                Practical experience grounded in real operational systems.
              </h1>
            </div>

            <p className="text-lg sm:text-xl text-stone-700 leading-relaxed max-w-2xl font-normal">
              An authentic record of the environments I have contributed to, the technical problems I worked around, and the foundational disciplines each experience instilled—without exaggerated titles or invented numbers.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                size="md"
                rightIcon="arrow_forward"
                onClick={() => onNavigate('/projects')}
              >
                View Applied Projects
              </Button>
              <Button
                variant="outline"
                size="md"
                leftIcon="mail"
                onClick={() => onNavigate('/contact')}
              >
                Reach Out
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Structured Experience Entries */}
      <section className="py-16 sm:py-20 border-b border-stone-200/80 bg-white" id="experience-entries">
        <Container size="default">
          <div className="space-y-16">
            <div className="flex items-center justify-between pb-6 border-b border-stone-200">
              <div>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-stone-500">
                  CHRONICLE OF PRACTICE
                </span>
                <h2 className="mt-1 text-2xl sm:text-3xl font-bold font-display text-stone-900 tracking-tight">
                  Where I have worked & learned
                </h2>
              </div>
              <span className="text-xs font-mono text-stone-500 hidden sm:inline-block">
                {EXPERIENCE_ENTRIES.length} documented environments
              </span>
            </div>

            <div className="space-y-16">
              {EXPERIENCE_ENTRIES.map((entry, index) => (
                <div
                  key={entry.id}
                  className="p-6 sm:p-10 rounded-2xl border border-stone-200 bg-[#FAFAF9] space-y-8"
                >
                  {/* Entry Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-stone-200">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-stone-400">
                          0{index + 1}
                        </span>
                        <span className="text-stone-300">•</span>
                        <span className="font-mono text-xs font-medium uppercase tracking-wider text-stone-600 bg-stone-100 border border-stone-200/90 px-2.5 py-0.5 rounded">
                          {entry.context}
                        </span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold font-display text-stone-950 tracking-tight">
                        {entry.organization}
                      </h3>
                      <p className="text-sm font-mono text-stone-600">
                        {entry.environment}
                      </p>
                    </div>

                    {/* Focus Area Badges */}
                    <div className="flex flex-wrap gap-1.5 max-w-sm sm:justify-end">
                      {entry.focusAreas.map((area) => (
                        <span
                          key={area}
                          className="px-2.5 py-1 rounded bg-white border border-stone-200 text-stone-700 text-xs font-mono"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Two-Column Detail Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                    {/* Left: What I Worked Around */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-stone-900 font-display font-bold text-base">
                        <Icon name="construction" size="sm" className="text-stone-700" />
                        <span>What I worked around</span>
                      </div>
                      <ul className="space-y-3 text-sm text-stone-700">
                        {entry.workedAround.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-2 shrink-0" />
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Right: What Each Experience Taught Me */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-stone-900 font-display font-bold text-base">
                        <Icon name="psychology" size="sm" className="text-stone-700" />
                        <span>What it taught me</span>
                      </div>
                      <ul className="space-y-3 text-sm text-stone-700">
                        {entry.keyTakeaways.map((takeaway, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <Icon
                              name="check"
                              size="sm"
                              className="text-emerald-600 mt-0.5 shrink-0 text-base"
                            />
                            <span className="leading-relaxed">{takeaway}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Structured Placeholder for Future Specifics */}
                  <div className="pt-4 border-t border-stone-200/70 flex items-center justify-between text-xs font-mono text-stone-500">
                    <span className="flex items-center gap-1.5">
                      <Icon name="info" size="sm" className="text-stone-400" />
                      <span>{entry.optionalNote}</span>
                    </span>
                    <span className="hidden sm:inline-block text-stone-400">
                      Documented with integrity
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Current Direction & Synthesis */}
      <section className="py-16 sm:py-20 border-b border-stone-200/80 bg-[#FAFAF9]" id="experience-synthesis">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-4 space-y-2">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-stone-500">
                SYNTHESIS
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-stone-900 tracking-tight">
                How this shapes my current path
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Connecting physical IT operations and agency web development into full-stack software engineering.
              </p>
            </div>

            <div className="lg:col-span-8 space-y-6 text-base sm:text-lg text-stone-700 leading-relaxed">
              <p>
                Each past experience addressed a specific layer of the computing puzzle. Working at <strong className="font-semibold text-stone-900">BCOS</strong> provided an appreciation for hardware realities, networking, and the challenges non-technical operators face when dealing with machines.
              </p>
              <p>
                The <strong className="font-semibold text-stone-900">agency environment</strong> honed my eye for responsive design, brand fidelity, and the critical importance of clear visual hierarchy and fast rendering.
              </p>
              <p>
                Today, as a <strong className="font-semibold text-stone-900">Computer Science undergraduate at LAUTECH</strong>, I channel both perspectives into building reliable web systems. I know that an application is only as good as its data integrity on the server and its clarity on the user&apos;s screen.
              </p>

              {/* Three-step trajectory card */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-1">
                  <div className="font-mono text-[11px] text-stone-500 uppercase tracking-wider">Foundation</div>
                  <div className="font-bold text-stone-900 text-sm font-display">Systems & Hardware</div>
                  <p className="text-xs text-stone-600 font-sans">Understanding physical environments, cables, and diagnostics.</p>
                </div>
                <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-1">
                  <div className="font-mono text-[11px] text-stone-500 uppercase tracking-wider">Refinement</div>
                  <div className="font-bold text-stone-900 text-sm font-display">Interface & Brand</div>
                  <p className="text-xs text-stone-600 font-sans">Crafting responsive layouts that respect user expectations.</p>
                </div>
                <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-1">
                  <div className="font-mono text-[11px] text-stone-500 uppercase tracking-wider">Present Focus</div>
                  <div className="font-bold text-stone-900 text-sm font-display">Full-Stack Systems</div>
                  <p className="text-xs text-stone-600 font-sans">End-to-end applications with TypeScript, Node, and MongoDB.</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Navigation Call to Action */}
      <section className="py-16 sm:py-20 bg-white" id="experience-cta">
        <Container size="default">
          <div className="p-8 sm:p-12 rounded-2xl bg-[#FAFAF9] border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-xl space-y-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-stone-500">
                CONTINUE EXPLORING
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-stone-900 tracking-tight">
                See how this experience translates to software.
              </h3>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                Explore the applications, architectures, and codebase repositories built with these disciplines.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button
                variant="primary"
                size="lg"
                rightIcon="arrow_forward"
                onClick={() => onNavigate('/projects')}
              >
                Browse Projects
              </Button>
              <Button
                variant="outline"
                size="lg"
                leftIcon="person"
                onClick={() => onNavigate('/about')}
              >
                Read About Philosophy
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </article>
  );
};
