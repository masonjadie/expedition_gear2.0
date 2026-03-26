import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AccessibilityComponent } from './accessibility.component';

const routes: Routes = [{ path: '', component: AccessibilityComponent }];

@NgModule({
    declarations: [AccessibilityComponent],
    imports: [CommonModule, RouterModule.forChild(routes)]
})
export class AccessibilityModule { }
