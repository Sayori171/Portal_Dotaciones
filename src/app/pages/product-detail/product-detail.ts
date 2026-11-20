import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { GarmentSvg } from '../../components/garment-svg/garment-svg';
import { Product } from '../../models/product.model';
import { CopPipe } from '../../pipes/cop.pipe';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, GarmentSvg, CopPipe],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {
  /** Parámetro dinámico de la ruta `producto/:id` (llega gracias a withComponentInputBinding). */
  readonly id = input.required<string>();

  private readonly productService = inject(ProductService);
  private readonly titleService = inject(Title);
  protected readonly cart = inject(CartService);

  // undefined = cargando · null = el id no existe · Product = encontrado
  protected readonly product = toSignal(
    toObservable(this.id).pipe(switchMap((id) => this.productService.getById(id))),
  );
  private readonly allProducts = toSignal(this.productService.getAll(), { initialValue: [] });
  protected readonly others = computed(() => this.allProducts().filter((p) => p.id !== this.id()));

  // Selección del usuario
  protected readonly size = signal('');
  protected readonly qty = signal(1);
  private readonly selectedIds = signal<string[]>([]);
  protected readonly added = signal(false);

  // Valores derivados
  protected readonly selectedAddons = computed(() =>
    (this.product()?.addons ?? []).filter((a) => this.selectedIds().includes(a.id)),
  );
  protected readonly unitPrice = computed(
    () => (this.product()?.basePrice ?? 0) + this.selectedAddons().reduce((s, a) => s + a.price, 0),
  );
  protected readonly subtotal = computed(() => this.unitPrice() * this.qty());

  constructor() {
    // Al cambiar de prenda (/producto/camisa -> /producto/pantalon) se reinicia la selección.
    effect(() => {
      const p = this.product();
      untracked(() => {
        this.size.set(p?.defaultSize ?? '');
        this.qty.set(1);
        this.selectedIds.set([]);
        this.added.set(false);
      });
      if (p) this.titleService.setTitle(`${p.name} · Portal de Dotaciones`);
    });
  }

  protected isSelected(addonId: string): boolean {
    return this.selectedIds().includes(addonId);
  }

  protected toggleAddon(addonId: string): void {
    this.selectedIds.update((ids) =>
      ids.includes(addonId) ? ids.filter((x) => x !== addonId) : [...ids, addonId],
    );
  }

  protected changeQty(delta: number): void {
    this.qty.update((q) => Math.max(1, q + delta));
  }

  protected onQtyInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = Math.max(1, parseInt(input.value, 10) || 1);
    this.qty.set(value);
    input.value = String(value);
  }

  protected addToCart(product: Product): void {
    this.cart.add({
      productId: product.id,
      label: product.name,
      size: this.size(),
      qty: this.qty(),
      addons: this.selectedAddons(),
      unitPrice: this.unitPrice(),
      subtotal: this.subtotal(),
    });
    this.added.set(true);
    setTimeout(() => this.added.set(false), 1100);
  }
}
