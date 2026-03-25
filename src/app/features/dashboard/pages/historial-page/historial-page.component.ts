import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FondosService, Transaccion } from '../../../../shared/services/fondos.service';

/**
 * Extensión de Transaccion con campos derivados para la vista.
 * Evita lógica de presentación en el template.
 */
interface HistorialRow extends Transaccion {
  tipoLabel: string;       // Texto legible del tipo de transacción
  tipoBadgeClasses: string; // Clases CSS del badge según tipo
  saldoClass: string;      // Clase CSS del saldo según si subió o bajó
  saldoDiff: number;       // Diferencia de saldo para referencia
}

/**
 * HistorialPageComponent
 *
 * Muestra el registro completo de transacciones del usuario
 * (suscripciones y cancelaciones) en orden cronológico inverso.
 *
 * Aplica transformaciones de presentación en el componente
 * manteniendo el template limpio y declarativo.
 */
@Component({
  selector: 'app-historial-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial-page.component.html',
  styleUrls: ['./historial-page.component.css'],
})
export class HistorialPageComponent {

  /** Stream de transacciones enriquecidas con datos de presentación */
  historial$: Observable<HistorialRow[]>;

  /** true cuando no hay transacciones registradas */
  historialVacio$: Observable<boolean>;

  /** true cuando hay al menos una transacción */
  historialConDatos$: Observable<boolean>;

  constructor(private fondosService: FondosService) {

    // Mapea cada transacción a HistorialRow con campos de presentación
    this.historial$ = this.fondosService.transacciones$.pipe(
      map((items) =>
        items.map((tx) => ({
          ...tx,
          tipoLabel: tx.tipo === 'suscripcion' ? 'Suscripción' : 'Cancelación',
          tipoBadgeClasses:
            tx.tipo === 'suscripcion'
              ? 'tipo-badge tipo-sub'
              : 'tipo-badge tipo-can',
          saldoClass:
            tx.saldoActual > tx.saldoPrevio
              ? 'text-green'
              : tx.saldoActual < tx.saldoPrevio
              ? 'text-red'
              : 'text-muted',
          saldoDiff: tx.saldoActual - tx.saldoPrevio,
        }))
      )
    );

    this.historialVacio$    = this.historial$.pipe(map((items) => items.length === 0));
    this.historialConDatos$ = this.historial$.pipe(map((items) => items.length > 0));
  }

  /** Formatea un valor numérico como moneda COP legible */
  formatoMoneda(valor: number): string {
    return `COP ${valor.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;
  }
}
