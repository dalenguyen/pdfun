import { RouteMeta } from '@analogjs/router'
import { CommonModule } from '@angular/common'
import {
  Component,
  OnDestroy,
  OnInit,
  WritableSignal,
  inject,
  input,
  signal,
} from '@angular/core'
import {
  DocumentReference,
  Firestore,
  Unsubscribe,
  doc,
  onSnapshot,
} from '@angular/fire/firestore'
import { Storage, getDownloadURL, ref } from '@angular/fire/storage'
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { UploadedFile } from '@pdfun/domain'
import { BuyMeACoffeeComponent } from '@pdfun/ui/common'
import { ButtonModule } from 'primeng/button'
import { CardModule } from 'primeng/card'
import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'
import { InputTextModule } from 'primeng/inputtext'
import { ProgressBarModule } from 'primeng/progressbar'
import { DisclaimerComponent } from '../../shared/components/disclaimer/disclaimer.component'

export const routeMeta: RouteMeta = {
  title: 'PDFun - PDF to Podcast',
}

@Component({
  template: `
    <div class="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <div class="flex items-center gap-4 mb-6">
        <p-button
          icon="pi pi-arrow-left"
          label="Back to Upload"
          (onClick)="router.navigate(['/pdf-to-podcast'])"
          styleClass="p-button-text"
        />
        <div>
          <h2 class="m-0">Convert PDF to Podcast</h2>
          <small class="block">{{ fileName }}</small>
        </div>
      </div>

      @if (loading()) {
        <p-progressBar [mode]="'indeterminate'" [style]="{ height: '6px' }" />
      }
      @if (pdf(); as pdfData) {
        <p-card>
          <ng-template pTemplate="header">
            <div class="p-4">
              <h2 class="text-xl font-bold mb-4">Your Podcast</h2>
              @if (pdfData.taskResponse?.status === 'completed') {
                <div class="flex flex-col gap-4">
                  <audio controls class="w-full" [src]="audioUrl()">
                    Your browser does not support the audio element.
                  </audio>
                </div>
              } @else if (pdfData.taskResponse?.status === 'failed') {
                <div class="text-red-500">
                  Failed to convert PDF to podcast. Please try again.
                </div>
              } @else {
                <div class="text-gray-500">
                  Converting your PDF to podcast... This may take a few minutes.
                </div>
              }
            </div>
          </ng-template>
        </p-card>

        <div class="my-4 flex flex-col gap-4 items-center">
          <lib-buy-me-a-coffee />
        </div>
      }

      <pdf-disclaimer class="mt-8" />
    </div>
  `,
  imports: [
    CommonModule,
    FormsModule,
    ProgressBarModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
    BuyMeACoffeeComponent,
    CardModule,
    ButtonModule,
    DisclaimerComponent,
  ],
})
export default class PDFToPodcastDetailComponent implements OnInit, OnDestroy {
  protected readonly router = inject(Router)
  private readonly firestore: Firestore = inject(Firestore)
  private readonly storage: Storage = inject(Storage)

  pdfId = input.required()

  filePath =
    this.router.getCurrentNavigation()?.extras.state?.['filePath'] ?? 'public'
  fileName =
    this.router.getCurrentNavigation()?.extras.state?.['fileName'] || null

  private unsubscribe: Unsubscribe | undefined

  loading = signal(true)
  audioUrl = signal<string>('')

  pdf: WritableSignal<undefined | UploadedFile> = signal(undefined)

  async ngOnInit(): Promise<void> {
    const docRef = doc(this.firestore, `${this.filePath}/${this.pdfId()}`)
    // For testing purpose
    // const docRef = doc(
    //   this.firestore,
    //   `/users/nlgVHzrp98NiU7sBwjXDFwGJaPn1/pdfs/LbnWn88il6d2tU6E0Pn1t`,
    // )

    this.unsubscribe = onSnapshot(
      docRef as DocumentReference<UploadedFile>,
      async (doc) => {
        if (doc.exists()) {
          this.pdf.set(doc.data())
          await this.retrieveAudioUrl()
          this.loading.set(false)
        }
      },
      (error: Error) => {
        console.error('Error fetching document:', error)
      },
    )
  }

  ngOnDestroy(): void {
    this.unsubscribe?.()
  }

  async retrieveAudioUrl() {
    const pdfData = this.pdf()
    if (!pdfData?.taskResponse?.fileName) return

    const fileRef = ref(this.storage, pdfData.taskResponse.fileName)
    const url = await getDownloadURL(fileRef)
    this.audioUrl.set(url)
  }
}
