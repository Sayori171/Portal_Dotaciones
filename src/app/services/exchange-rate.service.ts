import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';
import { ExchangeRateResponse } from '../models/exchange-rate.model';

/**
 * API EXTERNA (bonus): tasa de cambio USD -> COP de open.er-api.com (gratis, sin API key).
 * Se usa para mostrar el total de la cotización también en dólares.
 * Si la API falla, devuelve null y la app sigue funcionando normal.
 */
@Injectable({ providedIn: 'root' })
export class ExchangeRateService {
  private readonly http = inject(HttpClient);

  private readonly copPerUsd$ = this.http
    .get<ExchangeRateResponse>('https://open.er-api.com/v6/latest/USD')
    .pipe(
      map((res) => (res.result === 'success' ? (res.rates['COP'] ?? null) : null)),
      catchError(() => of(null)),
      shareReplay(1),
    );

  /** Pesos colombianos por 1 USD (o null si no se pudo consultar). */
  getCopPerUsd(): Observable<number | null> {
    return this.copPerUsd$;
  }
}
