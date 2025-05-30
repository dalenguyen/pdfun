import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core'
import { RouterLinkActive, RouterLinkWithHref } from '@angular/router'
import { AuthService } from '@pdfun/angular/services'
import { LoginComponent, ProfileComponent } from '@pdfun/ui/auth'

@Component({
  selector: 'pdf-header',
  imports: [
    CommonModule,
    LoginComponent,
    ProfileComponent,
    RouterLinkWithHref,
    RouterLinkActive,
  ],
  template: `
    <!-- REPLACE With PrimeNG Menubar -->
    <header class="bg-gray-800 py-4 px-6">
      <div
        class="container mx-auto flex items-center justify-between flex-wrap"
      >
        <div class="flex items-center">
          <a
            class="md:hidden text-gray-400 hover:text-white focus:outline-none  mr-2"
            (click)="toggleMobileMenu()"
          >
            <i class="pi pi-bars pi-lg"></i>
          </a>
          <a routerLink="/" class="flex items-center mr-6">
            <img src="/assets/pdfun.png" alt="PDFun logo" class="h-8 mr-2" />
            <span class="text-white font-semibold text-lg">PDFun</span>
          </a>
          <nav class="hidden md:block">
            <div class="flex gap-4">
              <a
                routerLink="/"
                [routerLinkActiveOptions]="{ exact: true }"
                routerLinkActive="active"
                class="link"
              >
                Resize
              </a>
              <a
                routerLink="/pdf-chat"
                [routerLinkActiveOptions]="{ exact: true }"
                routerLinkActive="active"
                class="link"
              >
                AI Chat
              </a>
              <a
                routerLink="/pdf-to-images"
                routerLinkActive="active"
                class="link"
              >
                Images Conversion
              </a>
              <a
                routerLink="/pdf-password-removal"
                routerLinkActive="active"
                class="link"
              >
                Password Removal
              </a>
              <a
                routerLink="/pdf-to-podcast"
                routerLinkActive="active"
                class="link"
              >
                Podcast
              </a>
            </div>
          </nav>
        </div>
        <div class="flex items-center">
          @defer (on timer(200ms)) {
            <div class="flex items-center gap-4">
              @if (authService.isLoggedIn()) {
                <lib-profile />
              } @else {
                <lib-login />
              }
            </div>
          }
        </div>
      </div>
      <div
        class="md:hidden bg-gray-700 p-4 mt-4"
        [ngClass]="{ hidden: !showMobileMenu() }"
      >
        <div class="flex flex-col gap-4">
          <a
            routerLink="/"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            class="link"
            (click)="toggleMobileMenu()"
          >
            Resize
          </a>

          <a
            routerLink="/pdf-chat"
            [routerLinkActiveOptions]="{ exact: true }"
            routerLinkActive="active"
            class="link"
          >
            AI Chat
          </a>

          <a
            routerLink="/pdf-to-images"
            routerLinkActive="active"
            class="link"
            (click)="toggleMobileMenu()"
            >Images Conversion
          </a>
          <a
            routerLink="/pdf-password-removal"
            routerLinkActive="active"
            class="link"
            (click)="toggleMobileMenu()"
          >
            Password Removal
          </a>
          <a
            routerLink="/pdf-to-podcast"
            routerLinkActive="active"
            class="link"
            (click)="toggleMobileMenu()"
          >
            Podcast
          </a>
        </div>
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  authService = inject(AuthService)
  showMobileMenu = signal(false)

  toggleMobileMenu() {
    this.showMobileMenu.update((value) => !value)
  }
}
