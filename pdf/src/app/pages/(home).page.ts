import { CommonModule } from '@angular/common'
import { Component, inject, signal } from '@angular/core'
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore'
import {
  Storage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from '@angular/fire/storage'
import { nanoid } from 'nanoid'
import { EMPTY, filter, switchMap } from 'rxjs'
import { bytesToMegaBytes, getNextDays } from '../shared/utils'

@Component({
  selector: 'pdf-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1 class="text-xl py-4">Upload your PDF file for resizing purpose</h1>
    <label for="fileUpload">Choose a File</label>
    <br />
    <input id="fileUpload" type="file" #upload accept="application/pdf" />
    <br />
    <button class="bg-blue-500 p-2 my-4" (click)="uploadFile(upload)">
      Upload
    </button>

    <!-- TODO: add loading stating -->

    @if(loading()) {
      <p>File is processing, please wait for a moment :)</p>
    }

    @if(errorMessage()) {
      <p class="text-red-500">{{errorMessage()}}</p>
    }

    <br />
    <em class="my-4 block"
      >* Disclaimer: File uploaded is public accessible and will be deleted
      after one day. Please <strong>DO NOT</strong> upload sensitive
      documents.</em
    >

    <!-- <pre>{{ pdf$ | async | json }}</pre> -->

    @if(downloadUrl$ | async; as downloadUrl) {
    <a class="my-4 underline" [href]="downloadUrl" target="_blank">Download PDF</a>
    }
  `,
})
export default class HomeComponent {
  // TODO: move storage & firestore to separate services
  private readonly storage: Storage = inject(Storage)
  private readonly firestore: Firestore = inject(Firestore)
  private currentID = nanoid()

  docRef = doc(this.firestore, `public/${this.currentID}`)
  pdf$ = docData(this.docRef)

  loading = signal(false)
  errorMessage = signal('')

  downloadUrl$ = this.pdf$.pipe(
    filter((doc) => !!doc?.['resizedFullPath']),
    switchMap((doc) => {
      // TODO: add error handling where `resizedFullPath` will have `error` as the value where the resize process failed
      this.loading.set(false)
      return this.getPdfDownloadLink(doc?.['resizedFullPath'])
    })
  )

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
          this.errorMessage.set('File size is greater than 10MB. Please try another one!')
          return
        }

        // having default naming convention pdf-124551515.pdf
        // to prevent empty space to cause issue when resizing
        const fileName = `pdfun-${String(Date.now())}.pdf`

        const storageRef = ref(this.storage, `public/${fileName}`)
        const result = await uploadBytesResumable(storageRef, file)

        if (result.state === 'success') {
          // TODO: override the next data if user doesn't refresh the page
          const dbRef = doc(this.firestore, `public/${this.currentID}`)

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
          this.errorMessage.set('Failed to upload file. Please try again later.')
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
}
