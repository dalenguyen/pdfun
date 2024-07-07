import { Analytic, UploadedFile } from '@pdfun/domain'
import { addDocument } from '@pdfun/firebase'

export const addAnalytics = async (uploadedFile: UploadedFile) => {
  await addDocument<Analytic>('analytics', {
    createdAt: new Date().toISOString(),
    type: uploadedFile.taskType,
    fileSize: uploadedFile.size,
    newFileSize: uploadedFile.newFileSize,
    user: uploadedFile.uid ?? 'anonymous',
  })
}
