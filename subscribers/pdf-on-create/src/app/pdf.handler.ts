import type { Request, Response } from 'express'
import { getDocument } from '../services'
import { handlePDFResize } from './pdf-resize.handler'

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

  switch (uploadedFileData.taskType) {
    case 'RESIZE':
      await handlePDFResize(uploadedFileData, documentPath)
      break

    default:
      console.log(`${uploadedFileData.taskType} has no handler!`)
      break
  }

  return res.json({ success: 'true' })
}
