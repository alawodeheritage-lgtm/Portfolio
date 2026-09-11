export interface TechItem {
  name: string;
  focus: string;
  context?: string;
}

export interface TechGroup {
  category: string;
  description: string;
  items: TechItem[];
}

export interface LearningFocus {
  area: string;
  topic: string;
  note: string;
  status: 'In Progress' | 'Deepening' | 'Exploring';
}
