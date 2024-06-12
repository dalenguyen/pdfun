import { computed, effect, inject, signal } from '@angular/core'
import { User } from '@angular/fire/auth'
import { Firestore, doc, docData } from '@angular/fire/firestore'
import { Storage, getDownloadURL, ref } from '@angular/fire/storage'
import { AuthService } from '@pdfun/angular/services'
import { Collections, TaskType, UploadedFile } from '@pdfun/domain'
import { nanoid } from 'nanoid'
import { FileUploadHandlerEvent } from 'primeng/fileupload'
import { EMPTY, Observable, filter, of, switchMap } from 'rxjs'

export abstract class PdfHandlerBase {
  protected authService = inject(AuthService)

  TaskType = TaskType

  currentFileSize = signal(0)
  newFileSize = signal(0)

  // TODO: move storage & firestore to separate services
  protected readonly storage: Storage = inject(Storage)
  private readonly firestore: Firestore = inject(Firestore)

  // set the initial value, but the it will be reset before file uploading
  protected currentID = signal(nanoid())

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

          return this.getDownloadLink(
            `${doc.filePath}/${doc.taskResponse?.fileName}`
          )
        })
      )
    })
  }

  // place holder
  async onUpload(event: FileUploadHandlerEvent) {
    //
  }

  async getDownloadLink(path: string) {
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
  protected generateFilePath(): string {
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
