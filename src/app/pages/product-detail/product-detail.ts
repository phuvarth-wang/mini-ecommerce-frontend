import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute} from '@angular/router';
import { ProductService, Product} from '../../services/product.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})

export class ProductDetailComponent {

  private route = inject(ActivatedRoute);
  private ProductService = inject(ProductService);
  
  product = signal<Product | null> (null);

  constructor() {
    this.loadProduct();
  }

  loadProduct() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.ProductService.getProduct(id).subscribe((res) => {
      this.product.set(res);
    })
  }

}
