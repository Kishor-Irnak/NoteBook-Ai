import { google } from '@ai-sdk/google'
import { generateText } from 'ai'
import { NextResponse } from 'next/server'

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')

    const result = await generateText({
      model: google('gemini-2.5-flash'),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Extract and return ALL textual content from this PDF. Return only the text content, preserving paragraphs and structure. Do not summarize - return the full text.',
            },
            {
              type: 'file',
              mediaType: 'application/pdf',
              data: base64,
            },
          ],
        },
      ],
    })

    return NextResponse.json({ text: result.text })
  } catch (error: any) {
    console.error('PDF parse error:', error)
    return NextResponse.json({ error: error.message || 'Failed to parse PDF' }, { status: 500 })
  }
}
