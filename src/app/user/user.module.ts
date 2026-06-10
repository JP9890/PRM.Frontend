import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { UserRoutingModule } from './user-routing.module';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserCreateComponent } from './components/user-create/user-create.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeEditComponent } from './components/employee-edit/employee-edit.component';
import { AssignManagerComponent } from './components/assign-manager/assign-manager.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectFormComponent } from './components/project-form/project-form.component';
import { AllocationListComponent } from './components/allocation-list/allocation-list.component';
import { SystemSettingsComponent } from './components/system-settings/system-settings.component';

@NgModule({
  declarations: [
    AdminPanelComponent,
    UserListComponent,
    UserCreateComponent,
    UserEditComponent,
    EmployeeListComponent,
    EmployeeEditComponent,
    AssignManagerComponent,
    ProjectListComponent,
    ProjectFormComponent,
    AllocationListComponent,
    SystemSettingsComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class UserModule { }
