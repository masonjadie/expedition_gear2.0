import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  activeTab: 'products' | 'orders' = 'products';
  products: Product[] = [];
  orders: any[] = [];
  
  editingProduct: Product | Partial<Product> | null = null;
  isAddingProduct = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.notificationService.show('Unauthorized access.');
      this.router.navigate(['/dashboard']);
      return;
    }

    this.productService.products$.subscribe(products => this.products = products);
    this.orders = this.cartService.getAllOrders();
  }

  // Product Management
  editProduct(product: Product) {
    console.log('Editing product:', product.name);
    this.editingProduct = { ...product };
    this.isAddingProduct = false;
  }

  addNewProduct() {
      this.isAddingProduct = true;
      this.editingProduct = {
          name: '',
          price: 0,
          description: '',
          category: 'Apparel',
          image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=600&q=80&fm=webp'
      };
  }

  deleteProduct(id: number) {
      if (confirm('Are you sure you want to delete this product?')) {
          this.productService.deleteProduct(id);
          this.notificationService.show('Product deleted!');
      }
  }

  saveProduct() {
    if (this.editingProduct) {
      if (this.isAddingProduct) {
          this.productService.addProduct(this.editingProduct as any);
          this.notificationService.show('Product added successfully!');
      } else {
          this.productService.updateProduct(this.editingProduct as Product);
          this.notificationService.show('Product updated successfully!');
      }
      this.editingProduct = null;
      this.isAddingProduct = false;
    }
  }

  resetProducts() {
    console.log('Resetting products...');
    localStorage.removeItem('th_products');
    location.reload();
  }

  cancelEdit() {
    this.editingProduct = null;
    this.isAddingProduct = false;
  }

  // Order Management
  updateOrderStatus(orderId: string, status: string, trackingNumber?: string) {
    console.log('Updating order status:', orderId, status, trackingNumber);
    this.cartService.updateOrderStatus(orderId, status, trackingNumber);
    this.orders = this.cartService.getAllOrders(); // Refresh
    this.notificationService.show(`Order ${orderId} updated to ${status}`);
  }
}
