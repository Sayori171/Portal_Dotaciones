import { Component, input } from '@angular/core';
import { Addon } from '../../models/product.model';

/**
 * Dibuja la prenda en SVG y resalta las zonas de las personalizaciones activas.
 * Inputs: qué prenda dibujar y qué addons están activos.
 */
@Component({
  selector: 'app-garment-svg',
  templateUrl: './garment-svg.html',
  styleUrl: './garment-svg.css',
})
export class GarmentSvg {
  readonly productId = input.required<string>();
  readonly activeAddons = input<Addon[]>([]);
  /** Factor de tamaño: 1 = tarjeta del catálogo, 1.5 = página de detalle. */
  readonly scale = input(1);

  /** Devuelve la clase CSS de la zona (p. ej. "active-tape") si algún addon activo la usa. */
  protected zoneClass(zone: string): string {
    const addon = this.activeAddons().find((a) => a.zones.includes(zone));
    return addon ? `active-${addon.effect}` : '';
  }
}
