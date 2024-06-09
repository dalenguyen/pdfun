import { RouteMeta } from '@analogjs/router'
import { CommonModule } from '@angular/common'
import { Component, computed, effect, inject, signal } from '@angular/core'
import { User } from '@angular/fire/auth'
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore'
import {
  Storage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from '@angular/fire/storage'
import { AuthService } from '@pdfun/angular/services'
import { Collections, TaskType, UploadedFile } from '@pdfun/domain'
import { BuyMeACoffeeComponent } from '@pdfun/ui/common'
import { nanoid } from 'nanoid'
import { Message, MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload'
import { MessagesModule } from 'primeng/messages'
import { ToastModule } from 'primeng/toast'
import { EMPTY, Observable, filter, of, switchMap } from 'rxjs'
import { ShoutOutComponent } from '../shared/components/shout-out/shout-out.component'
import { getNextDays } from '../shared/utils'

export const routeMeta: RouteMeta = {
  title: 'PDFun - Resize',
}

@Component({
  selector: 'pdf-home',
  standalone: true,
  providers: [MessageService],
  template: `
    <p-toast />

    <h1 class="text-xl py-4">Upload your PDF file for resizing purpose</h1>

    <pdf-shout-out [type]="TaskType.RESIZE" />

    <p-fileUpload
      mode="advanced"
      chooseLabel="Choose a PDF file"
      accept="application/pdf"
      name="myfile"
      maxFileSize="10000000"
      fileLimit="1"
      uploadLabel="Upload & Resize"
      (uploadHandler)="onUpload($event)"
      [customUpload]="true"
    />

    @if(loading()) {
    <p>Your file is uploaded and processing. Please wait for a moment ;)</p>
    } @if(errorMessage()) {
    <p class="text-red-500">{{ errorMessage() }}</p>
    } @if(downloadUrl$ | async; as downloadUrl) {

    <!-- Compare file size -->
    @if(this.newFileSize() > this.currentFileSize()) {
    <p>
      Congratulations! Your file is reduced by
      {{ this.newFileSize() - this.currentFileSize() }} bytes!
    </p>
    }

    <a class="block my-4 underline" [href]="downloadUrl" target="_blank"
      >Download PDF</a
    >
    <lib-buy-me-a-coffee />
    }

    <br />

    @if(authService.isLoggedIn() === false) {
    <p-messages
      [(value)]="messages"
      [enableService]="false"
      [closable]="false"
    />
    <em class="my-4 block"
      >* Disclaimer: File uploaded is public accessible for people with some
      skills and will be deleted after one day. Please
      <strong>DO NOT</strong> upload sensitive documents. Stay updated for more
      features.</em
    >
    } @else {
    <em class="my-4 block"
      >* Note: Thanks for logging in. Your files are secured and will be deleted
      in 1 day!</em
    >
    }
  `,
  imports: [
    CommonModule,
    ButtonModule,
    FileUploadModule,
    ToastModule,
    MessagesModule,
    BuyMeACoffeeComponent,
    ShoutOutComponent,
  ],
})
export default class HomeComponent {
  private messageService = inject(MessageService)
  authService = inject(AuthService)

  TaskType = TaskType

  currentFileSize = signal(0)
  newFileSize = signal(0)

  messages: Message[] = [
    {
      severity: 'info',
      detail: 'Please Log In if you want to secure your uploaded files!',
    },
  ]

  // TODO: move storage & firestore to separate services
  private readonly storage: Storage = inject(Storage)
  private readonly firestore: Firestore = inject(Firestore)

  // set the initial value, but the it will be reset before file uploading
  private currentID = signal(nanoid())

  docRef = computed(() => {
    return doc(this.firestore, `${this.generateFilePath()}/${this.currentID()}`)
  })

  pdf = computed(() => {
    return docData(this.docRef()) as Observable<UploadedFile>
  })

  loading = signal(false)
  errorMessage = signal('')

  downloadUrl$: Observable<string | Observable<never> | null> = of(null)

  // Make sure that the downloadURL will be trigger correctly locally
  constructor() {
    effect(() => {
      this.downloadUrl$ = this.pdf().pipe(
        filter((doc) => Object.keys(doc?.taskResponse ?? {}).length > 0),
        switchMap((doc) => {
          this.loading.set(false)

          if (doc.taskResponse?.success === false) {
            this.errorMessage.set(
              `Error in resizing PDF file. Please try it again.`
            )
            return of(null)
          }

          if (doc.newFileSize) {
            this.newFileSize.set(doc.newFileSize)
          }

          return this.getPdfDownloadLink(
            `${doc.filePath}/${doc.taskResponse?.fileName}`
          )
        })
      )
    })
  }

  async onUpload(event: FileUploadHandlerEvent) {
    // set a new document Id if users want to retry without reloading the page
    this.currentID.set(nanoid())

    const file = event.files[0]

    if (file) {
      this.loading.set(true)

      // having default naming convention pdf-124551515.pdf
      // to prevent empty space to cause issue when resizing
      const fileName = `pdfun-${String(Date.now())}.pdf`

      const storageRef = ref(
        this.storage,
        `${this.generateFilePath()}/${fileName}`
      )
      const result = await uploadBytesResumable(storageRef, file)
      const { uid = 'anonymous' } =
        (this.authService.userProfile() as User) ?? {}

      this.currentFileSize.set(result.metadata.size)

      if (result.state === 'success') {
        const uploadFileData: UploadedFile = {
          fileName,
          contentType: result.metadata.contentType,
          filePath: this.generateFilePath(),
          size: result.metadata.size,
          createdAt: new Date().toISOString(),
          updatedAt: result.metadata.updated,
          pdfId: this.currentID(),
          uid,
          taskType: TaskType.RESIZE,
          // reset resize file name
          taskResponse: null,
          // Document will be deleted in 1 day
          expiresOn: getNextDays(),
        }

        await setDoc(this.docRef(), uploadFileData)

        this.messageService.add({
          severity: 'info',
          summary: 'File Uploaded',
          detail: '',
        })
      } else {
        this.loading.set(false)
        this.errorMessage.set('Failed to upload file. Please try again later.')
      }
    }
  }

  async getPdfDownloadLink(path: string) {
    try {
      const fileRef = ref(this.storage, path)
      return getDownloadURL(fileRef)
    } catch (error) {
      console.error(error)
      this.errorMessage.set((error as Error).message)
      return EMPTY
    }
  }

  // file path also apply to firestore & storage
  private generateFilePath(): string {
    if (
      this.authService.isLoggedIn() &&
      this.authService.userProfile() !== null
    ) {
      const { uid } = this.authService.userProfile() as User
      return `${Collections.users}/${uid}/${Collections.pdfs}`
    }

    return Collections.public
  }
}
