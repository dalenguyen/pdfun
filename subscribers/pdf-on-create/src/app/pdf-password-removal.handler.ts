import { TaskResponse, UploadedFile } from '@pdfun/domain'
import {
  downloadFile,
  removePassword,
  updateDocument,
  uploadFile,
} from '../services'

export const handlePDFPasswordRemoval = async (
  uploadedFileData: UploadedFile,
  documentPath: string
) => {
  await downloadFile(uploadedFileData)

  const removed = removePassword(uploadedFileData)

  const taskResponse: TaskResponse = {
    success: false,
    fileName: 'error',
  }

  if (removed.code === 0 && removed.stderr === '') {
    taskResponse.fileName = `${uploadedFileData.taskType}-${uploadedFileData.fileName}`
    taskResponse.success = true

    // only upload and save data when password removal is success
    await uploadFile(uploadedFileData, taskResponse.fileName)
  } else {
    // avoid showing original password message
    if (removed.stderr.includes('Password did not work')) {
      taskResponse.error = 'Error: Password did not work'
    } else {
      taskResponse.error =
        'Error: Failed to remove password. Please check your password'
    }

    console.error(`Failed to remove password. ${taskResponse.error}`)
  }

  await updateDocument(documentPath, {
    taskResponse,
    // remove password after processing
    password: null,
  })
}
