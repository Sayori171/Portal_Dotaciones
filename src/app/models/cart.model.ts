import { Addon } from './product.model';

/** Línea de la cotización (prenda + talla + personalizaciones + cantidad). */
export interface CartItem {
  id: number;
  productId: string;
  label: string;
  size: string;
  qty: number;
  addons: Addon[];
  unitPrice: number;
  subtotal: number;
}

/** Datos del cliente que aparecen en el PDF. */
export interface ClientData {
  nombre: string;
  empresa: string;
  nit: string;
  telefono: string;
  email: string;
}
