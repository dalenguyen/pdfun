import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { User } from '@angular/fire/auth'
import { setDoc } from '@angular/fire/firestore'
import { ref, uploadBytesResumable } from '@angular/fire/storage'
import { TaskType, UploadedFile } from '@pdfun/domain'
import { BuyMeACoffeeComponent } from '@pdfun/ui/common'
import { nanoid } from 'nanoid'
import { ButtonModule } from 'primeng/button'
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload'
import { ToastModule } from 'primeng/toast'
import { DisclaimerComponent } from '../shared/components/disclaimer/disclaimer.component'
import { PdfHandlerBase } from '../shared/components/pdf-handler-base/pdf-handler-base.directive'
import { ShoutOutComponent } from '../shared/components/shout-out/shout-out.component'
import { getNextDays } from '../shared/utils'

@Component({
  selector: 'pdf-to-images',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ToastModule,
    ShoutOutComponent,
    FileUploadModule,
    BuyMeACoffeeComponent,
    DisclaimerComponent,
  ],
  template: `
    <p-toast />

    <h1 class="text-xl py-4">Convert your PDF file to Images</h1>

    <pdf-shout-out [type]="TaskType.IMAGE_CONVERSION" />

    <p-fileUpload
      mode="advanced"
      chooseLabel="Choose a PDF file"
      accept="application/pdf"
      name="myfile"
      maxFileSize="10000000"
      fileLimit="1"
      uploadLabel="Upload & Convert"
      (uploadHandler)="onUpload($event)"
      [customUpload]="true"
    />

    @if(loading()) {
    <p>Your file is uploaded and processing. Please wait for a moment ;)</p>
    } @if(errorMessage()) {
    <p class="text-red-500">{{ errorMessage() }}</p>
    } @if(downloadUrl$ | async; as downloadUrl) {

    <a class="block my-4 underline" [href]="downloadUrl" target="_blank"
      >Download Images</a
    >
    <lib-buy-me-a-coffee />
    }

    <pdf-disclaimer class="block mt-8" />
  `,
})
export default class PdfToImagesComponent extends PdfHandlerBase {
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
          taskType: TaskType.IMAGE_CONVERSION,
          // reset resize file name
          taskResponse: null,
          // Document will be deleted in 1 day
          expiresOn: getNextDays(),
        }

        await setDoc(this.docRef(), uploadFileData)
      } else {
        this.loading.set(false)
        this.errorMessage.set('Failed to upload file. Please try again later.')
      }
    }
  }
}
