// TODO: should be imported from @pdfun/firebase

import { Firestore } from '@google-cloud/firestore'
import { UploadedFile } from '@pdfun/domain'

const db = new Firestore({ ignoreUndefinedProperties: true })

export const getDocument = async (
  path: string,
): Promise<UploadedFile | null> => {
  const result = await db.doc(path).get()

  if (result.exists) {
    return result.data() as UploadedFile
  }

  return null
}

export const updateDocument = async (path: string, data: object) => {
  return db.doc(path).update(data)
}

export const addDocument = async <T>(path: string, data: T) => {
  return db.collection(path).add(data)
}
