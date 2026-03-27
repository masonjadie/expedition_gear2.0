import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  latestOrder: any;
  orderStatus: string = '';
  userName: string = 'Member';

  constructor(private cartService: CartService, private authService: AuthService) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user && user.name) {
      this.userName = user.name;
    }
    
    this.latestOrder = this.cartService.getLastOrder();
    if (this.latestOrder) {
      this.orderStatus = this.cartService.getOrderStatus(this.latestOrder);
    }
  }

  getDashboardStatusClass(): string {
    switch (this.orderStatus) {
      case 'Confirmed': return 'status-confirmed';
      case 'Processing': return 'status-processing';
      case 'Shipped': return 'status-shipped';
      case 'Delivered': return 'status-delivered';
      default: return '';
    }
  }
}
