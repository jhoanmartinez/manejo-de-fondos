import { Injectable } from '@angular/core';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';

/** Categorías de fondo disponibles según especificación BTG */
export type CategoriaFondo = 'FPV' | 'FIC';

/** Canales de notificación soportados */
export type MedioNotificacion = 'email' | 'sms';

/** Estructura de un fondo de inversión */
export interface Fondo {
  id: number;
  nombre: string;
  montoMinimo: number;
  categoria: CategoriaFondo;
}

/** Estructura de una transacción (suscripción o cancelación) */
export interface Transaccion {
  id: string;
  fecha: string;
  tipo: 'suscripcion' | 'cancelacion';
  fondoId: number;
  fondoNombre: string;
  monto: number;
  medioNotificacion: MedioNotificacion;
  saldoPrevio: number;
  saldoActual: number;
  mensaje: string;
}

/**
 * Snapshot del estado del usuario que se persiste en localStorage.
 * Solo se guarda lo que puede cambiar — el catálogo de fondos
 * siempre viene del mock (fuente de verdad fija).
 */
interface EstadoPersistido {
  saldo: number;
  suscripciones: Record<number, number>;
  transacciones: Transaccion[];
}

/** Claves usadas en localStorage */
const LS_KEY = 'btg_fondos_estado';

/** Saldo inicial del usuario según especificación BTG */
const SALDO_INICIAL = 500000;

/**
 * FondosService
 *
 * Servicio central de la aplicación. Gestiona el estado reactivo de:
 * - Fondos disponibles (mock de API REST con delay simulado)
 * - Saldo del usuario (inicial COP $500.000)
 * - Suscripciones activas por fondo
 * - Historial de transacciones
 * - Estados de carga y error
 *
 * El estado del usuario (saldo, suscripciones, historial) se persiste
 * automáticamente en localStorage después de cada operación, y se
 * restaura al iniciar el servicio. Así los datos sobreviven a un refresh.
 *
 * El catálogo de fondos NO se persiste porque es una fuente de verdad
 * fija (simula una API) y siempre se carga desde el mock.
 */
@Injectable({
  providedIn: 'root'
})
export class FondosService {

  /** Catálogo de fondos disponibles — simula respuesta de API REST */
  private readonly initialFondos: Fondo[] = [
    { id: 1, nombre: 'FPV_BTG_PACTUAL_RECAUDADORA', montoMinimo: 75000,  categoria: 'FPV' },
    { id: 2, nombre: 'FPV_BTG_PACTUAL_ECOPETROL',   montoMinimo: 125000, categoria: 'FPV' },
    { id: 3, nombre: 'DEUDAPRIVADA',                 montoMinimo: 50000,  categoria: 'FIC' },
    { id: 4, nombre: 'FDO-ACCIONES',                 montoMinimo: 250000, categoria: 'FIC' },
    { id: 5, nombre: 'FPV_BTG_PACTUAL_DINAMICA',     montoMinimo: 100000, categoria: 'FPV' },
  ];

  // --- BehaviorSubjects inicializados desde localStorage (o valores por defecto) ---
  private fondosSubject        = new BehaviorSubject<Fondo[]>([]);
  private saldoSubject         = new BehaviorSubject<number>(this.cargarEstado().saldo);
  private suscripcionesSubject = new BehaviorSubject<Record<number, number>>(this.cargarEstado().suscripciones);
  private transaccionesSubject = new BehaviorSubject<Transaccion[]>(this.cargarEstado().transacciones);
  private loadingSubject       = new BehaviorSubject<boolean>(false);
  private errorSubject         = new BehaviorSubject<string | null>(null);

  // --- Observables públicos que consumen los componentes ---
  fondos$        = this.fondosSubject.asObservable();
  saldo$         = this.saldoSubject.asObservable();
  suscripciones$ = this.suscripcionesSubject.asObservable();
  transacciones$ = this.transaccionesSubject.asObservable();
  loading$       = this.loadingSubject.asObservable();
  error$         = this.errorSubject.asObservable();

  // ---------------------------------------------------------------------------
  // PERSISTENCIA — localStorage
  // ---------------------------------------------------------------------------

  /**
   * Lee el estado guardado en localStorage.
   * Si no existe o está corrupto, retorna los valores por defecto.
   * De esta forma el primer uso (sin datos previos) funciona igual que antes.
   */
  private cargarEstado(): EstadoPersistido {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return this.estadoPorDefecto();

      const parsed = JSON.parse(raw) as EstadoPersistido;

      // Validación mínima: verifica que los campos requeridos existan
      const esValido =
        typeof parsed.saldo === 'number' &&
        typeof parsed.suscripciones === 'object' &&
        Array.isArray(parsed.transacciones);

      return esValido ? parsed : this.estadoPorDefecto();
    } catch {
      // JSON malformado u otro error — resetea al estado inicial
      return this.estadoPorDefecto();
    }
  }

  /** Valores iniciales cuando no hay datos guardados */
  private estadoPorDefecto(): EstadoPersistido {
    return {
      saldo: SALDO_INICIAL,
      suscripciones: {},
      transacciones: [],
    };
  }

  /**
   * Persiste el estado actual en localStorage.
   * Se llama automáticamente después de cada operación que modifica el estado
   * (suscribir, cancelar), manteniendo localStorage siempre sincronizado.
   */
  private guardarEstado(): void {
    const estado: EstadoPersistido = {
      saldo:         this.saldoSubject.getValue(),
      suscripciones: this.suscripcionesSubject.getValue(),
      transacciones: this.transaccionesSubject.getValue(),
    };
    localStorage.setItem(LS_KEY, JSON.stringify(estado));
  }

  // ---------------------------------------------------------------------------
  // API PÚBLICA
  // ---------------------------------------------------------------------------

  /**
   * Carga el catálogo de fondos simulando una llamada HTTP con delay.
   * Los fondos siempre vienen del mock — no se persisten en localStorage.
   * Activa el estado de carga y maneja errores apropiadamente.
   */
  loadFondos(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    of(this.initialFondos)
      .pipe(
        delay(600), // Simula latencia de red
        tap((fondos) => this.fondosSubject.next(fondos)),
        catchError((err) => {
          this.errorSubject.next('No se pudo cargar los fondos. Intente de nuevo.');
          this.loadingSubject.next(false);
          return throwError(() => err);
        })
      )
      .subscribe({
        next: () => this.loadingSubject.next(false),
        error: () => this.loadingSubject.next(false),
      });
  }

  /**
   * Suscribe al usuario a un fondo de inversión.
   *
   * Validaciones:
   * - El fondo debe existir en el catálogo
   * - El monto debe ser mayor o igual al mínimo del fondo
   * - El saldo disponible debe ser suficiente para cubrir el monto
   *
   * Si la suscripción es exitosa, descuenta el monto del saldo,
   * registra la transacción en el historial y persiste el estado.
   */
  suscribir(
    fondoId: number,
    monto: number,
    medioNotificacion: MedioNotificacion
  ): { success: boolean; message: string } {

    const fondo = this.fondosSubject.getValue().find((f) => f.id === fondoId);
    if (!fondo) {
      return { success: false, message: 'Fondo no encontrado.' };
    }

    // Validación: monto mínimo requerido por el fondo
    if (monto < fondo.montoMinimo) {
      return {
        success: false,
        message: `El monto mínimo para ${fondo.nombre} es COP ${fondo.montoMinimo.toLocaleString('es-CO')}.`,
      };
    }

    // Validación: saldo suficiente del usuario
    const saldoActual = this.saldoSubject.getValue();
    if (saldoActual < monto) {
      return {
        success: false,
        message: `Saldo insuficiente. Disponible: COP ${saldoActual.toLocaleString('es-CO')}.`,
      };
    }

    // Actualizar suscripciones (acumula si ya existe una en ese fondo)
    const suscripciones = { ...this.suscripcionesSubject.getValue() };
    suscripciones[fondoId] = (suscripciones[fondoId] || 0) + monto;
    this.suscripcionesSubject.next(suscripciones);

    // Descontar monto del saldo
    const nuevoSaldo = saldoActual - monto;
    this.saldoSubject.next(nuevoSaldo);

    // Registrar transacción en el historial
    this.pushTransaccion({
      id: `${Date.now()}-${Math.random()}`,
      fecha: new Date().toISOString(),
      tipo: 'suscripcion',
      fondoId: fondo.id,
      fondoNombre: fondo.nombre,
      monto,
      medioNotificacion,
      saldoPrevio: saldoActual,
      saldoActual: nuevoSaldo,
      mensaje: `Suscripción exitosa a ${fondo.nombre}`,
    });

    // Persistir el nuevo estado en localStorage
    this.guardarEstado();

    return { success: true, message: `Suscripción exitosa a ${fondo.nombre}` };
  }

  /**
   * Cancela la participación del usuario en un fondo.
   *
   * Devuelve el monto invertido al saldo disponible,
   * registra la cancelación en el historial y persiste el estado.
   */
  cancelar(fondoId: number): { success: boolean; message: string } {

    const fondo = this.fondosSubject.getValue().find((f) => f.id === fondoId);
    if (!fondo) {
      return { success: false, message: 'Fondo no encontrado.' };
    }

    const suscripciones = { ...this.suscripcionesSubject.getValue() };
    const montoSuscrito = suscripciones[fondoId] || 0;

    if (montoSuscrito <= 0) {
      return { success: false, message: `No tiene suscripción activa en ${fondo.nombre}.` };
    }

    // Devolver monto al saldo del usuario
    const saldoPrevio = this.saldoSubject.getValue();
    const nuevoSaldo = saldoPrevio + montoSuscrito;
    this.saldoSubject.next(nuevoSaldo);

    // Eliminar suscripción del registro
    delete suscripciones[fondoId];
    this.suscripcionesSubject.next(suscripciones);

    // Registrar cancelación en historial
    this.pushTransaccion({
      id: `${Date.now()}-${Math.random()}`,
      fecha: new Date().toISOString(),
      tipo: 'cancelacion',
      fondoId: fondo.id,
      fondoNombre: fondo.nombre,
      monto: montoSuscrito,
      medioNotificacion: 'email',
      saldoPrevio,
      saldoActual: nuevoSaldo,
      mensaje: `Cancelación de ${fondo.nombre} — COP ${montoSuscrito.toLocaleString('es-CO')} reintegrado`,
    });

    // Persistir el nuevo estado en localStorage
    this.guardarEstado();

    return {
      success: true,
      message: `Cancelación exitosa. COP ${montoSuscrito.toLocaleString('es-CO')} reintegrado a tu saldo.`,
    };
  }

  /** Agrega una nueva transacción al inicio del historial (orden cronológico inverso) */
  private pushTransaccion(transaccion: Transaccion): void {
    const historial = [transaccion, ...this.transaccionesSubject.getValue()];
    this.transaccionesSubject.next(historial);
  }

  /** Retorna el monto actualmente suscrito en un fondo dado */
  getSuscritoMonto(fondoId: number): number {
    return this.suscripcionesSubject.getValue()[fondoId] || 0;
  }
}
