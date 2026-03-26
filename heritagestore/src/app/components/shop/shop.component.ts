import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  products: any[] = [];
  apparel: any[] = [];
  handcrafted: any[] = [];
  essentials: any[] = [];
  collectors: any[] = [];

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private productService: ProductService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.productService.products$.subscribe(products => {
      this.products = products;
      this.groupProducts();
    });
  }

  private groupProducts() {
    this.apparel = this.products.filter(p => p.category === 'Apparel');
    this.handcrafted = this.products.filter(p => p.category === 'Handcrafted');
    this.essentials = this.products.filter(p => p.category === 'Essentials');
    this.collectors = this.products.filter(p => p.category === 'Collectors');
  }

  onAddToCart(product: any) {
    if (this.authService.isLoggedIn()) {
      this.cartService.addToCart(product);
      this.notificationService.show(`${product.name} added to cart!`);
    } else {
      this.notificationService.show('Please log in to add items to your cart.');
      this.router.navigate(['/login']);
    }
  }
}
