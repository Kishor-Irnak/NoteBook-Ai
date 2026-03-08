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

    const prompt = `Based on the following study materials, suggest 8-10 real, highly relevant learning resources.

STUDY MATERIALS:
${sourcesText}

Return a JSON object (no markdown, no code fences) with this exact structure:
{
  "topic": "Main topic of the materials",
  "sources": [
    {
      "type": "website",
      "title": "Resource title",
      "url": "https://real-url.com",
      "description": "Brief description of what this resource covers",
      "icon": "🌐"
    }
  ]
}

Include diverse types: website, course, github, youtube, documentation, book.
Use these emojis for types: website=🌐, course=🎓, github=⚙️, youtube=▶️, documentation=📖, book=📚
Only return valid, real URLs. Return ONLY JSON.`

    const result = await generateText({
      model: google('gemini-2.5-flash'),
      prompt,
    })

    // Extract JSON from response
    const text = result.text.trim()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Invalid JSON response')

    const parsed = JSON.parse(jsonMatch[0])
    return NextResponse.json(parsed)
  } catch (error: any) {
    console.error('Discover sources error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
