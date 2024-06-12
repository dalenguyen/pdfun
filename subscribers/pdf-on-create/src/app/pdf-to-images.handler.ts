import { TaskResponse, UploadedFile } from '@pdfun/domain'
import {
  coverToImages,
  downloadFile,
  updateDocument,
  uploadFile,
} from '../services'

export const handlePDFToImages = async (
  uploadedFileData: UploadedFile,
  documentPath: string
) => {
  await downloadFile(uploadedFileData)

  const converted = coverToImages(uploadedFileData)

  const taskResponse: TaskResponse = {
    success: false,
    fileName: 'error',
  }

  if (converted.code === 0) {
    taskResponse.fileName = `${uploadedFileData.pdfId}.zip`
    taskResponse.success = true

    // only upload and save data when resize is success
    await uploadFile(uploadedFileData, taskResponse.fileName)
  } else {
    console.error(`Failed to covert file to images`)
  }

  await updateDocument(documentPath, {
    taskResponse,
  })
}
