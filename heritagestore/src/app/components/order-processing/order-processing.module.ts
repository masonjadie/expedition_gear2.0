import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OrderProcessingComponent } from './order-processing.component';

const routes: Routes = [{ path: '', component: OrderProcessingComponent }];

@NgModule({
    declarations: [OrderProcessingComponent],
    imports: [CommonModule, RouterModule.forChild(routes)]
})
export class OrderProcessingModule { }
