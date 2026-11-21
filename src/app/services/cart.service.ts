import { Injectable, computed, signal } from '@angular/core';
import { CartItem } from '../models/cart.model';

/** Estado global de la cotización (carrito). Usa signals para que la UI reaccione sola. */
@Injectable({ providedIn: 'root' })
export class CartService {
  private nextId = 1;
  private readonly _items = signal<CartItem[]>([]);

  readonly items = this._items.asReadonly();
  readonly count = computed(() => this._items().length);
  readonly totalUnits = computed(() => this._items().reduce((s, i) => s + i.qty, 0));
  readonly totalValue = computed(() => this._items().reduce((s, i) => s + i.subtotal, 0));

  add(item: Omit<CartItem, 'id'>): void {
    this._items.update((list) => [...list, { ...item, id: this.nextId++ }]);
  }

  remove(id: number): void {
    this._items.update((list) => list.filter((i) => i.id !== id));
  }
}
