import { Routes } from '@angular/router';
import { HOME_ROUTES } from './features/home/home.route';
import { DASHBOARD_ROUTES } from './features/dashboard/dashboard.route';

export const routes: Routes = [
    {
        path: '',
        children: HOME_ROUTES
    },
    {
        path: 'dashboard',
        children: DASHBOARD_ROUTES
    }
];
