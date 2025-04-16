import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { AuthGuard } from './core/auth.guard';
import { TicketsPageComponent } from './features/tickets-page/tickets-page.component';
import { SettingComponent } from './features/settings/setting/setting.component';
import { LayoutComponent } from './layout/layout/layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AgentsComponent } from './features/agents/agents.component';

export const routes: Routes = [
  // Public routes
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // Protected routes inside layout
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'tickets',
        component: TicketsPageComponent,
      },
      {
        path: 'agents',
        component: AgentsComponent,
      },
      {
        path: 'profile',
        component: SettingComponent,
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
