import { FilePath, UploadedFile } from '@pdfun/domain'
import fs from 'fs'
import type { ShellString } from 'shelljs'
import shell from 'shelljs'
import {
  ImageConversionOption,
  PasswordRemovalOption,
  ResizeOption,
} from '../models'

/**
 * Start to resize file using default setting from ghostscript
 * // TODO: enable more options for resizing
 *
 * @param fileName string
 * @returns
 */
export const resizeFile = (
  uploadedFileData: UploadedFile,
  options: ResizeOption = {}
): ShellString => {
  const { fileName } = uploadedFileData

  const {
    settings = 'ebook',
    device = 'pdfwrite',
    compatibilityLevel = '1.4',
  } = options

  shell.echo(`Start to resize file: ${fileName}`)

  shell.cd(`${FilePath.tmp}/${uploadedFileData.pdfId}`)

  const result = shell.exec(`
    gs -sDEVICE=${device} -dCompatibilityLevel=${compatibilityLevel} -dPDFSETTINGS=/${settings} \
    -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${uploadedFileData.taskType}-${fileName} ${fileName}
  `)

  if (result.code !== 0) {
    console.error('Error: Failed to resize file')
    shell.exit(1)
  }

  return result
}

export const convertToImages = (
  uploadedFileData: UploadedFile,
  options: ImageConversionOption = {}
): ShellString => {
  const { fileName } = uploadedFileData

  // default to JPEG / r200 to save storage for free users
  const { device = 'jpeg', resolution = 'r200', format = 'jpg' } = options

  shell.echo(`Start to convert file: ${fileName}`)

  shell.cd(`${FilePath.tmp}/${uploadedFileData.pdfId}`)

  const result = shell.exec(`
        gs -dNOPAUSE -sDEVICE=${device} -${resolution}  -sOutputFile=${uploadedFileData.taskType}-%02d.${format} "${fileName}" -dBATCH
  `)

  // delete PDF file to prevent it from zipping
  deleteFile(fileName)

  // turn folder to a zip file
  compressFolder(
    `${FilePath.tmp}/${uploadedFileData.pdfId}`,
    `${uploadedFileData.pdfId}.zip`
  )

  if (result.code !== 0) {
    console.error('Error: Failed to resize file')
    shell.exit(1)
  }

  return result
}

export const removePassword = (
  uploadedFileData: UploadedFile,
  options: PasswordRemovalOption = {}
) => {
  const { fileName, password } = uploadedFileData
  const { device = 'pdfwrite' } = options

  shell.echo(`Start to remove password for: ${fileName}`)
  shell.cd(`${FilePath.tmp}/${uploadedFileData.pdfId}`)

  const result = shell.exec(
    `gs -dNOPAUSE -dBATCH -q -sDEVICE=${device} -sPDFPassword=${password} -sOutputFile=${uploadedFileData.taskType}-${fileName} ${fileName}`
  )

  if (result.code !== 0) {
    console.error('Error: Failed to remove password')
    shell.exit(1)
  }

  return result
}

export const createNewFolder = (path: string) => {
  cleanupFolder(path)
  shell.mkdir(path)
}

export const cleanupFolder = (path: string) => {
  shell.rm('-rf', path)
}

export const deleteFile = (filePath: string) => {
  shell.rm(filePath)
}

export const compressFolder = (folderPath: string, fileName: string) => {
  console.log(`Compress ${fileName} from ${folderPath}`)
  shell.exec(`zip -jr ${folderPath}/${fileName} ${folderPath}/*`)
}

export const getFileSize = async (path: string) => {
  try {
    const stats = fs.statSync(path)
    return stats.size
  } catch (err) {
    console.error(err)
    return 0
  }
}
