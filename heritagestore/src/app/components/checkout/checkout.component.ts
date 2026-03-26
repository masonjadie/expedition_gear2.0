import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  currentStep = 1;
  shippingForm: FormGroup;
  paymentForm: FormGroup;
  cartItems: any[] = [];
  totalPrice: number = 0;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.shippingForm = this.fb.group({
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', [Validators.required]]
    });

    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9 ]{16,19}$')]],
      expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/([0-9]{2})$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]]
    });

    this.paymentForm.get('cardNumber')?.valueChanges.subscribe(val => {
      if (val) {
        const formatted = this.formatCardNumber(val);
        this.paymentForm.get('cardNumber')?.patchValue(formatted, { emitEvent: false });
      }
    });
  }

  formatCardNumber(val: string): string {
    const v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.totalPrice = this.cartService.getTotalPrice();
      if (this.cartItems.length === 0 && this.currentStep !== 4) {
        // Only redirect if they didn't just place an order
        // this.router.navigate(['/shop']);
      }
    });
  }

  nextStep() {
    if (this.currentStep === 1 && this.shippingForm.valid) {
      this.currentStep = 2;
    } else if (this.currentStep === 2 && this.paymentForm.valid) {
      this.currentStep = 3;
    }
  }

  prevStep() {
    this.currentStep--;
  }

  async placeOrder() {
    // Process order with backend
    this.currentStep = 4;
    try {
      await this.cartService.placeOrder();
      // Add a slight delay for visual processing feedback
      setTimeout(() => {
        this.router.navigate(['/order-processing']);
      }, 1500);
    } catch (error) {
      console.error('Order failed:', error);
      this.currentStep = 3; // Go back to review step on error
      this.notificationService.show('There was an issue processing your order. Please try again.');
    }
  }
}
