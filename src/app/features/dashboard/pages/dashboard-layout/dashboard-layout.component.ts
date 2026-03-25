import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar.component';

/**
 * DashboardLayoutComponent
 *
 * Shell del dashboard. Define la estructura de dos columnas:
 * sidebar de navegación + área de contenido con router-outlet.
 * Todos los sub-componentes del dashboard se renderizan dentro
 * del router-outlet según la ruta activa.
 */
@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterModule, SidebarComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css',
})
export class DashboardLayoutComponent {}
