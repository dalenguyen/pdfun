import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { FooterComponent } from './shared/components/footer/footer.component'
import { HeaderComponent } from './shared/components/header/header.component'
import { NewsletterComponent } from './shared/components/newsletter/newsletter.component'

@Component({
  selector: 'pdf-root',
  template: `
    <div class="flex flex-col min-h-screen">
      <pdf-header />
      <main class="m-8 container flex-1">
        <router-outlet></router-outlet>
      </main>
      <pdf-newsletter class="block w-96 mx-auto mt-20" />
      <pdf-footer />
    </div>
  `,
  imports: [
    RouterOutlet,
    NewsletterComponent,
    HeaderComponent,
    FooterComponent,
  ],
})
export class AppComponent {}
