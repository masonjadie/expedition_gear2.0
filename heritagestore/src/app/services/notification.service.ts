import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface NotificationMessage {
  text: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<NotificationMessage>();

  public notification$: Observable<NotificationMessage> = this.notificationSubject.asObservable();

  show(text: string, duration: number = 3000): void {
    this.notificationSubject.next({ text, duration });
  }
}
