import { Storage } from '@google-cloud/storage'
import { FilePath, UploadedFile } from '@pdfun/domain'

const storage = new Storage()

// The ID of your GCS bucket
const bucketName = 'pdfun-prod.appspot.com'

export const downloadFile = async (uploadedFileData: UploadedFile) => {
  const { fileName, filePath } = uploadedFileData

  const fullPath = `${filePath}/${fileName}`

  const options = {
    destination: `${FilePath.tmp}/${fileName}`,
  }

  try {
    // Downloads the file
    await storage.bucket(bucketName).file(fullPath).download(options)

    console.log(
      `gs://${bucketName}/${fullPath} downloaded to ${`${FilePath.tmp}/${fileName}`}.`
    )

    return `${FilePath.tmp}/${fileName}`
  } catch (error) {
    throw new Error(error)
  }
}

export const uploadFile = async (filePath: string, fileName: string) => {
  const options = {
    destination: `${filePath}/${fileName}`,
  }

  await storage
    .bucket(bucketName)
    .upload(`${FilePath.tmp}/${fileName}`, options)

  console.log(`${FilePath.tmp}/${fileName} uploaded to ${bucketName}`)
}
