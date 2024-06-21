import { RouteMeta } from '@analogjs/router'
import { CommonModule } from '@angular/common'
import { Component, model } from '@angular/core'
import { User } from '@angular/fire/auth'
import { setDoc } from '@angular/fire/firestore'
import { ref, uploadBytesResumable } from '@angular/fire/storage'
import { FormsModule } from '@angular/forms'
import { TaskType, UploadedFile } from '@pdfun/domain'
import { BuyMeACoffeeComponent } from '@pdfun/ui/common'
import { nanoid } from 'nanoid'
import { ButtonModule } from 'primeng/button'
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload'
import { FloatLabelModule } from 'primeng/floatlabel'
import { PasswordModule } from 'primeng/password'
import { ToastModule } from 'primeng/toast'
import { DisclaimerComponent } from '../shared/components/disclaimer/disclaimer.component'
import { PdfHandlerBase } from '../shared/components/pdf-handler-base/pdf-handler-base.directive'
import { ShoutOutComponent } from '../shared/components/shout-out/shout-out.component'
import { getNextDays } from '../shared/utils'

export const routeMeta: RouteMeta = {
  title: 'PDFun - Password Removal',
}

@Component({
  selector: 'pdf-password-removal',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ToastModule,
    ShoutOutComponent,
    FileUploadModule,
    BuyMeACoffeeComponent,
    DisclaimerComponent,
    PasswordModule,
    FormsModule,
    FloatLabelModule,
  ],
  template: `
    <p-toast />

    <div class="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 class="text-2xl font-semibold mb-4">PDF password removal</h1>
      <em
        >*Remove existing PDF's password! Not <strong>CRACK</strong> your PDF
        password.</em
      >

      <pdf-shout-out [type]="TaskType.PASSWORD_REMOVAL" />

      <p-floatLabel class="block my-8">
        <p-password
          styleClass="w-full"
          [inputStyle]="{ width: '100%' }"
          [(ngModel)]="password"
          [feedback]="false"
        />
        <label for="password">Enter your PDF's Password</label>
      </p-floatLabel>

      <p-fileUpload
        *ngIf="this.password() && this.password().length > 0"
        mode="advanced"
        chooseLabel="Choose a PDF file"
        accept="application/pdf"
        name="myfile"
        maxFileSize="10000000"
        fileLimit="1"
        uploadLabel="Upload & Remove Password"
        (uploadHandler)="onUpload($event)"
        [customUpload]="true"
        class="mb-4"
      />

      @if(loading()) {
      <div class="flex items-center my-4">
        <div class="mr-2">
          <i class="fa fa-spinner fa-spin text-blue-500"></i>
        </div>
        <span
          >Your file is uploaded and processing. Please wait for a moment.</span
        >
      </div>
      } @if(errorMessage()) {
      <p class="text-red-500 mb-4">{{ errorMessage() }}</p>
      } @if(downloadUrl$ | async; as downloadUrl) {

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
})
export default class PdfPasswordRemovalComponent extends PdfHandlerBase {
  password = model('')

  override async onUpload(event: FileUploadHandlerEvent) {
    this.errorMessage.set('')

    if (!this.password() || this.password()?.trim().length === 0) {
      this.errorMessage.set('You need to enter your PDF password!')
      return
    }

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
          taskType: TaskType.PASSWORD_REMOVAL,
          password: this.password(),
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
