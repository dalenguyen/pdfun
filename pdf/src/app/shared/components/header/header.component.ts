import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'pdf-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="m-8 flex justify-end">
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
