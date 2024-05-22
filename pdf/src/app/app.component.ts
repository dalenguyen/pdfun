import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { NewsletterComponent } from './shared/components/newsletter/newsletter.component'
import { HeaderComponent } from './shared/components/header/header.component'

@Component({
  selector: 'pdf-root',
  standalone: true,
  imports: [RouterOutlet, NewsletterComponent, HeaderComponent],
  template: `
    <pdf-header />
    <main class="m-8">
      <router-outlet></router-outlet>
    </main>
    <pdf-newsletter class="block max-w-96 m-auto" />
  `,
})
export class AppComponent {}
