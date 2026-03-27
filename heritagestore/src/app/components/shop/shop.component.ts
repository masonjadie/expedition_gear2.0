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
  filteredProducts: any[] = [];
  categories: string[] = ['Camping', 'Hiking', 'Apparel'];

  searchQuery: string = '';
  selectedActivity: string = '';
  maxPrice: number = 200;

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
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(p => {
      const q = this.searchQuery.toLowerCase();
      const matchSearch = p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q));
      
      let matchCategory = true;
      if (this.selectedActivity) {
          // A little fuzzy match just in case
          matchCategory = p.category?.toLowerCase() === this.selectedActivity.toLowerCase() || 
                          p.name?.toLowerCase().includes(this.selectedActivity.toLowerCase());
      }
      
      const matchPrice = p.price <= this.maxPrice;
      
      return matchSearch && matchCategory && matchPrice;
    });
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
