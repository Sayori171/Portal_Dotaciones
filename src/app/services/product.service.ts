import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';
import { Product } from '../models/product.model';

/**
 * Servicio MOCK del catálogo: lee `public/data/products.json` con HttpClient.
 * Para pasar a una API real solo se cambia la URL (el resto de la app no se toca).
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);

  // shareReplay: se hace una sola petición y todos los componentes reutilizan el resultado.
  private readonly products$ = this.http.get<Product[]>('data/products.json').pipe(
    catchError((err) => {
      console.error('No se pudo cargar el catálogo', err);
      return of([] as Product[]);
    }),
    shareReplay(1),
  );

  getAll(): Observable<Product[]> {
    return this.products$;
  }

  /** Devuelve la prenda o `null` si el id de la ruta no existe. */
  getById(id: string): Observable<Product | null> {
    return this.products$.pipe(map((list) => list.find((p) => p.id === id) ?? null));
  }
}
