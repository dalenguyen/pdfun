import { RouteMeta } from '@analogjs/router'
import { CommonModule } from '@angular/common'
import { Component, inject, signal } from '@angular/core'
import { User } from '@angular/fire/auth'
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore'
import {
  Storage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from '@angular/fire/storage'
import { AuthService } from '@pdfun/angular/services'
import { Collections, UploadedFile } from '@pdfun/domain'
import { nanoid } from 'nanoid'
import { Message, MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload'
import { MessagesModule } from 'primeng/messages'
import { ToastModule } from 'primeng/toast'
import { EMPTY, Observable, filter, of, switchMap } from 'rxjs'
import { bytesToMegaBytes, getNextDays } from '../shared/utils'

export const routeMeta: RouteMeta = {
  title: 'PDFun - Resize',
}

@Component({
  selector: 'pdf-home',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    FileUploadModule,
    ToastModule,
    MessagesModule,
  ],
  providers: [MessageService],
  template: `
    <p-toast />

    <h1 class="text-xl py-4">Upload your PDF file for resizing purpose</h1>

    <p-fileUpload
      mode="advanced"
      chooseLabel="Choose a PDF file"
      accept="application/pdf"
      name="myfile"
      maxFileSize="10000000"
      fileLimit="1"
      (uploadHandler)="onUpload($event)"
      [customUpload]="true"
    />

    @if(loading()) {
    <p>Your file is uploaded and processing. Please wait for a moment ;)</p>
    } @if(errorMessage()) {
    <p class="text-red-500">{{ errorMessage() }}</p>
    } @if(downloadUrl$ | async; as downloadUrl) {
    <a class="block my-4 underline" [href]="downloadUrl" target="_blank"
      >Download PDF</a
    >
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
})
export default class HomeComponent {
  private messageService = inject(MessageService)
  authService = inject(AuthService)

  messages: Message[] = [
    {
      severity: 'info',
      detail: 'Please Log In if you want to secure your uploaded files!',
    },
  ]

  // TODO: move storage & firestore to separate services
  private readonly storage: Storage = inject(Storage)
  private readonly firestore: Firestore = inject(Firestore)
  private currentID = nanoid()

  docRef = doc(this.firestore, `${this.generateFilePath()}/${this.currentID}`)
  pdf$ = docData(this.docRef) as Observable<UploadedFile>

  loading = signal(false)
  errorMessage = signal('')

  downloadUrl$ = this.pdf$.pipe(
    filter((doc) => !!doc?.resizedFileName),
    switchMap((doc) => {
      // TODO: add error handling where `resizedFullPath` will have `error` as the value where the resize process failed
      this.loading.set(false)

      if (doc.resizedFileName === 'error') {
        this.errorMessage.set(
          `Error in resizing PDF file. Please try it again.`
        )
        return of(null)
      }

      return this.getPdfDownloadLink(`${doc.filePath}/${doc.resizedFileName}`)
    })
  )

  async onUpload(event: FileUploadHandlerEvent) {
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

      if (result.state === 'success') {
        // TODO: override the next data if user doesn't refresh the page
        const docRef = doc(
          this.firestore,
          `${this.generateFilePath()}/${this.currentID}`
        )

        const uploadFileData: UploadedFile = {
          fileName,
          contentType: result.metadata.contentType,
          filePath: this.generateFilePath(),
          size: result.metadata.size,
          createdAt: new Date().toISOString(),
          updatedAt: result.metadata.updated,
          // Document will be deleted in 1 day
          expiresOn: getNextDays(),
        }

        await setDoc(docRef, uploadFileData)

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

  async uploadFile(input: HTMLInputElement) {
    if (!input.files) return

    const files: FileList = input.files

    // TODO: only limit 1 file for public release
    if (files.length !== 1) return

    this.loading.set(true)
    this.errorMessage.set('')

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i)
      if (file) {
        const fileSize = bytesToMegaBytes(file.size)

        console.log({ fileSize })

        if (fileSize > 10) {
          this.loading.set(false)
          this.errorMessage.set(
            'File size is greater than 10MB. Please try another one!'
          )
          return
        }

        // having default naming convention pdf-124551515.pdf
        // to prevent empty space to cause issue when resizing
        const fileName = `pdfun-${String(Date.now())}.pdf`

        const storageRef = ref(
          this.storage,
          `${this.generateFilePath()}/${fileName}`
        )
        const result = await uploadBytesResumable(storageRef, file)

        if (result.state === 'success') {
          // TODO: override the next data if user doesn't refresh the page
          const dbRef = doc(
            this.firestore,
            `${this.generateFilePath()}/${this.currentID}`
          )

          await setDoc(dbRef, {
            fileName,
            contentType: result.metadata.contentType,
            fullPath: result.metadata.fullPath,
            // ref: result.ref,
            size: result.metadata.size,
            createdAt: new Date().toISOString(),
            updatedAt: result.metadata.updated,
            // Document will be deleted in 1 day
            expiresOn: getNextDays(),
          })
        } else {
          this.loading.set(false)
          this.errorMessage.set(
            'Failed to upload file. Please try again later.'
          )
        }
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
