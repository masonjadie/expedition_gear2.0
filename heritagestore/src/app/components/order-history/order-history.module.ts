import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OrderHistoryComponent } from './order-history.component';
import { AuthGuard } from '../../guards/auth.guard';

const routes: Routes = [{ path: '', component: OrderHistoryComponent, canActivate: [AuthGuard] }];

@NgModule({
    declarations: [OrderHistoryComponent],
    imports: [CommonModule, RouterModule.forChild(routes)]
})
export class OrderHistoryModule { }
