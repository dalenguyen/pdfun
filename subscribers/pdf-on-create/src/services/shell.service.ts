import shell from 'shelljs'

/**
 * Start to resize file using default setting from ghostscript
 * // TODO: enable more options for resizing
 *
 * @param fileName string
 * @returns
 */
export const resizeFile = (fileName: string, options = {}) => {
  shell.echo(`Start to resize file: ${fileName}`)

  shell.cd('/tmp')

  const result = shell.exec(`
    gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook \
    -dNOPAUSE -dQUIET -dBATCH -sOutputFile=resized-${fileName} ${fileName}
  `)

  if (result.code !== 0) {
    console.error('Error: Failed to resize file')
    shell.exit(1)
  }

  return result
}
