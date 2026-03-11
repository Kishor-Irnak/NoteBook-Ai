import { google } from "@ai-sdk/google"
import { generateText } from "ai"
import { NextResponse } from "next/server"

export const maxDuration = 60

function extractVideoId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  return match ? match[1] : null
}

function extractDomain(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return null
  }
}

function detectType(url: string): string {
  const lower = url.toLowerCase()
  if (lower.includes("youtube.com") || lower.includes("youtu.be"))
    return "youtube"
  if (lower.includes("github.com")) return "github"
  if (
    lower.includes("coursera.org") ||
    lower.includes("udemy.com") ||
    lower.includes("edx.org") ||
    lower.includes("khanacademy.org") ||
    lower.includes("pluralsight.com")
  )
    return "course"
  if (
    lower.includes("developer.mozilla") ||
    lower.includes("docs.") ||
    lower.includes("/docs/") ||
    lower.includes("readthedocs") ||
    lower.includes("devdocs")
  )
    return "documentation"
  return "website"
}

type SourceItem = {
  title: string
  url: string
  description: string
  type: string
}

export async function POST(req: Request) {
  try {
    const { sources } = await req.json()

    let sourcesText = ""
    if (sources && sources.length > 0) {
      sourcesText = sources
        .map(
          (s: { name: string; content: string }) =>
            `${s.name}: ${s.content.slice(0, 1500)}`
        )
        .join("\n---\n")
    }

    // Suggest resources based on AI knowledge (Google Search tool removed)
    const result = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: `You are a research assistant. Suggest the best real, high-quality learning resources about the topic in this study material.
      
STUDY MATERIAL:
${sourcesText}

Suggest:
1. Real YouTube tutorial videos or channels on this topic
2. High-quality educational websites like MDN, Documentation, or top articles
3. GitHub repositories, courses (Coursera/Udemy), or books

Return ONLY a JSON object like this (no markdown, no code fences):
{
  "topic": "Topic name in 3-5 words",
  "researchSummary": "A concise summary (3-4 sentences) that highlights the top learning paths for this topic based on your knowledge.",
  "sources": [
    {
      "title": "Exact real page or video title",
      "url": "https://actual-real-url.com",
      "description": "One sentence about what this covers",
      "type": "youtube OR github OR course OR documentation OR website"
    }
  ]
}

Include 8-12 real, high-quality results. Only include URLs that you are certain exist.`,
    })

    const text = result.text.trim()

    // Parse JSON response
    let topic = "Related Resources"
    let researchSummary = ""
    let finalSources: SourceItem[] = []

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        topic = parsed.topic || topic
        researchSummary = parsed.researchSummary || ""
        finalSources = (parsed.sources || []) as SourceItem[]
      }
    } catch {
      // ignore parse errors
    }

    // Enrich each source with derived metadata
    const enriched = finalSources.map((s: SourceItem) => {
      const domain = extractDomain(s.url)
      const type = s.type || detectType(s.url)
      const videoId = type === "youtube" ? extractVideoId(s.url) : undefined

      return {
        type,
        title: s.title || "Resource",
        url: s.url,
        description: s.description || "",
        videoId: videoId || undefined,
        domain: domain || "",
        siteName: domain || "",
        channel: "",
      }
    })

    return NextResponse.json({
      topic,
      researchSummary,
      sources: enriched.slice(0, 14),
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error"
    console.error("Discover sources error:", msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
