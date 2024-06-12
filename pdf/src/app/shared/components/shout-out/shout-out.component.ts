import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core'
import { AnalyticsService } from '@pdfun/angular/services'
import { TaskType } from '@pdfun/domain'
import { MessagesModule } from 'primeng/messages'

@Component({
  selector: 'pdf-shout-out',
  standalone: true,
  imports: [CommonModule, MessagesModule],
  template: `
    @if (messages() | async; as messages) {
    <p-messages [value]="messages" [closable]="false" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShoutOutComponent {
  private analyticsService = inject(AnalyticsService)

  type = input.required<TaskType>()

  messages = computed(async () => {
    const count = await this.analyticsService.getCountByTaskType(this.type())
    return [
      {
        severity: 'success',
        detail: `${count} PDF files were processed using PDFun!`,
      },
    ]
  })
}
