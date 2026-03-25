import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FondosService, MedioNotificacion } from '../../../../shared/services/fondos.service';

/**
 * FondosPageComponent
 *
 * Página principal del dashboard. Muestra:
 * - Lista de fondos disponibles con estado de suscripción
 * - Formulario reactivo para suscribirse a un fondo
 * - Saldo actualizado del usuario
 * - Skeleton loader mientras se obtienen los datos
 * - Mensajes de éxito y error tras cada operación
 */
@Component({
  selector: 'app-fondos-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './fondos-page.component.html',
  styleUrl: './fondos-page.component.css',
})
export class FondosPageComponent implements OnInit {

  // --- Observables del servicio expuestos al template ---
  get fondos$()       { return this.fondosService.fondos$; }
  get saldo$()        { return this.fondosService.saldo$; }
  get suscripciones$(){ return this.fondosService.suscripciones$; }
  get loading$()      { return this.fondosService.loading$; }
  get error$()        { return this.fondosService.error$; }

  /** Filas fantasma para el skeleton loader (una por fondo esperado) */
  skeletonRows = Array(5);

  /** Mensajes de feedback al usuario */
  mensajeError = '';
  mensajeOk    = '';

  /** Formulario reactivo de suscripción */
  form!: FormGroup;

  constructor(
    private fondosService: FondosService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Inicializa el formulario con validaciones
    this.form = this.fb.group({
      fondoId:           [null as number | null, Validators.required],
      monto:             [null as number | null, [Validators.required, Validators.min(1)]],
      medioNotificacion: ['email' as MedioNotificacion, Validators.required],
    });

    // Carga los fondos disponibles (simula llamada a API)
    this.fondosService.loadFondos();
  }

  /**
   * Intenta suscribir al usuario al fondo seleccionado.
   * Valida el formulario antes de llamar al servicio.
   * Muestra feedback según el resultado.
   */
  suscribir(): void {
    // Limpiar mensajes previos
    this.mensajeError = '';
    this.mensajeOk    = '';

    if (this.form.invalid) {
      this.mensajeError = 'Complete todos los campos del formulario.';
      return;
    }

    const { fondoId, monto, medioNotificacion } = this.form.value;
    const resultado = this.fondosService.suscribir(
      Number(fondoId),
      Number(monto),
      medioNotificacion as MedioNotificacion
    );

    if (resultado.success) {
      this.mensajeOk = resultado.message;
      // Limpiar solo el monto; mantiene el fondo y canal seleccionados
      this.form.patchValue({ monto: null });
    } else {
      this.mensajeError = resultado.message;
    }
  }

  /**
   * Pre-rellena el formulario con los datos del fondo seleccionado
   * para facilitar la suscripción al usuario.
   */
  seleccionar(fondoId: number, montoMinimo: number): void {
    this.mensajeError = '';
    this.mensajeOk    = '';
    this.form.patchValue({ fondoId, monto: montoMinimo });
  }

  /**
   * Cancela la suscripción activa en un fondo.
   * Muestra el monto reintegrado en el mensaje de confirmación.
   */
  cancelar(fondoId: number): void {
    this.mensajeError = '';
    this.mensajeOk    = '';
    const resultado = this.fondosService.cancelar(fondoId);

    if (resultado.success) {
      this.mensajeOk = resultado.message;
    } else {
      this.mensajeError = resultado.message;
    }
  }

  /** Verifica si el usuario tiene una suscripción activa en un fondo dado */
  tieneSuscripcion(suscripciones: Record<number, number>, fondoId: number): boolean {
    return (suscripciones[fondoId] || 0) > 0;
  }
}
