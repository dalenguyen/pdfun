import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { AuthService } from '@pdfun/angular/services'
import { LoginComponent, ProfileComponent } from '@pdfun/ui/auth'

@Component({
  selector: 'pdf-header',
  standalone: true,
  imports: [CommonModule, LoginComponent, ProfileComponent],
  template: `
    <header class="m-8 flex justify-between items-center">
      <a class="flex items-center" href="#">
        <span class="text-900 font-medium text-2xl line-height-3 mr-8"
          >PDFun</span
        >
      </a>

      @defer (on timer(200ms)) {
      <div class="flex items-center gap-4">
        @if(authService.isLoggedIn()) {
        <lib-profile />
        } @else {
        <lib-login />
        }
      </div>
      }
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  authService = inject(AuthService)
}
