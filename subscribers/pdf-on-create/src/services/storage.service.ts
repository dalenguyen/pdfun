import { Storage } from '@google-cloud/storage'
import { FilePath, UploadedFile } from '@pdfun/domain'
import { createNewFolder } from './shell.service'

const storage = new Storage()

// The ID of your GCS bucket
const bucketName = 'pdfun-prod.appspot.com'

/**
 * Download file from cloud storage to /tmp folder
 * Destination: /tmp/{pdfId}/{fileName}
 *
 * @param uploadedFile UploadedFile
 * @returns string (file destination)
 */
export const downloadFile = async (uploadedFile: UploadedFile) => {
  // prepare new folder for downloaded file
  createNewFolder(`${FilePath.tmp}/${uploadedFile.pdfId}`)

  const { fileName, filePath } = uploadedFile

  const fullPath = `${filePath}/${fileName}`

  const downloadedDestination = `${FilePath.tmp}/${uploadedFile.pdfId}/${fileName}`

  const options = {
    destination: downloadedDestination,
  }

  try {
    // Downloads the file
    await storage.bucket(bucketName).file(fullPath).download(options)

    console.log(`${fullPath} downloaded to ${downloadedDestination}`)

    return downloadedDestination
  } catch (error) {
    throw new Error(error)
  }
}

export const uploadFile = async (
  uploadedFile: UploadedFile,
  fileName: string
) => {
  console.log(
    `${FilePath.tmp}/${uploadedFile.pdfId}/${fileName} uploaded to ${uploadedFile.filePath}`
  )

  const options = {
    destination: `${uploadedFile.filePath}/${fileName}`,
  }

  await storage
    .bucket(bucketName)
    .upload(`${FilePath.tmp}/${uploadedFile.pdfId}/${fileName}`, options)
}
