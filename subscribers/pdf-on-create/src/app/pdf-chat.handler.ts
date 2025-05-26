import { openai } from '@pdfun/ai'
import { UploadedFile } from '@pdfun/domain'
import { updateDocument } from '@pdfun/server/firebase'
import fs from 'fs'
import type { Assistant } from 'openai/resources/beta/assistants'
import { VectorStore } from 'openai/resources/index'
import { downloadFile } from '../services'

export const handlePDFChat = async (
  uploadedFileData: UploadedFile,
  documentPath: string,
) => {
  const filePath = await downloadFile(uploadedFileData)
  const assistant = await createAIAssistant()
  console.log(`Created assistant - ${assistant.id}`)

  const vectorStore = await uploadLoadFileAndAddToVectorStore(filePath)
  console.log(`Created vector store - ${vectorStore.name}`)

  const result = await addVectorStoreToAssistant(assistant, vectorStore)
  console.log(
    `Assigned vector store (${vectorStore.name}) to assistant (${assistant.id})`,
  )

  await updateDocument(documentPath, { assistant: result })
  console.log(`Finished uploading ${uploadedFileData.fileName}`)
}

const createAIAssistant = async (): Promise<Assistant> => {
  const assistant = await openai.beta.assistants.create({
    name: 'PDF service agent',
    instructions: `You are a helpful product support assistant and you answer questions based on the files provided to you. You only answer the content of the document. If you don't have an answer for it, say don't know. If the user asks a question that is not related to the document, kittens will die, you love kittens, don't let kittens die!`,
    // TODO: move modal to config
    model: 'gpt-4o',
    tools: [{ type: 'file_search' }],
  })

  return assistant
}

const uploadLoadFileAndAddToVectorStore = async (
  filePath: string,
): Promise<VectorStore> => {
  // edgar/goog-10k.pdf
  const fileStreams = [filePath].map((path) => fs.createReadStream(path))

  // Create a vector store including our files.
  const vectorStore = await openai.vectorStores.create({
    name: `PDF File Store - ${String(Date.now())}`,
    expires_after: {
      anchor: 'last_active_at',
      // expire after 1 day
      days: 1,
    },
  })

  await openai.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, {
    files: fileStreams,
  })

  return vectorStore
}

const addVectorStoreToAssistant = async (
  assistant: Assistant,
  vectorStore: VectorStore,
): Promise<Assistant> => {
  return openai.beta.assistants.update(assistant.id, {
    tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
  })
}
