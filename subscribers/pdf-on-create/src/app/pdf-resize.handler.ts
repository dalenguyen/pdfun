import { FilePath, TaskResponse, UploadedFile } from '@pdfun/domain'
import { updateDocument } from '@pdfun/server/firebase'
import { downloadFile, getFileSize, resizeFile, uploadFile } from '../services'

export const handlePDFResize = async (
  uploadedFileData: UploadedFile,
  documentPath: string,
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

  const newFileSize = await getFileSize(
    `${FilePath.tmp}/${uploadedFileData.pdfId}/${uploadedFileData.taskType}-${uploadedFileData.fileName}`,
  )

  await updateDocument(documentPath, {
    taskResponse,
    newFileSize,
  })

  // TODO: clean up tmp folder
}
