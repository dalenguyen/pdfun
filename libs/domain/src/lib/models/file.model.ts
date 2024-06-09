export enum TaskType {
  RESIZE = 'RESIZE',
  IMAGE_CONVERSION = 'IMAGE_CONVERSION',
}

export interface TaskResponse {
  success: boolean
  fileName: string
}

export interface UploadedFile {
  contentType: string | undefined
  createdAt: string
  updatedAt: string
  expiresOn: Date
  fileName: string
  filePath: string
  taskResponse: TaskResponse | null
  pdfId: string
  uid: string
  taskType: TaskType
  size: number
  newFileSize: number
}

export enum FilePath {
  tmp = '/tmp',
  public = 'public',
}
