import React from 'react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <article className="py-12 sm:py-20 lg:py-24 bg-[#FAFAF9] flex-1 text-stone-900" id="about-page-root">
      {/* 1. Page Introduction / Hero */}
      <section className="pb-16 sm:pb-20 border-b border-stone-200/80" id="about-intro">
        <Container size="default">
          <div className="max-w-3xl space-y-6">
            {/* Identity Badge */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-xs font-mono text-stone-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Software Developer • Leader • Following Christ</span>
            </div>

            <div className="space-y-3">
              <span className="font-mono text-xs font-semibold tracking-wider text-stone-500 uppercase">
                ABOUT & PHILOSOPHY
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight text-stone-950 leading-[1.15]">
                Building purposeful software with curiosity, discipline, and responsibility.
              </h1>
            </div>

            <p className="text-lg sm:text-xl text-stone-700 leading-relaxed max-w-2xl font-normal">
              I am a Computer Science student at Ladoke Akintola University of Technology (LAUTECH) and a software developer who builds practical systems while continuously learning in public.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                size="md"
                rightIcon="arrow_forward"
                onClick={() => onNavigate('/projects')}
              >
                View Selected Work
              </Button>
              <Button
                variant="outline"
                size="md"
                leftIcon="mail"
                onClick={() => onNavigate('/contact')}
              >
                Get in Touch
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Who I Am: Academic & Practical Grounding */}
      <section className="py-16 sm:py-20 border-b border-stone-200/80 bg-white" id="who-i-am">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-4">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-stone-500">
                01 / BACKGROUND
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-bold font-display text-stone-900 tracking-tight">
                Who I am
              </h2>
              <p className="mt-3 text-sm text-stone-600 leading-relaxed">
                Foundations in computer science, hands-on operational training, and agency web development.
              </p>
            </div>

            <div className="lg:col-span-8 space-y-6 text-base sm:text-lg text-stone-700 leading-relaxed">
              <p>
                My background centers on computing and practical development. As a Computer Science undergraduate at <strong className="font-semibold text-stone-900">Ladoke Akintola University of Technology (LAUTECH)</strong>, my academic training reinforces the theoretical principles behind algorithms, systems architecture, and structured problem-solving.
              </p>
              <p>
                Beyond lecture halls, my development perspective has been shaped by hands-on operational environments. During my <strong className="font-semibold text-stone-900">SIWES internship at the Broadcasting Corporation of Oyo State (BCOS)</strong> within the ICT department, I was immersed in enterprise hardware maintenance, network troubleshooting, and day-to-day IT support workflows. That experience taught me early on that software does not exist in isolation—it sits on real physical hardware, serves busy people, and must remain dependable under pressure.
              </p>
              <p>
                I have also worked in a <strong className="font-semibold text-stone-900">web development and branding agency</strong> environment. There, the focus was on translating organizational needs into clean, structured digital solutions with strict attention to branding consistency, design alignment, and responsive user experiences.
              </p>

              {/* Experience Context Pill Grid */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-1">
                  <div className="text-stone-500 uppercase text-[10px] tracking-wider">Education</div>
                  <div className="font-semibold text-stone-900 text-sm">LAUTECH</div>
                  <div className="text-stone-600 text-xs font-sans">Computer Science Student</div>
                </div>
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-1">
                  <div className="text-stone-500 uppercase text-[10px] tracking-wider">IT Operations</div>
                  <div className="font-semibold text-stone-900 text-sm">BCOS ICT Dept</div>
                  <div className="text-stone-600 text-xs font-sans">SIWES / Internship</div>
                </div>
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-1">
                  <div className="text-stone-500 uppercase text-[10px] tracking-wider">Industry</div>
                  <div className="font-semibold text-stone-900 text-sm">Web & Agency</div>
                  <div className="text-stone-600 text-xs font-sans">Branding & Development</div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. How I Approach Building Software */}
      <section className="py-16 sm:py-20 border-b border-stone-200/80 bg-[#FAFAF9]" id="software-philosophy">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-4">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-stone-500">
                02 / CRAFT & METHOD
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-bold font-display text-stone-900 tracking-tight">
                How I approach building software
              </h2>
              <p className="mt-3 text-sm text-stone-600 leading-relaxed">
                Prioritizing purpose, maintainability, and honest craftsmanship over hype.
              </p>
            </div>

            <div className="lg:col-span-8 space-y-8">
              <p className="text-base sm:text-lg text-stone-700 leading-relaxed">
                I do not treat software development as an exercise in adding as many libraries as possible. Good software is about clarity: knowing why a component exists, how data flows through it, and ensuring another developer (or myself months later) can read and maintain it.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl border border-stone-200 bg-white space-y-2">
                  <div className="flex items-center gap-2 text-stone-900 font-bold font-display text-base">
                    <Icon name="architecture" size="sm" className="text-stone-700" />
                    <span>Structured Architecture</span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Clear separation between views, controller logic, and data schemas. Projects like ASOCOMMS reflect this through typed models, disciplined REST endpoints, and decoupled state management.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-stone-200 bg-white space-y-2">
                  <div className="flex items-center gap-2 text-stone-900 font-bold font-display text-base">
                    <Icon name="check_circle" size="sm" className="text-stone-700" />
                    <span>Real Utility Over Novelty</span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Building tools that solve identifiable everyday problems—whether tracking repair inventory lifecycles or categorizing personal cash flows—rather than shallow demo scripts.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-stone-200 bg-white space-y-2">
                  <div className="flex items-center gap-2 text-stone-900 font-bold font-display text-base">
                    <Icon name="code" size="sm" className="text-stone-700" />
                    <span>Strict Type Discipline</span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Leveraging TypeScript across client components and server contracts to prevent runtime ambiguities, clarify interfaces, and ensure dependable refactoring.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-stone-200 bg-white space-y-2">
                  <div className="flex items-center gap-2 text-stone-900 font-bold font-display text-base">
                    <Icon name="visibility" size="sm" className="text-stone-700" />
                    <span>Visual Restraint</span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Clean, high-contrast layouts with balanced whitespace. UI should elevate the content and workflow, never distract the user with unnecessary visual noise.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Learning & Growth: The Student & Developer Journey */}
      <section className="py-16 sm:py-20 border-b border-stone-200/80 bg-white" id="learning-growth">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-4">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-stone-500">
                03 / LEARNING JOURNEY
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-bold font-display text-stone-900 tracking-tight">
                Curiosity & continuous growth
              </h2>
              <p className="mt-3 text-sm text-stone-600 leading-relaxed">
                Approaching technology with intellectual humility and disciplined practice.
              </p>
            </div>

            <div className="lg:col-span-8 space-y-6 text-base sm:text-lg text-stone-700 leading-relaxed">
              <p>
                Computing evolves quickly, but core principles endure. My growth strategy is grounded in curiosity—asking not just <em>how</em> a framework functions on the surface, but <em>why</em> it is architected that way and what trade-offs it introduces.
              </p>
              <p>
                I believe strongly in <strong className="font-semibold text-stone-900">learning in public</strong>: openly acknowledging what I am studying, testing ideas in real code, and documenting both breakthroughs and mistakes. Whether it is mastering modern server components in Next.js, refining Express routing pipelines, or tightening MongoDB indexes, each project is a stepping stone toward deeper engineering competence.
              </p>
              <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-600 space-y-2 font-mono">
                <div className="text-stone-900 font-semibold flex items-center gap-2">
                  <Icon name="terminal" size="sm" className="text-stone-700" />
                  <span>The Ongoing Standard</span>
                </div>
                <p className="font-sans text-xs sm:text-sm text-stone-700 leading-relaxed">
                  No artificial percentages or exaggerated claims of mastery. Just steady, iterative practice, reading documentation, writing testable code, and respecting the craftsmanship of computing.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. Leadership & Values: Responsibility, Integrity, Faith */}
      <section className="py-16 sm:py-20 border-b border-stone-200/80 bg-[#FAFAF9]" id="leadership-values">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-4">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-stone-500">
                04 / VALUES & MINDSET
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-bold font-display text-stone-900 tracking-tight">
                Leadership & values
              </h2>
              <p className="mt-3 text-sm text-stone-600 leading-relaxed">
                Leadership as taking responsibility, serving others, and upholding quiet integrity.
              </p>
            </div>

            <div className="lg:col-span-8 space-y-8">
              <div className="space-y-4 text-base sm:text-lg text-stone-700 leading-relaxed">
                <p>
                  To me, leadership is not a collection of ceremonial titles or public acclaim. It is a way of thinking: noticing what needs to be done, taking initiative without waiting for permission, and following through on commitments with quiet excellence.
                </p>
                <p>
                  Whether working in a team or collaborating on a project, genuine leadership means creating clarity where there is confusion, lifting burdens off teammates, and taking personal responsibility when things go wrong rather than pointing fingers.
                </p>
              </div>

              {/* Core Values Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl border border-stone-200 bg-white space-y-2">
                  <span className="font-mono text-xs text-stone-500 uppercase tracking-wider">Pillar 01</span>
                  <h3 className="text-base font-bold font-display text-stone-900">Initiative & Ownership</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Seeing a challenge through to completion. Taking responsibility for outcomes rather than merely executing minimal instructions.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-stone-200 bg-white space-y-2">
                  <span className="font-mono text-xs text-stone-500 uppercase tracking-wider">Pillar 02</span>
                  <h3 className="text-base font-bold font-display text-stone-900">Integrity & Diligence</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Doing the right work even when nobody is watching. Writing clean code, communicating honestly, and respecting other people&apos;s time.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-stone-200 bg-white space-y-2">
                  <span className="font-mono text-xs text-stone-500 uppercase tracking-wider">Pillar 03</span>
                  <h3 className="text-base font-bold font-display text-stone-900">Following Christ</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    My faith provides the moral compass for how I conduct myself: approaching work with humility, viewing skill as stewardship, and seeking to serve rather than be served.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. Current Direction */}
      <section className="py-16 sm:py-20 border-b border-stone-200/80 bg-white" id="current-direction">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-4">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-stone-500">
                05 / HORIZON
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-bold font-display text-stone-900 tracking-tight">
                Current direction
              </h2>
              <p className="mt-3 text-sm text-stone-600 leading-relaxed">
                What I am actively building, exploring, and preparing for.
              </p>
            </div>

            <div className="lg:col-span-8 space-y-6 text-base sm:text-lg text-stone-700 leading-relaxed">
              <p>
                As I continue my computer science program at LAUTECH, my near-term focus is deepening my full-stack engineering abilities:
              </p>
              <ul className="space-y-3 text-sm sm:text-base text-stone-700">
                <li className="flex items-start gap-3">
                  <Icon name="arrow_right" size="sm" className="text-stone-900 mt-1 shrink-0" />
                  <span>
                    <strong className="font-semibold text-stone-900">Advancing Full-Stack Systems:</strong> Expanding beyond basic CRUD applications to design complex operational systems, robust data schemas, and role-based permissions (as initiated with ASOCOMMS).
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="arrow_right" size="sm" className="text-stone-900 mt-1 shrink-0" />
                  <span>
                    <strong className="font-semibold text-stone-900">Modern Frontend Architectures:</strong> Exploring Next.js patterns, server rendering strategies, and performance characteristics for data-intensive web applications.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="arrow_right" size="sm" className="text-stone-900 mt-1 shrink-0" />
                  <span>
                    <strong className="font-semibold text-stone-900">Engineering Collaboration:</strong> Seeking engineering internship opportunities and team projects where I can contribute actively, absorb mentorship, and add tangible value.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* 7. Bottom Call to Action */}
      <section className="py-16 sm:py-20 bg-[#FAFAF9]" id="about-cta">
        <Container size="default">
          <div className="p-8 sm:p-12 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-xl space-y-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-stone-500">
                LET&apos;S CONNECT
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-stone-900 tracking-tight">
                Interested in working together or discussing software?
              </h3>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                Whether you have an inquiry, feedback on my projects, or an engineering opportunity, I welcome the conversation.
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
                leftIcon="mail"
                onClick={() => onNavigate('/contact')}
              >
                Reach Out Directly
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </article>
  );
};
