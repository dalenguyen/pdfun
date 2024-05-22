import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { NewsletterComponent } from './shared/components/newsletter/newsletter.component'

@Component({
  selector: 'pdf-root',
  standalone: true,
  imports: [RouterOutlet, NewsletterComponent],
  template: `
    <main class="m-8">
      <router-outlet></router-outlet>
    </main>
    <pdf-newsletter class="block m-8" />
  `,
})
export class AppComponent {}
