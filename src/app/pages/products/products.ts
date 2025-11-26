import { Component, signal, inject, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Product, ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
})

export class ProductsComponent {

  private productService = inject(ProductService);
  private router = inject(Router);

  products = signal<Product[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    afterNextRender(() => {
      this.loadProducts();
    })
  }

  loadProducts() {
    this.loading.set(true);

    this.productService.getProducts().subscribe({
      next: (res) => {
        this.products.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('getProducts error', err);
        this.error.set('Failed to load products');
        this.loading.set(false);
      }
    });
  }

  goToDetail(p: Product) {
    this.router.navigate(['products', p.id]);
  }
}
