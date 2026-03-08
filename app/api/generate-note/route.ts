import { google } from '@ai-sdk/google'
import { generateText } from 'ai'
import { NextResponse } from 'next/server'

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { type, sources } = await req.json()

    let systemMessage = `You are an intelligent AI assistant. Use the provided sources to generate the requested content.\n\n`

    if (sources && sources.length > 0) {
      systemMessage += "=== UPLOADED SOURCES ===\n"
      sources.forEach((s: { name: string; content: string }, i: number) => {
        systemMessage += `\n--- Source ${i + 1}: ${s.name} ---\n${s.content.slice(0, 8000)}\n`
      })
      systemMessage += "\n=== END OF SOURCES ===\n"
    }

    const prompts: Record<string, string> = {
      study_guide: "Create a comprehensive, well-structured Study Guide based on the provided sources. Include key concepts, definitions, important points, and review questions. Format with markdown headings and bullet points.",
      briefing_doc: "Create a professional Briefing Document based on the provided sources. Include an executive summary, key findings, main topics, and conclusions. Use markdown formatting.",
      faq: "Create a list of 8-10 Frequently Asked Questions with detailed answers based on the provided sources. Format as Q&A pairs using markdown.",
      timeline: "Create a chronological Timeline of key events, concepts, or progressions from the provided sources. Format with dates/stages and bullet points using markdown.",
      audio_overview: "Write an engaging podcast-style conversation script between two hosts (Host 1: Alex and Host 2: Sam) discussing the key themes and insights from the provided sources. Make it conversational and educational. Format as a dialogue script.",
      summary: "Write a concise but comprehensive summary of the provided sources. Highlight the most important concepts and takeaways. Use markdown formatting.",
    }

    const prompt = prompts[type] || prompts.summary

    const result = await generateText({
      model: google('gemini-2.5-flash'),
      system: systemMessage,
      prompt: prompt,
    })

    return NextResponse.json({ text: result.text })
  } catch (error: any) {
    console.error('Generate note error:', error)
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 })
  }
}
