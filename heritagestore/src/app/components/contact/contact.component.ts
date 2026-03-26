import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactData = { name: '', email: '', message: '' };
  formMessage = '';
  isSuccess = false;

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.contactData.name && this.contactData.email && this.contactData.message) {
      this.isSuccess = true;
      this.formMessage = 'Thank you! Your message has been sent successfully.';
      this.contactData = { name: '', email: '', message: '' };
    } else {
      this.isSuccess = false;
      this.formMessage = 'Please fill out all fields before submitting.';
    }
  }
}
