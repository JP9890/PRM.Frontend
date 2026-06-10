export interface AllocationDto {
  id: number;
  employeeId: number;
  projectId: number;
  employeeName: string;
  projectName: string;
  utilizationPercent: number;
  fromDate: string;
  toDate: string;
}

export interface TimesheetEntry {
  id?: number;
  projectId: number;
  projectName?: string;
  hoursWorked: number;
  activityTags?: string;
}

export interface Timesheet {
  id: number;
  employeeId: number;
  employeeName: string;
  weekStartDate: string;
  status: string;
  totalHours: number;
  entries: TimesheetEntry[];
}

export interface SubmitTimesheetDto {
  weekStartDate: string;
  entries: SubmitEntryDto[];
}

export interface SubmitEntryDto {
  projectId: number;
  hoursWorked: number;
  activityTags: string;
}
