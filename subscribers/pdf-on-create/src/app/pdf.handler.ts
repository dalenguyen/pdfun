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

  console.log(`Start to get document ${documentPath}`)

  const { fullPath, fileName } = await getDocument(documentPath)

  await downloadFile(fullPath, fileName)

  const resized = resizeFile(fileName)

  let resizedFileName = 'error'
  let resizedFullPath = 'error'

  if (resized.code === 0) {
    resizedFileName = `resized-${fileName}`
    resizedFullPath = `public/${resizedFileName}`

    // only upload and save data when resize is success
    await uploadFile(resizedFileName)
  } else {
    console.log(`Failed to resized file`)
  }

  await updateDocument(documentPath, {
    resizedFileName,
    resizedFullPath,
  })

  return res.json({ success: 'true' })
}
