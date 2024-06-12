import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { RouterLinkWithHref } from '@angular/router'
import { AuthService } from '@pdfun/angular/services'
import { LoginComponent, ProfileComponent } from '@pdfun/ui/auth'

@Component({
  selector: 'pdf-header',
  standalone: true,
  imports: [CommonModule, LoginComponent, ProfileComponent, RouterLinkWithHref],
  template: `
    <!-- REPLACE With PrimeNG Menubar -->
    <header class="m-8 flex justify-between items-center flex-wrap">
      <a class="flex items-center" routerLink="/">
        <img src="/assets/pdfun.png" alt="PDFun logo" class="w-10" />
      </a>

      <div class="flex gap-2">
        <ul class="flex gap-2 list-none">
          <li>
            <a
              class="no-underline text-black hover:text-blue-800 hover:underline"
              routerLink="/"
              >Resize PDF</a
            >
          </li>
          <li>
            <a
              class="no-underline text-black hover:text-blue-800 hover:underline"
              routerLink="/pdf-to-images"
              >PDF to Images</a
            >
          </li>
        </ul>

        @defer (on timer(200ms)) {
        <div class="flex items-center gap-4">
          @if(authService.isLoggedIn()) {
          <lib-profile />
          } @else {
          <lib-login />
          }
        </div>
        }
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  authService = inject(AuthService)
}
