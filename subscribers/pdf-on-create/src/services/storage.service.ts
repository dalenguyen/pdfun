import { Storage } from '@google-cloud/storage'

const storage = new Storage()

// The ID of your GCS bucket
const bucketName = 'pdfun-prod.appspot.com'

// The path to which the file should be downloaded
const destFilePath = '/tmp'

export const downloadFile = async (filePath: string, fileName: string) => {
  const options = {
    destination: `${destFilePath}/${fileName}`,
  }

  try {
    // Downloads the file
    await storage.bucket(bucketName).file(filePath).download(options)

    console.log(
      `gs://${bucketName}/${filePath} downloaded to ${`${destFilePath}/${fileName}`}.`
    )

    return `${destFilePath}/${fileName}`
  } catch (error) {
    throw new Error(error)
  }
}

export const uploadFile = async (fileName: string) => {
  const options = {
    destination: `public/${fileName}`,
  }

  await storage
    .bucket(bucketName)
    .upload(`${destFilePath}/${fileName}`, options)

  console.log(`${destFilePath}/${fileName} uploaded to ${bucketName}`)
}
