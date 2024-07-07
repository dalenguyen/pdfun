import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import { handler } from './app/pdf.handler'

export const server = express()
  .use(cors())
  .use(express.json())
  .use(handler)
  .use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    console.error('unhandled error', err)
  })
  .listen(8080, () =>
    console.log(`🚀 [APP] is running on: http://localhost:8080`),
  )
