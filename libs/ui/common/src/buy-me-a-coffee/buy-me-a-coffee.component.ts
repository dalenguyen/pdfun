import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'

@Component({
  selector: 'lib-buy-me-a-coffee',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="my-4 text-center">
      <a href="https://www.buymeacoffee.com/dalef" target="_blank"
        ><img
          src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png"
          alt="Buy Me A Coffee"
          style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;"
      /></a>
    </section>
  `,
})
export class BuyMeACoffeeComponent {}
