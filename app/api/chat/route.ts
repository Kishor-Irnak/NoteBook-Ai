import { google } from '@ai-sdk/google'
import { generateText } from 'ai'
import { NextResponse } from 'next/server'

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { messages, sources } = await req.json()

    let systemMessage = `You are an intelligent AI assistant similar to Google NotebookLM. 
You help users understand and analyze their uploaded documents (sources).
Answer based on the provided sources when relevant. If a question is not covered by the sources, answer from your general knowledge but mention that.
Be concise, accurate, and helpful. Use markdown formatting in your responses.\n\n`

    if (sources && sources.length > 0) {
      systemMessage += "=== UPLOADED SOURCES ===\n"
      sources.forEach((s: { name: string; content: string }, i: number) => {
        systemMessage += `\n--- Source ${i + 1}: ${s.name} ---\n${s.content.slice(0, 8000)}\n`
      })
      systemMessage += "\n=== END OF SOURCES ===\n"
    } else {
      systemMessage += "No sources have been uploaded yet. Answer from general knowledge.\n"
    }

    const result = await generateText({
      model: google('gemini-2.5-flash'),
      system: systemMessage,
      messages: messages,
    })

    return NextResponse.json({ content: result.text })
  } catch (error: any) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 })
  }
}
