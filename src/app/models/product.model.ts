/** Tipo de efecto visual que una personalización tiene sobre la prenda (SVG). */
export type AddonEffect = 'print' | 'embroidery' | 'tape';

/** Personalización opcional de una prenda (estampado, bordado, cinta reflectiva). */
export interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
  effect: AddonEffect;
  /** Zonas del SVG que se resaltan cuando el addon está activo. */
  zones: string[];
}

/** Prenda del catálogo. */
export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  sizes: string[];
  defaultSize: string;
  addons: Addon[];
}
