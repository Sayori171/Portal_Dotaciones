import { DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected readonly cart = inject(CartService);
  private readonly document = inject(DOCUMENT);
  protected readonly menuOpen = signal(false);

  protected toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  /** "Contacto" baja al footer, que existe en todas las páginas. */
  protected goToContact(event: Event): void {
    event.preventDefault();
    this.closeMenu();
    this.document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
  }
}
