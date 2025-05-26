import { Storage } from '@google-cloud/storage'
import { TextToSpeechClient } from '@google-cloud/text-to-speech'
import { VertexAI } from '@google-cloud/vertexai'
import { UploadedFile } from '@pdfun/domain'
import { updateDocument } from '@pdfun/server/firebase'
import pdfParse from 'pdf-parse'
import { downloadFile } from '../services/storage.service'

// Get project ID from environment
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT || 'pdfun-prod'

// Initialize Vertex AI
const vertexAI = new VertexAI({
  project: PROJECT_ID,
  location: 'us-central1',
})

const ttsClient = new TextToSpeechClient()
const storage = new Storage()

// Constants for script length limits
const MAX_TTS_BYTES = 5000 // Text-to-Speech API limit
const APPROX_CHARS_PER_BYTE = 1.5 // Approximate ratio for English text
const MAX_CHARS = Math.floor(MAX_TTS_BYTES / APPROX_CHARS_PER_BYTE) // ~3300 characters

// Default bucket name based on project
const DEFAULT_BUCKET = `${PROJECT_ID}.appspot.com`

export const handlePDFToPodcast = async (
  uploadedFileData: UploadedFile,
  documentPath: string,
) => {
  console.log(
    `[PDF to Podcast] Starting conversion for document: ${documentPath}`,
  )

  try {
    // 1. Extract text from PDF
    console.log(`[PDF to Podcast] Step 1: Extracting text from PDF`)
    const downloadedPath = await downloadFile(uploadedFileData)
    console.log(`[PDF to Podcast] File downloaded to: ${downloadedPath}`)

    const pdfBuffer = await pdfParse(downloadedPath)
    const extractedText = pdfBuffer.text
    console.log(
      `[PDF to Podcast] Extracted text length: ${extractedText.length} characters`,
    )
    console.log(`[PDF to Podcast] Number of pages: ${pdfBuffer.numpages}`)

    // 2. Generate podcast script using Vertex AI
    console.log(
      `[PDF to Podcast] Step 2: Generating podcast script with Vertex AI`,
    )

    const model = 'gemini-2.0-flash'
    const generativeModel = vertexAI.getGenerativeModel({
      model,
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.4,
        topP: 0.8,
        topK: 40,
      },
    })

    const prompt = `Convert the following text into an engaging podcast conversation between two hosts that will be approximately 3-4 minutes long when read aloud.

    Guidelines:
    1. Keep the script under ${MAX_CHARS} characters to ensure it works with text-to-speech
    2. Create a natural dialogue between two hosts: Yen (the expert) and Dale (the curious learner)
    3. Structure the conversation to:
       - Start with a brief introduction of the topic
       - Have Dale ask thoughtful questions about key points
       - Let Yen provide clear, engaging explanations
       - Include natural transitions between topics
       - End with a brief summary and conclusion
    4. Make the conversation feel natural and unscripted
    5. Focus on the most important points and main ideas
    6. Use conversational language and avoid overly formal tone

    Text to convert:
    ${extractedText}`

    console.log(
      `[PDF to Podcast] Sending prompt to Vertex AI (length: ${prompt.length} characters)`,
    )

    const result = await generativeModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    })

    const script = result.response.candidates[0].content.parts[0].text
    console.log(
      `[PDF to Podcast] Generated script length: ${script.length} characters`,
    )
    console.log(
      `[PDF to Podcast] Generated script word count: ${script.split(/\s+/).length}`,
    )

    // 3. Convert script to speech
    console.log(`[PDF to Podcast] Step 3: Converting script to speech`)

    // Clean the script and prepare it for SSML
    const cleanScript = script
      .replace(/\*/g, '') // Remove asterisks
      .replace(/\[.*?\]/g, '') // Remove text in square brackets
      .replace(/`/g, '') // Remove backticks
      .replace(/\n\s*\n/g, '\n') // Remove multiple newlines
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/\[Intro Music\]/gi, '') // Remove intro music
      .replace(/\[Outro Music\]/gi, '') // Remove outro music
      .replace(/\[Music\]/gi, '') // Remove any music markers
      .replace(/\[.*?Music.*?\]/gi, '') // Remove any music-related text in brackets
      .replace(/\bOutro Music\b/gi, '') // Remove "Outro Music" without brackets
      .trim()

    // Split the conversation into turns
    const conversationTurns = cleanScript
      .split(/(?=(?:Yen:|Dale:))/)
      .map((turn) => {
        if (turn.startsWith('Yen:')) {
          const text = turn.replace(/^Yen:\s*/, '').trim()
          return text
            ? {
                text,
                speaker: 'Y',
              }
            : null
        } else if (turn.startsWith('Dale:')) {
          const text = turn.replace(/^Dale:\s*/, '').trim()
          return text
            ? {
                text,
                speaker: 'D',
              }
            : null
        }
        return null
      })
      .filter((turn) => turn !== null && turn.text.length > 0)

    // Process each turn separately
    const audioBuffers = []
    for (const turn of conversationTurns) {
      console.log(`[PDF to Podcast] Processing turn:`, turn)

      const [response] = await ttsClient.synthesizeSpeech({
        input: { text: turn.text },
        voice: {
          languageCode: 'en-US',
          // https://cloud.google.com/text-to-speech/docs/list-voices-and-types
          name: turn.speaker === 'Y' ? 'en-US-Standard-F' : 'en-US-Standard-D',
          ssmlGender: turn.speaker === 'Y' ? 'FEMALE' : 'MALE',
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: 1.0,
          pitch: 0.0,
          volumeGainDb: 2.0,
        },
      })
      audioBuffers.push(response.audioContent)
    }

    // Combine all audio buffers
    const combinedAudio = Buffer.concat(audioBuffers)

    // Upload the combined audio
    const bucketName = process.env.GCP_STORAGE_BUCKET || DEFAULT_BUCKET
    const bucket = storage.bucket(bucketName)

    // Get the PDF filename and replace .pdf with .mp3
    const pdfFileName = uploadedFileData.fileName
    const audioFileName = pdfFileName.replace('.pdf', '.mp3')
    const fullAudioPath = `${uploadedFileData.filePath}/${audioFileName}`

    const file = bucket.file(fullAudioPath)
    await file.save(combinedAudio, {
      metadata: {
        contentType: 'audio/mpeg',
      },
    })
    console.log(`[PDF to Podcast] Audio file uploaded successfully`)

    // 5. Update document with results
    console.log(`[PDF to Podcast] Step 5: Updating document with results`)
    await updateDocument(documentPath, {
      taskResponse: {
        fileName: fullAudioPath,
        script: script,
        status: 'completed',
      },
    })
    console.log(`[PDF to Podcast] Document updated successfully`)

    return { success: true }
  } catch (error) {
    console.error(`[PDF to Podcast] Error in conversion process:`, error)
    console.error(`[PDF to Podcast] Error details:`, {
      message: error.message,
      stack: error.stack,
      documentPath,
    })

    await updateDocument(documentPath, {
      taskResponse: {
        status: 'failed',
        error: error.message,
      },
    })
    console.log(`[PDF to Podcast] Document updated with error status`)
    throw error
  }
}
