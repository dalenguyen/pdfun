import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'pdf-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="mx-8 float-right">
      <a
        href="https://github.com/dalenguyen/pdfun"
        class="underline"
        target="_blank"
        >Github</a
      >
    </header>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}
