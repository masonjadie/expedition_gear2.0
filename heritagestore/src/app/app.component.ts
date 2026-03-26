import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'heritagestore';
  showCookieBanner = true;

  acceptCookies() {
    this.showCookieBanner = false;
    // Potentially store in localStorage if we want it to persist
  }
}
