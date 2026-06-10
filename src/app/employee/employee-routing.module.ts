import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MyAllocationsComponent } from './components/my-allocations/my-allocations.component';
import { MyTimesheetsComponent } from './components/my-timesheets/my-timesheets.component';
import { SubmitTimesheetComponent } from './components/submit-timesheet/submit-timesheet.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'allocations', component: MyAllocationsComponent },
  { path: 'timesheets', component: MyTimesheetsComponent },
  { path: 'submit-timesheet', component: SubmitTimesheetComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule {}
