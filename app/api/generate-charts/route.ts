import { google } from '@ai-sdk/google'
import { generateText } from 'ai'
import { NextResponse } from 'next/server'

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { sources } = await req.json()

    let sourcesText = ''
    if (sources && sources.length > 0) {
      sourcesText = sources.map((s: { name: string; content: string }) =>
        `Title: ${s.name}\nContent: ${s.content.slice(0, 3000)}`
      ).join('\n\n---\n\n')
    }

    const prompt = `Analyze the following study materials and generate chart data for graphical representation of the key concepts and information.

STUDY MATERIALS:
${sourcesText}

Return a JSON object (no markdown, no code fences) with this exact structure:
{
  "charts": [
    {
      "type": "bar",
      "title": "Chart title",
      "description": "What this chart shows",
      "data": [
        { "name": "Concept A", "value": 85 },
        { "name": "Concept B", "value": 65 }
      ]
    },
    {
      "type": "pie",
      "title": "Topic Distribution",
      "description": "Distribution of main topics",
      "data": [
        { "name": "Topic A", "value": 30 },
        { "name": "Topic B", "value": 25 }
      ]
    },
    {
      "type": "radar",
      "title": "Key Concept Relationships",
      "description": "Complexity and importance of key concepts",
      "data": [
        { "subject": "Concept A", "value": 80 },
        { "subject": "Concept B", "value": 65 }
      ]
    }
  ]
}

Generate 3 charts that best visualize the content (bar + pie + radar). Values should be between 1-100.
Only return valid JSON.`

    const result = await generateText({
      model: google('gemini-2.5-flash'),
      prompt,
    })

    const text = result.text.trim()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Invalid JSON response')

    const parsed = JSON.parse(jsonMatch[0])
    return NextResponse.json(parsed)
  } catch (error: any) {
    console.error('Generate charts error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
