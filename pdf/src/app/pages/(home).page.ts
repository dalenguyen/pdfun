import { Component } from '@angular/core';

import { AnalogWelcomeComponent } from './analog-welcome.component';

@Component({
  selector: 'pdf-home',
  standalone: true,
  imports: [AnalogWelcomeComponent],
  template: `
     <pdf-analog-welcome/>
  `,
})
export default class HomeComponent {
}
