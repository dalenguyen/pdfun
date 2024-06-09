import { FilePath, UploadedFile } from '@pdfun/domain'
import fs from 'fs'
import type { ShellString } from 'shelljs'
import shell from 'shelljs'
import { ResizeOption } from '../models'

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

export const createNewFolder = (path: string) => {
  cleanupFolder(path)
  shell.mkdir(path)
}

export const cleanupFolder = (path: string) => {
  shell.rm(`${path}/*.*`)
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
