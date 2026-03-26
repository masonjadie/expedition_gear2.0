import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ShopComponent } from './shop.component';

const routes: Routes = [{ path: '', component: ShopComponent }];

@NgModule({
    declarations: [ShopComponent],
    imports: [CommonModule, FormsModule, RouterModule.forChild(routes)]
})
export class ShopModule { }
