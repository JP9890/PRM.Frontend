import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ManagerRoutingModule } from './manager-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TeamTimesheetsComponent } from './team-timesheets/team-timesheets.component';
import { ManagerProjectsComponent } from './manager-projects/manager-projects.component';
import { AllocateResourceComponent } from './allocate-resource/allocate-resource.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';


@NgModule({
  declarations: [
    DashboardComponent,
    TeamTimesheetsComponent,
    ManagerProjectsComponent,
    AllocateResourceComponent,
    ProjectDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ManagerRoutingModule
  ]
})
export class ManagerModule { }

