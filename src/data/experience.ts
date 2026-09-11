export interface ExperienceItem {
  id: string;
  organization: string;
  context: string;
  environment: string;
  focusAreas: string[];
  workedAround: string[];
  keyTakeaways: string[];
  optionalNote?: string;
}

export const EXPERIENCE_ENTRIES: ExperienceItem[] = [
  {
    id: 'bcos-ict',
    organization: 'Broadcasting Corporation of Oyo State (BCOS)',
    context: 'SIWES / Student Internship',
    environment: 'Information & Communications Technology (ICT) Department',
    focusAreas: [
      'Enterprise hardware maintenance',
      'Local network troubleshooting',
      'Internal staff technical support',
      'Systems reliability in a broadcast environment',
    ],
    workedAround: [
      'Workstation diagnostics and operating system maintenance',
      'Local network cabling, connectivity checks, and peripheral configurations',
      'Responding to day-to-day hardware and software issues across operational departments',
    ],
    keyTakeaways: [
      'Software always operates on real, physical infrastructure: understanding hardware and networks makes you a more grounded developer.',
      'Clear, patient communication is essential when diagnosing technical issues for non-technical users.',
      'High-uptime environments require systematic troubleshooting rather than guesswork.',
    ],
    optionalNote: 'Dates, specific department rotations, or additional milestones can be documented here.',
  },
  {
    id: 'agency-experience',
    organization: 'Web Development & Branding Agency',
    context: 'Agency Practice & Web Development',
    environment: 'Digital Agency Environment',
    focusAreas: [
      'Responsive web layouts',
      'Brand identity alignment',
      'Client requirement interpretation',
      'Frontend presentation consistency',
    ],
    workedAround: [
      'Structuring clean website layouts aligned with organizational branding guidelines',
      'Ensuring responsive behavior and typography hierarchy across screen sizes',
      'Iterating on interface details based on client feedback and design requirements',
    ],
    keyTakeaways: [
      'Visual alignment, spacing, and typography choices directly influence how an organization is perceived.',
      'Developing web interfaces requires balancing aesthetic polish with code clarity and fast load times.',
      'Early clarification of project requirements prevents costly rework during implementation.',
    ],
    optionalNote: 'Agency name, client categories, or specific live projects can be appended here.',
  },
];
