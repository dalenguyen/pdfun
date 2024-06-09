import type { Request, Response } from 'express'
import { getDocument } from '../services'
import { addAnalytics } from './analytics.handler'
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

  // Prevent duplication events
  if (uploadedFileData.taskResponse?.fileName) {
    console.log(`Document is already processed!`)
    return res.json({ success: 'true' })
  }

  switch (uploadedFileData.taskType) {
    case 'RESIZE':
      await handlePDFResize(uploadedFileData, documentPath)
      await addAnalytics(uploadedFileData)
      break

    default:
      console.log(`${uploadedFileData.taskType} has no handler!`)
      break
  }

  console.log(`Finishing processing PDF file!`)

  return res.json({ success: 'true' })
}
