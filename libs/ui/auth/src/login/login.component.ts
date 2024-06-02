import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { Router } from '@angular/router'
import { GOOGLE_LOGIN } from '@pdfun/angular/firebase'
import { ButtonModule } from 'primeng/button'
@Component({
  selector: 'lib-login',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <section class="m-auto text-center">
      <p-button
        size="small"
        label="Login"
        icon="pi pi-google"
        (onClick)="tryLogin()"
      />
    </section>
  `,
})
export class LoginComponent {
  login = inject(GOOGLE_LOGIN)
  router = inject(Router)

  tryLogin() {
    this.login()
      .then(() => this.router.navigate(['/']))
      .catch((err) => console.error(err))
  }
}
