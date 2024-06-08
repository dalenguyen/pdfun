import { TaskResponse, UploadedFile } from '@pdfun/domain'
import {
  downloadFile,
  resizeFile,
  updateDocument,
  uploadFile,
} from '../services'

export const handlePDFResize = async (
  uploadedFileData: UploadedFile,
  documentPath: string
) => {
  await downloadFile(uploadedFileData)

  const resized = resizeFile(uploadedFileData)

  const taskResponse: TaskResponse = {
    success: false,
    fileName: 'error',
  }

  if (resized.code === 0) {
    taskResponse.fileName = `${uploadedFileData.taskType}-${uploadedFileData.fileName}`
    taskResponse.success = true

    // only upload and save data when resize is success
    await uploadFile(uploadedFileData, taskResponse.fileName)
  } else {
    console.error(`Failed to resized file`)
  }

  await updateDocument(documentPath, {
    taskResponse,
  })

  // TODO: clean up tmp folder
}
