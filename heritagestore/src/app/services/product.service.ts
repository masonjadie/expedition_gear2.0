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

    private apiUrl = 'http://localhost:3000/api';

    constructor(private http: HttpClient) {
        this.loadProducts();
    }

    private loadProducts() {
        this.http.get<Product[]>(`${this.apiUrl}/products`).subscribe({
            next: (products) => {
                const finalProducts = products || [];
                // Only overwrite if it isn't an empty array while we have cached items
                // Actually, if we want strict sync, we always overwrite.
                this.productsSubject.next(finalProducts);
                localStorage.setItem('th_products', JSON.stringify(finalProducts));
            },
            error: (err) => {
                console.error('Failed to load products from DB, using cache', err);
                this.loadFromFallback();
            }
        });
    }

    private loadFromFallback() {
        const saved = localStorage.getItem('th_products');
        if (saved) {
            this.productsSubject.next(JSON.parse(saved));
        } else {
            this.productsSubject.next([]);
        }
    }

    private saveProducts(products: Product[]) {
        localStorage.setItem('th_products', JSON.stringify(products));
        this.productsSubject.next(products);
    }

    getProducts() {
        return this.productsSubject.value;
    }

    exportXML() {
        window.open(`${this.apiUrl}/products/export`, '_blank');
    }

    importXML(file: File) {
        const formData = new FormData();
        formData.append('xmlFile', file);
        this.http.post<{message: string}>(`${this.apiUrl}/products/import`, formData).subscribe({
            next: (res) => {
                console.log(res.message);
                this.loadProducts();
            },
            error: (err) => console.error('Failed to import XML', err)
        });
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
