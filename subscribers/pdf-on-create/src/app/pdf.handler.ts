import type { Request, Response } from 'express'
import {
  downloadFile,
  getDocument,
  resizeFile,
  updateDocument,
  uploadFile,
} from '../services'

export const handler = async (req: Request, res: Response) => {
  const documentPath = req.headers['ce-document'] as string

  if (!documentPath) {
    const msg = 'No valid path received'
    console.error(`error: ${msg}`)
    res.status(400).send(`Bad Request: ${msg}`)
    return
  }

  // /public/{publicId}
  // /users/{userId}/pdfs/{pdfId}
  console.log(`Start to get document ${documentPath}`)

  const uploadedFileData = await getDocument(documentPath)

  await downloadFile(uploadedFileData)

  const resized = resizeFile(uploadedFileData)

  let resizedFileName = 'error'

  if (resized.code === 0) {
    resizedFileName = `resized-${uploadedFileData.fileName}`

    // only upload and save data when resize is success
    await uploadFile(uploadedFileData.filePath, resizedFileName)
  } else {
    console.log(`Failed to resized file`)
  }

  await updateDocument(documentPath, {
    resizedFileName,
  })

  return res.json({ success: 'true' })
}
