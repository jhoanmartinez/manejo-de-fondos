import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

/**
 * HomeLayoutComponent
 *
 * Página de bienvenida de la aplicación.
 * Presenta el contexto del sistema (Manejo de Fondos BTG),
 * el saldo inicial del usuario y acceso directo al dashboard.
 */
@Component({
  selector: 'app-home-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home-layout.component.html',
  styleUrl: './home-layout.component.css',
})
export class HomeLayoutComponent {}
