import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private isLoggedInStatus = false;

  constructor(private router: Router, private http: HttpClient) {
    this.isLoggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
  }

  // SHA-256 password hashing (Web Crypto API)
  async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // ── LOGIN ──────────────────────────────────────────────────────────────
  async login(email: string, password_plain: string): Promise<boolean> {
    const password_hash = await this.hashPassword(password_plain);

    // 1. Try SQL backend first
    try {
      const response: any = await firstValueFrom(
        this.http.post(`${this.apiUrl}/login`, { email, password_hash })
      );
      this.setLoggedIn(response.user);
      return true;
    } catch (_) {
      // Backend unavailable — fall through to local auth
    }

    // 2. Local auth fallback (works without a database)
    const users: any[] = JSON.parse(localStorage.getItem('ym_users') || '[]');
    
    // Master Admin check
    if (email === 'admin@trailpeak.com' && password_plain === 'admin123') {
        const adminUser = { id: 0, name: 'System Admin', email: 'admin@trailpeak.com', role: 'admin' };
        this.setLoggedIn(adminUser);
        return true;
    }

    const match = users.find(
      (u: any) => u.email === email && u.password_hash === password_hash
    );

    if (match) {
      const { password_hash: _ph, ...safeUser } = match;
      this.setLoggedIn(safeUser);
      return true;
    }

    return false;
  }

  // ── REGISTER ───────────────────────────────────────────────────────────
  async register(name: string, email: string, password_plain: string): Promise<void> {
    const password_hash = await this.hashPassword(password_plain);

    // 1. Try SQL backend first
    try {
      await firstValueFrom(
        this.http.post(`${this.apiUrl}/register`, { name, email, password_hash })
      );
      // Registration successful, now login
      await this.login(email, password_plain);
      return;
    } catch (_) {
      // Backend unavailable — fall through to local register
    }

    // 2. Local register fallback
    const users: any[] = JSON.parse(localStorage.getItem('ym_users') || '[]');

    if (users.find((u: any) => u.email === email)) {
      throw new Error('Email already in use');
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password_hash,
      created_at: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('ym_users', JSON.stringify(users));
    
    // Log in the new user
    const { password_hash: _ph, ...safeUser } = newUser;
    this.setLoggedIn(safeUser);
  }

  // ── HELPERS ────────────────────────────────────────────────────────────
  private setLoggedIn(user: any) {
    this.isLoggedInStatus = true;
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.isLoggedInStatus = false;
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.isLoggedInStatus;
  }

  getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user && user.role === 'admin';
  }
}
