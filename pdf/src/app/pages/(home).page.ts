import { RouteMeta } from '@analogjs/router'
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
import { ByteSizeFormatter } from '../shared/pipes'
import { getNextDays } from '../shared/utils'

export const routeMeta: RouteMeta = {
  title: 'PDFun - Resize',
}

@Component({
  selector: 'pdf-home',
  standalone: true,
  template: `
    <p-toast />

    <div class="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 class="text-2xl font-semibold mb-4">Resize your PDF file</h1>

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
        class="mb-4"
      />

      @if(loading()) {
      <div class="flex items-center mb-4">
        <p>Your file is uploaded and processing. Please wait for a moment ;)</p>
      </div>
      } @if(errorMessage()) {
      <p class="text-red-500 mb-4">{{ errorMessage() }}</p>
      } @if(downloadUrl$ | async; as downloadUrl) {

      <!-- Compare file size -->
      @if(this.newFileSize() < this.currentFileSize()) {
      <p class="mb-4">
        Congratulations! Your file is reduced by
        <strong
          >{{
            this.currentFileSize() - this.newFileSize() | byteSizeFormatter
          }}!</strong
        >
      </p>
      }

      <div class="my-4 flex flex-col gap-4 items-center">
        <a
          [href]="downloadUrl"
          target="_blank"
          class="w-[180px] inline-flex justify-evenly items-center px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <i class="pi pi-download pr-2"></i>
          Download PDF
        </a>

        <lib-buy-me-a-coffee />
      </div>
      }

      <pdf-disclaimer class="mt-8" />
    </div>
  `,
  imports: [
    CommonModule,
    ButtonModule,
    FileUploadModule,
    ToastModule,
    BuyMeACoffeeComponent,
    ShoutOutComponent,
    DisclaimerComponent,
    ByteSizeFormatter,
  ],
})
export default class HomeComponent extends PdfHandlerBase {
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
          taskType: TaskType.RESIZE,
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
