export interface Milestone {
  id: number;
  projectId: number;
  sortOrder: number;
  title: string;
  dueDate: string;
  storyPoints: number;
  status: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  managerId: number;
  managerName?: string;
  totalStoryPoints: number;
  completedStoryPoints: number;
  milestones: Milestone[];
}
