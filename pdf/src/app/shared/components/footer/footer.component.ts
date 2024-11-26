import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'pdf-footer',
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="bg-gray-800 py-4">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center">
          <a routerLink="/" class="flex items-center mr-6 no-underline">
            <img src="/assets/pdfun.png" alt="PDFun logo" class="h-8 mr-2" />
            <span class="text-white font-semibold text-lg">PDFun</span>
          </a>
          <p class="text-gray-400">&copy; 2024</p>
        </div>
        <a
          href="https://github.com/dalenguyen/pdfun"
          class="text-gray-400 hover:text-white transition-colors duration-300"
          target="_blank"
          aria-label="GitHub"
        >
          <i class="pi pi-github" style="font-size: 1.5rem"></i>
        </a>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
