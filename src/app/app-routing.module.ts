import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { AuthGuard } from './auth/guards/auth.guard';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule), canActivate: [AuthGuard], data: { expectedRoles: ['Admin'] } },
  { path: 'employee', loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule), canActivate: [AuthGuard], data: { expectedRoles: ['Employee'] } },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
