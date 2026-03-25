import { Route } from '@angular/router';

export const DASHBOARD_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/dashboard-layout/dashboard-layout.component').then(
        (m) => m.DashboardLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/fondos-page/fondos-page.component').then(
            (m) => m.FondosPageComponent
          ),
        pathMatch: 'full'
      },
      {
        path: 'historial',
        loadComponent: () =>
          import('./pages/historial-page/historial-page.component').then(
            (m) => m.HistorialPageComponent
          )
      }
    ]
  }
];