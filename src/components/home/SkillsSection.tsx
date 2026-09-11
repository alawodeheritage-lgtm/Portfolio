import React from 'react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Icon } from '../ui/Icon';
import { CORE_TECH_GROUPS, CURRENTLY_EXPLORING } from '../../data/skills';

export const SkillsSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 border-b border-stone-200/80 bg-white" id="skills-and-learning">
      <Container size="default">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-12 border-b border-stone-200">
          <SectionHeading
            tag="TOOLKIT & LEARNING"
            title="Technologies & Ongoing Exploration"
            description="Software development is a continuous discipline. Below are the tools I actively build with, alongside specific areas I am currently deepening."
          />
          <div className="shrink-0">
            <span className="text-xs font-mono text-stone-600 bg-stone-100 border border-stone-200 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Learning in Public
            </span>
          </div>
        </div>

        {/* Two-Column Editorial Layout */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Applied Technologies (7 cols) */}
          <div className="lg:col-span-7 space-y-10">
            <div>
              <h3 className="text-lg font-bold font-display text-stone-900 tracking-tight">
                Applied Technologies
              </h3>
              <p className="mt-1 text-sm text-stone-600">
                Technologies utilized across practical projects such as ASOCOMMS, FinTrack, and SwiftTask.
              </p>
            </div>

            <div className="space-y-8">
              {CORE_TECH_GROUPS.map((group) => (
                <div key={group.category} className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                    <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-stone-700">
                      {group.category}
                    </h4>
                    <span className="text-[11px] font-mono text-stone-400">
                      {group.items.length} {group.items.length === 1 ? 'tool' : 'tools'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {group.items.map((item) => (
                      <div
                        key={item.name}
                        className="p-3.5 rounded-lg border border-stone-200/90 bg-[#FAFAF9] hover:bg-stone-50 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-sm font-semibold text-stone-900">
                            {item.name}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                        </div>
                        <p className="mt-1.5 text-xs text-stone-600 leading-relaxed">
                          {item.focus}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Currently Exploring & Deepening (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h3 className="text-lg font-bold font-display text-stone-900 tracking-tight">
                Currently Exploring
              </h3>
              <p className="mt-1 text-sm text-stone-600">
                Areas of deliberate practice as a Computer Science student and software developer.
              </p>
            </div>

            {/* Structured Learning Stream */}
            <div className="space-y-4">
              {CURRENTLY_EXPLORING.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-stone-200 bg-[#FAFAF9] space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
                      {item.area}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-stone-200/80 text-stone-800">
                      <Icon name="sync" size="sm" className="text-[12px] text-stone-600" />
                      {item.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-stone-900 font-display">
                    {item.topic}
                  </h4>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {item.note}
                  </p>
                </div>
              ))}
            </div>

            {/* Engineering Mindset Card */}
            <div className="p-6 rounded-xl border border-stone-300 bg-stone-50 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-stone-800 font-semibold uppercase tracking-wider">
                <Icon name="auto_stories" size="sm" className="text-stone-700" />
                <span>Growth Philosophy</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                Rather than treating tools as badges of static expertise, I focus on understanding underlying programming concepts, writing clean TypeScript, and building reliable systems end-to-end.
              </p>
              <div className="pt-2 border-t border-stone-200/80 flex items-center justify-between text-[11px] font-mono text-stone-500">
                <span>Disciplined learning</span>
                <span>•</span>
                <span>Practical application</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
