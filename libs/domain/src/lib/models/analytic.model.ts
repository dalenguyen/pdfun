import { TaskType } from './file.model'

export interface Analytic {
  type: TaskType
  fileSize: number
  newFileSize?: number
  createdAt: string
  user: string
  numberOfImages?: number
}
