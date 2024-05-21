import type { Request, Response } from 'express'

export const handler = async (req: Request, res: Response) => {
  const path = req.headers['ce-document']

  console.log({ path })

  if (!path) {
    const msg = 'No valid path received'
    console.error(`error: ${msg}`)
    res.status(400).send(`Bad Request: ${msg}`)
    return
  }

  return res.json({ success: 'true' })
}
