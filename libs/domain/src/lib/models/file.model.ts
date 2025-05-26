import type { Assistant } from 'openai/resources/beta/assistants'

export enum TaskType {
  RESIZE = 'RESIZE',
  IMAGE_CONVERSION = 'IMAGE_CONVERSION',
  PASSWORD_REMOVAL = 'PASSWORD_REMOVAL',
  PDF_CHAT = 'PDF_CHAT',
  PDF_TO_PODCAST = 'PDF_TO_PODCAST',
}

export interface TaskResponse {
  success: boolean
  fileName: string
  error?: string
  status?: 'completed' | 'failed' | 'processing'
  script?: string
}

export interface UploadedFile {
  contentType: string | undefined
  createdAt: string
  updatedAt: string
  expiresOn: Date
  fileName: string
  filePath: string
  taskResponse?: TaskResponse | null
  assistant?: Assistant
  password?: string
  pdfId: string
  uid: string
  taskType: TaskType
  size: number
  newFileSize?: number
}

export enum FilePath {
  tmp = '/tmp',
  public = 'public',
}
