export interface UploadedFile {
  contentType: string | undefined
  createdAt: string
  updatedAt: string
  expiresOn: Date
  fileName: string
  filePath: string
  resizedFileName?: string
  size: number
}

export enum FilePath {
  tmp = '/tmp',
  public = 'public',
}
