import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { NotFound } from './pages/not-found/not-found';
import { ProductDetail } from './pages/product-detail/product-detail';
import { Quote } from './pages/quote/quote';

export const routes: Routes = [
  { path: '', component: Home, title: 'Portal de Dotaciones · Cotizador de Dotación Industrial' },
  // RUTA DINÁMICA: /producto/camisa, /producto/pantalon ...
  { path: 'producto/:id', component: ProductDetail, title: 'Personaliza tu prenda · Portal de Dotaciones' },
  { path: 'cotizador', component: Quote, title: 'Cotizador · Portal de Dotaciones' },
  { path: '**', component: NotFound, title: 'Página no encontrada · Portal de Dotaciones' },
];
