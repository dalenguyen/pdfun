import { MarkdownComponent } from '@analogjs/content'
import { RouteMeta } from '@analogjs/router'
import { CommonModule } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import {
  Component,
  OnInit,
  WritableSignal,
  inject,
  input,
  model,
  signal,
} from '@angular/core'
import {
  DocumentReference,
  Firestore,
  doc,
  onSnapshot,
} from '@angular/fire/firestore'
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { UploadedFile } from '@pdfun/domain'
import { BuyMeACoffeeComponent } from '@pdfun/ui/common'
import { Assistant } from 'openai/resources/beta/assistants'
import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'
import { InputTextModule } from 'primeng/inputtext'
import { ProgressBarModule } from 'primeng/progressbar'
import { lastValueFrom } from 'rxjs'

export const routeMeta: RouteMeta = {
  title: 'PDFun - AI Chat',
}

@Component({
  standalone: true,
  template: `
    <h2>Chat with your PDF file</h2>
    <small class="block mb-6">{{ fileName }}</small>

    @if (loading()) {
      <p-progressBar mode="indeterminate" [style]="{ height: '6px' }" />
    }

    @let assistantId = assistant()?.id;
    @if (assistantId) {
      <section class="max-w-3xl m-auto">
        <div>
          <p-iconField iconPosition="right">
            <p-inputIcon
              styleClass="pi pi-search"
              class="cursor-pointer"
              (click)="sendChat(assistantId)"
            />

            <input
              type="text"
              class="w-full mb-2"
              pInputText
              [(ngModel)]="prompt"
              (keyup.enter)="sendChat(assistantId)"
              placeholder="Help me to summary the content"
            />
          </p-iconField>
        </div>

        <small class="italic block mb-6">
          You can start asking any questions that relate to your PDF file.
        </small>

        @if (responseLoading()) {
          <p-progressBar mode="indeterminate" [style]="{ height: '6px' }" />
        } @else {
          <analog-markdown [content]="response()" />
        }

        <lib-buy-me-a-coffee />
      </section>
    }
  `,
  imports: [
    CommonModule,
    FormsModule,
    ProgressBarModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
    MarkdownComponent,
    BuyMeACoffeeComponent,
  ],
})
export default class PDFChatDetailComponent implements OnInit {
  private router = inject(Router)
  private http = inject(HttpClient)

  pdfId = input.required()

  loading = signal(true)

  prompt = model('')

  responseLoading = signal(false)
  response = signal('')

  filePath =
    this.router.getCurrentNavigation()?.extras.state?.['filePath'] ?? 'public'
  fileName =
    this.router.getCurrentNavigation()?.extras.state?.['fileName'] || null

  private readonly firestore: Firestore = inject(Firestore)

  assistant: WritableSignal<undefined | Assistant> = signal(undefined)

  async ngOnInit(): Promise<void> {
    const docRef = doc(this.firestore, `${this.filePath}/${this.pdfId()}`)

    const unsubscribe = onSnapshot(
      docRef as DocumentReference<UploadedFile>,
      (doc) => {
        if (doc.data()?.assistant) {
          this.assistant.set(doc.data()?.assistant)
          this.loading.set(false)
          unsubscribe()
        }
      },
      (error: Error) => {
        this.response.set(error.message)
      },
    )
  }

  async sendChat(assistantId: string) {
    this.response.set('')

    if (this.prompt().trim() === '') return

    this.responseLoading.set(true)

    const result = await lastValueFrom(
      this.http.post<{ response: string }>('/api/v1/chat', {
        prompt: this.prompt(),
        assistantId,
      }),
    )

    this.responseLoading.set(false)
    this.prompt.set('')
    this.response.set(result.response)
  }
}
