import { Firestore } from '@google-cloud/firestore'

const db = new Firestore()

export const getDocument = async (path: string) => {
  const result = await db.doc(path).get()

  if (result.exists) {
    return result.data()
  }

  return null
}

export const updateDocument = async (path: string, data: object) => {
  return db.doc(path).update(data)
}
