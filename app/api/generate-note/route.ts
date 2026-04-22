import { google } from "@ai-sdk/google"
import { generateText } from "ai"
import { NextResponse } from "next/server"

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
      study_guide:
        "Create a comprehensive, well-structured Study Guide based on the provided sources. Include key concepts, definitions, important points, and review questions. Format with markdown headings and bullet points.",
      briefing_doc:
        "Create a professional Briefing Document based on the provided sources. Include an executive summary, key findings, main topics, and conclusions. Use markdown formatting.",
      faq: "Create a list of 8-10 Frequently Asked Questions with detailed answers based on the provided sources. Format as Q&A pairs using markdown.",
      timeline:
        "Create a chronological Timeline of key events, concepts, or progressions from the provided sources. Format with dates/stages and bullet points using markdown.",
      audio_overview: `Write a natural, engaging podcast conversation between two hosts named Alex and Sam about the key ideas in the provided sources.

STRICT FORMAT RULES — follow these exactly:
- Every single line must start with either "ALEX:" or "SAM:" followed by a space and then what they say.
- Do NOT use any markdown, asterisks, hyphens, bullet points, or headings anywhere.
- Do NOT add any narrator lines, stage directions, or parenthetical notes.
- Each speaker turn should be 1-3 sentences — keep the back-and-forth snappy and natural.
- Aim for 30-40 total turns alternating between ALEX and SAM.
- Start with ALEX.

TONE AND STYLE:
- Alex is the curious, enthusiastic host who asks great questions and reacts genuinely. Alex uses phrases like "Hold on, so you're saying..." or "Wait, that is actually fascinating."
- Sam is the knowledgeable explainer who makes complex ideas click with analogies, real-world examples, and occasional dry humor.
- Start naturally mid-thought, like two people who have been chatting. No stiff intro lines.
- Include moments of genuine surprise, light humor, and a natural wrap-up where both feel satisfied with what they covered.
- It should feel like two smart friends genuinely talking, not a scripted interview.
- Use contractions and informal speech. Avoid academic or formal language.

Example of correct format and tone:
ALEX: So I was going through all of this material and one thing kept jumping out at me. Newton's laws are everywhere, right, like in daily life?
SAM: Completely. And the wild thing is most people interact with all three of them before they even get out of bed in the morning.
ALEX: Okay now you have to explain that because that sounds like a stretch.
SAM: It really is not. When your alarm goes off and you just lay there not wanting to move, that is inertia. Your body is at rest and it wants to stay at rest.
ALEX: That is genuinely the most relatable physics explanation I have ever heard.`,
      summary:
        "Write a concise but comprehensive summary of the provided sources. Highlight the most important concepts and takeaways. Use markdown formatting.",
    }

    const prompt = prompts[type] || prompts.summary

    const result = await generateText({
      model: google("gemini-2.5-flash"),
      system: systemMessage,
      prompt: prompt,
    })

    return NextResponse.json({ text: result.text })
  } catch (error: any) {
    console.error("Generate note error:", error)

    // Detect Gemini spending cap / quota exhaustion
    const isQuotaError =
      error?.statusCode === 429 ||
      error?.lastError?.statusCode === 429 ||
      error?.message?.includes('spending cap') ||
      error?.message?.includes('RESOURCE_EXHAUSTED')

    if (isQuotaError) {
      return NextResponse.json(
        {
          error:
            'The AI service has reached its monthly usage limit. Please try again later or contact the administrator to increase the spending cap.',
          code: 'QUOTA_EXCEEDED',
        },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    )
  }
}
