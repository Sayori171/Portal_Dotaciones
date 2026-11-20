import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { CopPipe } from '../../pipes/cop.pipe';
import { GarmentSvg } from '../garment-svg/garment-svg';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, CopPipe, GarmentSvg],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  readonly product = input.required<Product>();
}
