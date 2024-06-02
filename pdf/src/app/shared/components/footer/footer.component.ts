import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'

@Component({
  selector: 'pdf-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="p-8 bg-gray-100 flex justify-between items-center">
      <p>PDFun © 2024</p>
      <a
        href="https://github.com/dalenguyen/pdfun"
        class="underline"
        target="_blank"
        >Github</a
      >
    </footer>
  `,
})
export class FooterComponent {}
