import { openai } from '@pdfun/ai'
import { defineEventHandler, readBody } from 'h3'
import { FileCitationAnnotation } from 'openai/resources/beta/threads/messages'

export default defineEventHandler(async (event) => {
  const { assistantId, prompt, threadId } = await readBody(event)

  try {
    // Reuse existing thread or create new one
    const thread = threadId
      ? await openai.beta.threads.retrieve(threadId)
      : await openai.beta.threads.create()

    // Add message to existing thread
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: prompt,
    })

    // Run the thread and wait for the result
    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: assistantId,
    })

    // Retrieve messages from the thread run
    const messages = await openai.beta.threads.messages.list(thread.id, {
      run_id: run.id,
    })

    // Get the last message from the retrieved messages
    const message = messages.data.pop()!

    let response = ''

    // Check if the message content is not empty and is of type 'text'
    if (message.content.length > 0 && message.content[0].type === 'text') {
      const { text } = message.content[0]
      const { annotations } = text
      const citations: string[] = []

      let index = 0
      // Iterate through annotations to replace text and gather citations
      for (const annotation of annotations) {
        text.value = text.value.replace(annotation.text, '[' + index + ']')
        const { file_citation } = annotation as FileCitationAnnotation
        if (file_citation) {
          // Retrieve the cited file information
          const citedFile = await openai.files.retrieve(file_citation.file_id)
          citations.push('[' + index + ']' + citedFile.filename)
        }
        index++
      }

      // Set the final response text
      response = text.value
    }

    return {
      response: response,
      threadId: thread.id,
    }
  } catch (error) {
    console.error('Chat error:', error)
    return {
      response: 'Error processing your request',
      threadId: null,
    }
  }
})
