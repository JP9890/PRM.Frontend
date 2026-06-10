import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
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

const adminGuard = [AuthGuard, RoleGuard];
const adminData = { roles: ['Admin'] };

const routes: Routes = [
  { path: '', component: AdminPanelComponent, canActivate: adminGuard, data: adminData },
  { path: 'users', component: UserListComponent, canActivate: adminGuard, data: adminData },
  { path: 'users/new', component: UserCreateComponent, canActivate: adminGuard, data: adminData },
  { path: 'users/edit/:id', component: UserEditComponent, canActivate: adminGuard, data: adminData },
  { path: 'employees', component: EmployeeListComponent, canActivate: adminGuard, data: adminData },
  { path: 'employees/edit/:id', component: EmployeeEditComponent, canActivate: adminGuard, data: adminData },
  { path: 'employees/assign-manager', component: AssignManagerComponent, canActivate: adminGuard, data: adminData },
  { path: 'projects', component: ProjectListComponent, canActivate: adminGuard, data: adminData },
  { path: 'projects/new', component: ProjectFormComponent, canActivate: adminGuard, data: adminData },
  { path: 'projects/edit/:id', component: ProjectFormComponent, canActivate: adminGuard, data: adminData },
  { path: 'allocations', component: AllocationListComponent, canActivate: adminGuard, data: adminData },
  { path: 'settings', component: SystemSettingsComponent, canActivate: adminGuard, data: adminData }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
