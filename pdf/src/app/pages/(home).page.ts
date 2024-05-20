import { Component, inject, signal } from '@angular/core'
import {
  Storage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from '@angular/fire/storage'
import {
  Firestore,
  doc,
  docData,
  getDoc,
  setDoc,
} from '@angular/fire/firestore'
import { nanoid } from 'nanoid'
import { CommonModule } from '@angular/common'
import { EMPTY, filter, map, switchMap, tap } from 'rxjs'

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

    <br />
    <em class="my-4 block"
      >* Disclaimer: File uploaded is public accessible and will be deleted
      after one day. Please <strong>DO NOT</strong> upload sensitive
      documents.</em
    >

    <!-- <pre>{{ pdf$ | async | json }}</pre> -->

    @if(downloadUrl$ | async; as downloadUrl) {
    <a class="my-4" [href]="downloadUrl" target="_blank">Download PDF</a>
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

  downloadUrl$ = this.pdf$.pipe(
    filter((doc) => !!doc?.['fullPath']),
    switchMap((doc) => {
      return this.getPdfDownloadLink(doc?.['fullPath'])
    })
  )

  async uploadFile(input: HTMLInputElement) {
    if (!input.files) return

    const files: FileList = input.files

    // TODO: only limit 1 file for public release
    if (files.length > 1) return

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i)
      if (file) {
        const fileName = file.name.split('.').join(`-${String(Date.now())}.`)

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
            expiresOn: this.getNextDays(),
          })
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
      return EMPTY
    }
  }

  // TODO: move to util
  private getNextDays(currentDate = new Date(), daysToAdd = 1) {
    const nextDate = new Date(currentDate)
    nextDate.setDate(currentDate.getDate() + daysToAdd)
    return nextDate
  }
}
