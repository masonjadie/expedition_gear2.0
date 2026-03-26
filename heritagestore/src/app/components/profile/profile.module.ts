import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile.component';
import { AuthGuard } from '../../guards/auth.guard';

const routes: Routes = [{ path: '', component: ProfileComponent, canActivate: [AuthGuard] }];

@NgModule({
    declarations: [ProfileComponent],
    imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes)]
})
export class ProfileModule { }
