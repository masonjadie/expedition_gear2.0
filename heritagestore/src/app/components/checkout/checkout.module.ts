import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckoutComponent } from './checkout.component';
import { AuthGuard } from '../../guards/auth.guard';

const routes: Routes = [{ path: '', component: CheckoutComponent, canActivate: [AuthGuard] }];

@NgModule({
    declarations: [CheckoutComponent],
    imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes)]
})
export class CheckoutModule { }
