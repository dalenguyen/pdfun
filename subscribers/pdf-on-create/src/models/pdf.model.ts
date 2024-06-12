export interface ResizeOption {
  settings?: 'ebook'
  device?: 'pdfwrite'
  compatibilityLevel?: '1.4'
}

// https://ghostscript.readthedocs.io/en/latest/Devices.html#png-file-format

export interface ImageConversionOption {
  device?: 'png16m' | 'jpeg'
  resolution?: 'r200' | 'r600'
  format?: 'jpg' | 'png'
}
