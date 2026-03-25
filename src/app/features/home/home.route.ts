import  { Route } from '@angular/router';

export const HOME_ROUTES: Route[] = [
    {
        path: '',
        loadComponent: () => import('./pages/home-layout/home-layout.component').then(m => m.HomeLayoutComponent)
    }
];