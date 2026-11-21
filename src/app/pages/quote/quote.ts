import { CurrencyPipe } from '@angular/common';
import { Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartItem, ClientData } from '../../models/cart.model';
import { CopPipe } from '../../pipes/cop.pipe';
import { CartService } from '../../services/cart.service';
import { ExchangeRateService } from '../../services/exchange-rate.service';
import { QuotePdfService } from '../../services/quote-pdf.service';

@Component({
  selector: 'app-quote',
  imports: [ReactiveFormsModule, RouterLink, CopPipe, CurrencyPipe],
  templateUrl: './quote.html',
  styleUrl: './quote.css',
})
export class Quote {
  protected readonly cart = inject(CartService);
  private readonly pdf = inject(QuotePdfService);
  private readonly exchange = inject(ExchangeRateService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly form = this.fb.group({
    nombre: ['', Validators.required],
    empresa: [''],
    nit: [''],
    telefono: [''],
    email: ['', Validators.email],
  });

  private readonly nombreInput = viewChild<ElementRef<HTMLInputElement>>('nombreInput');
  protected readonly toast = signal<string | null>(null);
  protected readonly generating = signal(false);
  private toastTimer?: ReturnType<typeof setTimeout>;

  // API externa (bonus): total aproximado en USD
  private readonly copPerUsd = toSignal(this.exchange.getCopPerUsd(), { initialValue: null });
  protected readonly totalUsd = computed(() => {
    const rate = this.copPerUsd();
    return rate ? this.cart.totalValue() / rate : null;
  });

  protected addonNames(item: CartItem): string {
    return item.addons.map((a) => a.name).join(', ');
  }

  protected async generate(): Promise<void> {
    if (this.cart.count() === 0) {
      this.showToast('Agrega al menos una prenda antes de generar la cotización.');
      return;
    }
    const v = this.form.getRawValue();
    const client: ClientData = {
      nombre: v.nombre.trim(),
      empresa: v.empresa.trim(),
      nit: v.nit.trim(),
      telefono: v.telefono.trim(),
      email: v.email.trim(),
    };
    if (!client.nombre) {
      this.showToast('Ingresa el nombre del cliente para generar la cotización.');
      this.nombreInput()?.nativeElement.focus();
      return;
    }
    if (this.form.controls.email.invalid) {
      this.showToast('El correo electrónico no tiene un formato válido.');
      return;
    }

    this.generating.set(true);
    try {
      await this.pdf.generate(client, this.cart.items());
      this.showToast('Cotización generada. Revisa tu carpeta de descargas.');
    } catch (err) {
      console.error(err);
      this.showToast('No se pudo generar el PDF. Intenta de nuevo.');
    } finally {
      this.generating.set(false);
    }
  }

  private showToast(message: string): void {
    this.toast.set(message);
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toast.set(null), 4200);
  }
}
