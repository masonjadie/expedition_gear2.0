import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any;
  initials: string = '??';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user && this.user.name) {
      this.initials = this.user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase();
    }
  }

}
