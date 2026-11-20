import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Hero } from '../../components/hero/hero';
import { ProductCard } from '../../components/product-card/product-card';
import { Process } from '../../components/process/process';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-home',
  imports: [Hero, ProductCard, Process],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly productService = inject(ProductService);
  // undefined = cargando, [] = vacío/error, [...] = datos
  protected readonly products = toSignal(this.productService.getAll());
}
