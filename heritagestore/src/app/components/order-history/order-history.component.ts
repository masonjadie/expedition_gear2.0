import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orders: any[] = [];

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    // Fetch orders from the new persistent service
    this.orders = this.cartService.getUserOrders();
  }
}
