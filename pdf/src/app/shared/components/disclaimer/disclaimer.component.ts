import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { AuthService } from '@pdfun/angular/services'
import { Message } from 'primeng/api'
import { MessagesModule } from 'primeng/messages'

@Component({
  selector: 'pdf-disclaimer',
  standalone: true,
  imports: [CommonModule, MessagesModule],
  template: `
    @if(authService.isLoggedIn() === false) {
    <p-messages
      [(value)]="messages"
      [enableService]="false"
      [closable]="false"
    />
    <em class="my-4 block"
      >* Disclaimer: File uploaded is public accessible for people with some
      skills and will be deleted after one day. Please
      <strong>DO NOT</strong> upload sensitive documents. Stay updated for more
      features.</em
    >
    } @else {
    <em class="my-4 block"
      >* Note: Thanks for logging in. Your files are secured and will be deleted
      in 1 day!</em
    >
    }
  `,
  styles: ``,
})
export class DisclaimerComponent {
  protected authService = inject(AuthService)

  messages: Message[] = [
    {
      severity: 'info',
      detail: 'Please Log in if you want to secure your uploaded files!',
    },
  ]
}
