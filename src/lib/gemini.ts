import { GoogleGenAI } from "@google/genai"

export const EMBEDDING_MODEL = "gemini-embedding-001"
export const EMBEDDING_DIMENSIONS = 768
export const CHAT_MODEL = "gemini-flash-latest"

let client: GoogleGenAI | null = null

export function getGeminiClient() {
  if (!client) {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set")
    }
    client = new GoogleGenAI({ apiKey })
  }
  return client
}

// Embeddings truncated below the native 3072 dimensions are not normalized
// by the API, so normalize here to keep cosine similarity meaningful.
function normalize(values: number[]): number[] {
  const norm = Math.sqrt(values.reduce((sum, v) => sum + v * v, 0))
  if (norm === 0) return values
  return values.map((v) => v / norm)
}

export async function embedText(
  text: string,
  taskType: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY"
): Promise<number[]> {
  const response = await getGeminiClient().models.embedContent({
    model: EMBEDDING_MODEL,
    contents: text,
    config: {
      taskType,
      outputDimensionality: EMBEDDING_DIMENSIONS,
    },
  })

  const values = response.embeddings?.[0]?.values
  if (!values) {
    throw new Error("Gemini returned no embedding")
  }
  return normalize(values)
}
