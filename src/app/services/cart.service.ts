import { Injectable, signal } from '@angular/core';
import { Product } from './product.service' 

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})

export class CartService {
  private CART_KEY = 'app_cart';

  cart = signal<CartItem[]>([]);

  constructor() {
    this.loadCart();
  }

  private loadCart() {
    const saved = localStorage.getItem(this.CART_KEY);
    if (saved) {
      this.cart.set(JSON.parse(saved));
    }
  }

  private saveCart() {
    localStorage.setItem(this.CART_KEY, JSON.stringify(this.cart()));
  }

  addToCart(product: Product) {
    const current = this.cart();
    const existing = current.find(item => item.product.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      current.push({
        product,
        quantity: 1
      });
    }

    this.cart.set([...current]);
    this.saveCart();
  }

  removeFromCart(productId: string) {
    const current = this.cart().filter(item => item.product.id != productId);
    this.cart.set(current);
    this.saveCart();
  }

  updateQuantity(productId: string, quantity: number) {
    const current = this.cart();
    const item = current.find(i => i.product.id === productId);
    if (!item) return;

    item.quantity = quantity;
    if (item.quantity <= 0) {
      this.removeFromCart(productId);
    } else {
      this.cart.set([...current]);
      this.saveCart();
    }
  }

  clearCart() {
    this.cart.set([]);
    localStorage.removeItem(this.CART_KEY);
  }

  getTotal() {
    return this.cart().reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }
}
