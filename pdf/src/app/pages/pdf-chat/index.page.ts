import { RouteMeta } from '@analogjs/router'
import { CommonModule } from '@angular/common'
import { Component, inject, signal, WritableSignal } from '@angular/core'
import { User } from '@angular/fire/auth'
import { setDoc } from '@angular/fire/firestore'
import { ref, uploadBytesResumable } from '@angular/fire/storage'
import { Router } from '@angular/router'
import { TaskType, UploadedFile } from '@pdfun/domain'
import { BuyMeACoffeeComponent } from '@pdfun/ui/common'
import { nanoid } from 'nanoid'
import { ButtonModule } from 'primeng/button'
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload'
import { ProgressBarModule } from 'primeng/progressbar'
import { ToastModule } from 'primeng/toast'
import { DisclaimerComponent } from '../../shared/components/disclaimer/disclaimer.component'
import { PdfHandlerBase } from '../../shared/components/pdf-handler-base/pdf-handler-base.directive'
import { ShoutOutComponent } from '../../shared/components/shout-out/shout-out.component'
import { getNextDays } from '../../shared/utils'

export const routeMeta: RouteMeta = {
  title: 'PDFun - AI Chat',
}

@Component({
  selector: 'pdf-chat',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ToastModule,
    ShoutOutComponent,
    FileUploadModule,
    BuyMeACoffeeComponent,
    DisclaimerComponent,
    ProgressBarModule,
  ],
  template: `
    <p-toast />

    <pdf-shout-out [type]="TaskType.PDF_CHAT" />

    <p-fileUpload
      mode="advanced"
      chooseLabel="Choose a PDF file"
      accept="application/pdf"
      name="myfile"
      maxFileSize="5000000"
      fileLimit="1"
      uploadLabel="Upload & Chat"
      (uploadHandler)="onUpload($event)"
      [customUpload]="true"
      class="mb-4"
    />

    @if (loading()) {
      <p-progressBar mode="indeterminate" [style]="{ height: '6px' }" />
    }

    <pdf-disclaimer class="mt-8" />
  `,
})
export default class PdfChatComponent extends PdfHandlerBase {
  private router = inject(Router)
  override allowDownloadFile: WritableSignal<boolean> = signal(false)

  override async onUpload(event: FileUploadHandlerEvent) {
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
        `${this.generateFilePath()}/${fileName}`,
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
          taskType: TaskType.PDF_CHAT,
          // reset resize file name
          taskResponse: null,
          // Document will be deleted in 1 day
          expiresOn: getNextDays(),
        }

        await setDoc(this.docRef(), uploadFileData)

        this.router.navigate([`pdf-chat/${this.currentID()}`], {
          state: {
            filePath: this.generateFilePath(),
            fileName: file.name,
          },
        })
      } else {
        this.loading.set(false)
        this.errorMessage.set('Failed to upload file. Please try again later.')
      }
    }
  }
}
