import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-order-processing',
  templateUrl: './order-processing.component.html',
  styleUrls: ['./order-processing.component.css']
})
export class OrderProcessingComponent implements OnInit, OnDestroy {
  order: any;
  currentStatus: string = 'Confirmed';
  private timer: any;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.order = this.cartService.getLastOrder();
    this.updateStatus();
    
    // Refresh status every 10 seconds
    this.timer = setInterval(() => {
      this.updateStatus();
    }, 10000);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  updateStatus(): void {
    if (this.order) {
      this.currentStatus = this.cartService.getOrderStatus(this.order);
    }
  }

  isCompleted(status: string): boolean {
    const statuses = ['Confirmed', 'Processing', 'Shipped', 'Delivered'];
    const currentIndex = statuses.indexOf(this.currentStatus);
    const stepIndex = statuses.indexOf(status);
    return stepIndex < currentIndex;
  }

  isActive(status: string): boolean {
    return this.currentStatus === status;
  }
}
