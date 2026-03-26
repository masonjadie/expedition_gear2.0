import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

export interface CartItem {
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000/api';
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartSubject.next(this.cartItems);
    }
  }

  getCartItems() {
    return this.cartItems;
  }

  addToCart(product: any) {
    const existingItem = this.cartItems.find(item => item.name === product.name);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cartItems.push({ ...product, quantity: 1 });
    }
    this.updateCart();
  }

  removeFromCart(productName: string) {
    this.cartItems = this.cartItems.filter(item => item.name !== productName);
    this.updateCart();
  }

  updateQuantity(productName: string, quantity: number) {
    const item = this.cartItems.find(item => item.name === productName);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeFromCart(productName);
      } else {
        this.updateCart();
      }
    }
  }

  getTotalPrice() {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getItemCount() {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }

  private orders: any[] = [];

  async placeOrder() {
    const user = this.authService.getCurrentUser();
    const localId = `HM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    const newOrder = {
      id: localId,
      user_id: user ? user.id : 1,
      date: new Date(),
      items: [...this.cartItems],
      total: this.getTotalPrice(),
      status: 'Confirmed',
      tracking_number: null
    };

    // 1. Try SQL backend first
    try {
      const response: any = await firstValueFrom(
        this.http.post(`${this.apiUrl}/orders`, newOrder)
      );
      if (response.orderId) newOrder.id = `HM-${response.orderId}`;
    } catch (_) {
      // Backend unavailable — fall through to local storage
    }

    this.orders = this.getAllOrders();
    this.orders.push(newOrder);
    localStorage.setItem('th_orders', JSON.stringify(this.orders));
    localStorage.setItem('lastOrder', JSON.stringify(newOrder));
    
    this.clearCart();
    return newOrder;
  }

  getAllOrders(): any[] {
    const saved = localStorage.getItem('th_orders');
    return saved ? JSON.parse(saved) : [];
  }

  getUserOrders(): any[] {
    const user = this.authService.getCurrentUser();
    if (!user) return [];
    return this.getAllOrders().filter(o => o.user_id === user.id);
  }

  getLastOrder() {
    const saved = localStorage.getItem('lastOrder');
    if (saved) {
      const order = JSON.parse(saved);
      if (order && typeof order.date === 'string') {
        order.date = new Date(order.date);
      }
      return order;
    }
    return null;
  }

  // Admin Methods
  updateOrderStatus(orderId: string, status: string, trackingNumber?: string) {
    const allOrders = this.getAllOrders();
    const orderIndex = allOrders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      allOrders[orderIndex].status = status;
      if (trackingNumber) {
        allOrders[orderIndex].tracking_number = trackingNumber;
      }
      localStorage.setItem('th_orders', JSON.stringify(allOrders));
      
      // Also update lastOrder if it matches
      const lastOrder = this.getLastOrder();
      if (lastOrder && lastOrder.id === orderId) {
        lastOrder.status = status;
        if (trackingNumber) lastOrder.tracking_number = trackingNumber;
        localStorage.setItem('lastOrder', JSON.stringify(lastOrder));
      }
    }
  }

  getOrderStatus(order: any): string {
    if (!order) return 'Unknown';
    
    // If order has an explicit status from admin, use it
    if (order.status && order.status !== 'Paid' && order.status !== 'Confirmed') {
      return order.status;
    }

    // Fallback to simulation for new orders if not managed by admin yet
    const now = new Date().getTime();
    const orderTime = new Date(order.date).getTime();
    const diffMinutes = (now - orderTime) / (1000 * 60);

    if (diffMinutes < 1) return 'Confirmed';
    if (diffMinutes < 3) return 'Processing';
    if (diffMinutes < 5) return 'Shipped';
    return 'Delivered';
  }

  clearCart() {
    this.cartItems = [];
    this.updateCart();
  }

  private updateCart() {
    this.cartSubject.next(this.cartItems);
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }
}
