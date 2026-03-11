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

    // Using gemini-2.5-flash as it's the available stable model in this environment
    const result = await generateText({
      model: google("gemini-1.5-flash"),
      tools: {
        googleSearch: google.tools.googleSearch({}),
      },
      // @ts-ignore
      maxSteps: 5,
      prompt: `You are a research assistant. Use Google Search to find the best real, currently-existing learning resources about the topic in this study material.
      
STUDY MATERIAL:
${sourcesText}

Search for:
1. Real YouTube tutorial videos on this topic
2. High-quality educational websites, articles, and documentation
3. GitHub repos or online courses

After searching, return ONLY a JSON object like this (no markdown, no code fences):
{
  "topic": "Topic name in 3-5 words",
  "researchSummary": "A concise, Perplexity-style summary (3-4 sentences) that highlights the top 3 most valuable findings or learning paths discovered during this search. Be professional and encouraging.",
  "sources": [
    {
      "title": "Exact real page or video title from search results",
      "url": "https://actual-real-url-from-search-results.com",
      "description": "One sentence about what this covers",
      "type": "youtube OR github OR course OR documentation OR website"
    }
  ]
}

Include 8-12 real results. Only include URLs from actual search results — never fabricate URLs.`,
    })

    const text = result.text.trim()

    // Parse Gemini's JSON response
    let topic = "Related Resources"
    let researchSummary = ""
    let parsedSources: SourceItem[] = []

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        topic = parsed.topic || topic
        researchSummary = parsed.researchSummary || ""
        parsedSources = (parsed.sources || []) as SourceItem[]
      }
    } catch {
      // ignore parse errors — return empty
    }

    // Also try to extract real URLs from the grounding metadata
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const meta = (result as any).experimental_providerMetadata?.google
    const groundingChunks: Array<{ web?: { uri: string; title?: string } }> =
      meta?.groundingMetadata?.groundingChunks || []

    const groundedDomains = new Set<string>()
    for (const chunk of groundingChunks) {
      const d = chunk.web?.uri ? extractDomain(chunk.web.uri) : null
      if (d) groundedDomains.add(d)
    }

    // Filter to keep only sources whose domain appeared in actual Google search results
    let finalSources = parsedSources
    if (groundedDomains.size > 0) {
      const filtered = parsedSources.filter((s) => {
        const d = extractDomain(s.url)
        return d && groundedDomains.has(d)
      })
      if (filtered.length >= 3) finalSources = filtered
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
