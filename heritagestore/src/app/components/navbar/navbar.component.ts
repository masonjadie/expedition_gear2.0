import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  cartItemCount: number = 0;
  currentUrl: string = '';
  userName: string = '';
  isMenuOpen: boolean = false;

  constructor(
    public authService: AuthService,
    private cartService: CartService,
    public themeService: ThemeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    this.updateUserName();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentUrl = event.urlAfterRedirects;
      this.updateUserName();
    });

    this.cartService.cart$.subscribe(() => {
      this.cartItemCount = this.cartService.getItemCount();
    });
  }

  updateUserName(): void {
    const user = this.authService.getCurrentUser();
    this.userName = user ? user.name : '';
  }

  isActive(url: string): boolean {
    return this.currentUrl === url;
  }

  onLogout() {
    this.authService.logout();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
