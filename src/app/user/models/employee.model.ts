export interface EmployeeSummary {
  id: number;
  fullName: string;
  department: string;
  status: string;
  totalUtilization: number;
}

export interface EmployeeSkill {
  id: number;
  skillName: string;
  category: string;
  proficiency: string;
}

export interface ActiveAllocation {
  id: number;
  projectName: string;
  utilizationPercent: number;
  fromDate: string;
  toDate: string;
}

export interface Employee {
  id: number;
  fullName: string;
  department: string;
  status: string;
  isActive: boolean;
  userId?: number;
  managerId?: number;
  managerName?: string;
  totalUtilization: number;
  skills: EmployeeSkill[];
  activeAllocations: ActiveAllocation[];
}
