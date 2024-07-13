import { openai } from '@pdfun/ai'
import { defineEventHandler, readBody } from 'h3'
import { FileCitationAnnotation } from 'openai/resources/beta/threads/messages'

export default defineEventHandler(async (event) => {
  const { assistantId, prompt } = await readBody(event)

  const thread = await openai.beta.threads.create({
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: assistantId,
  })

  const messages = await openai.beta.threads.messages.list(thread.id, {
    run_id: run.id,
  })

  const message = messages.data.pop()!

  let response = ''

  if (message.content[0].type === 'text') {
    const { text } = message.content[0]
    const { annotations } = text
    const citations: string[] = []

    let index = 0
    for (const annotation of annotations) {
      text.value = text.value.replace(annotation.text, '[' + index + ']')
      const { file_citation } = annotation as FileCitationAnnotation
      if (file_citation) {
        const citedFile = await openai.files.retrieve(file_citation.file_id)
        citations.push('[' + index + ']' + citedFile.filename)
      }
      index++
    }

    response = text.value
  }

  return { response }
})
