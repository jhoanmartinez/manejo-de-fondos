import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

/**
 * SidebarComponent
 *
 * Navegación lateral persistente del dashboard.
 * En pantallas pequeñas se convierte en barra de navegación superior.
 * Usa routerLinkActive para resaltar la ruta activa.
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {}
