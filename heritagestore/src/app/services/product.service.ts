import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
    description: string;
}


@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private productsSubject = new BehaviorSubject<Product[]>([]);
    products$ = this.productsSubject.asObservable();

    private defaultProducts: Product[] = [
        { id: 1, name: 'Expedition Gore-Tex Jacket', price: 45.00, image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=600&q=80&fm=webp', category: 'Apparel', description: 'Ultimate protection for high-altitude climbing.' },
        { id: 2, name: 'Ultra-Light Titanium Stove', price: 35.00, image: 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?auto=format&fit=crop&w=600&q=80&fm=webp', category: 'Handcrafted', description: 'Minimalist cooking solution for weight-conscious hikers.' },
        { id: 3, name: 'Packable Down Sleeping Bag', price: 25.00, image: 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?auto=format&fit=crop&w=600&q=80&fm=webp', category: 'Handcrafted', description: 'Superior warmth-to-weight ratio.' },
        { id: 4, name: 'Multi-Tool Survival Kit', price: 22.00, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80&fm=webp', category: 'Essentials', description: 'Everything you need in a compact package.' },
        { id: 5, name: 'Merino Wool Baselayer', price: 18.00, image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80&fm=webp', category: 'Apparel', description: 'Premium moisture-wicking comfort.' },
        { id: 6, name: 'Solar Power Bank 20,000mAh', price: 30.00, image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=600&q=80&fm=webp', category: 'Essentials', description: 'Keep your devices charged anywhere.' },
        { id: 7, name: 'Lightweight Hiking Socks', price: 28.00, image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80&fm=webp', category: 'Apparel', description: 'Blister protection and ultimate durability.' },
        { id: 8, name: 'Limited Edition Topo Map', price: 60.00, image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80&fm=webp', category: 'Collectors', description: 'A beautifully crafted topographical map.' }
    ];

    private apiUrl = 'http://localhost:3000/api';

    constructor(private http: HttpClient) {
        this.loadProducts();
    }

    private loadProducts() {
        this.http.get<Product[]>(`${this.apiUrl}/products`).subscribe({
            next: (products) => {
                if (products && products.length > 0) {
                    this.productsSubject.next(products);
                    localStorage.setItem('th_products', JSON.stringify(products));
                } else {
                    this.loadFromFallback();
                }
            },
            error: (err) => {
                console.error('Failed to load products from DB, falling back to local defaults', err);
                this.loadFromFallback();
            }
        });
    }

    private loadFromFallback() {
        const saved = localStorage.getItem('th_products');
        if (saved && JSON.parse(saved).length > 0) {
            this.productsSubject.next(JSON.parse(saved));
        } else {
            this.productsSubject.next(this.defaultProducts);
            this.saveProducts(this.defaultProducts);
        }
    }

    private saveProducts(products: Product[]) {
        localStorage.setItem('th_products', JSON.stringify(products));
        this.productsSubject.next(products);
    }

    getProducts() {
        return this.productsSubject.value;
    }

    addProduct(newProduct: Omit<Product, 'id'>) {
        return this.http.post<{ message: string, productId: number }>(`${this.apiUrl}/products`, newProduct)
            .subscribe({
                next: (res) => {
                    const productWithId = { ...newProduct, id: res.productId };
                    const products = [...this.getProducts(), productWithId];
                    this.saveProducts(products);
                },
                error: (err) => {
                    console.error('Error adding product, falling back to local', err);
                    const fallbackId = Math.max(0, ...this.getProducts().map(p => p.id)) + 1;
                    const productWithId = { ...newProduct, id: fallbackId };
                    const products = [...this.getProducts(), productWithId];
                    this.saveProducts(products);
                }
            });
    }

    deleteProduct(id: number) {
        return this.http.delete(`${this.apiUrl}/products/${id}`)
            .subscribe({
                next: () => {
                    const products = this.getProducts().filter(p => p.id !== id);
                    this.saveProducts(products);
                },
                error: (err) => {
                    console.error('Error deleting product, falling back to local', err);
                    const products = this.getProducts().filter(p => p.id !== id);
                    this.saveProducts(products);
                }
            });
    }

    updateProduct(updatedProduct: Product) {
        return this.http.put(`${this.apiUrl}/products/${updatedProduct.id}`, updatedProduct)
            .subscribe({
                next: () => {
                    const products = this.getProducts().map(p => p.id === updatedProduct.id ? updatedProduct : p);
                    this.saveProducts(products);
                },
                error: (err) => {
                    console.error('Error updating product, falling back to local', err);
                    const products = this.getProducts().map(p => p.id === updatedProduct.id ? updatedProduct : p);
                    this.saveProducts(products);
                }
            });
    }

    getProductById(id: number) {
        return this.getProducts().find(p => p.id === id);
    }
}
