import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EmployeeRoutingModule } from './employee-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MyAllocationsComponent } from './components/my-allocations/my-allocations.component';
import { MyTimesheetsComponent } from './components/my-timesheets/my-timesheets.component';
import { SubmitTimesheetComponent } from './components/submit-timesheet/submit-timesheet.component';

@NgModule({
  declarations: [
    DashboardComponent,
    MyAllocationsComponent,
    MyTimesheetsComponent,
    SubmitTimesheetComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EmployeeRoutingModule
  ]
})
export class EmployeeModule {}
