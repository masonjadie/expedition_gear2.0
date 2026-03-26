import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.totalPrice = this.cartService.getTotalPrice();
    });
  }

  onUpdateQuantity(itemName: string, quantity: number) {
    this.cartService.updateQuantity(itemName, quantity);
  }

  onRemoveItem(itemName: string) {
    this.cartService.removeFromCart(itemName);
  }

  onClearCart() {
    this.cartService.clearCart();
  }
}
