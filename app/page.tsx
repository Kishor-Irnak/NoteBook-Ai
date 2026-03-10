"use client"
import React, { useState, useRef, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import {
  Share2,
  Settings,
  Search,
  Filter,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  FileText,
  PanelRightClose,
  PanelRightOpen,
  Info,
  MoreVertical,
  RotateCcw,
  AudioLines,
  FileCheck,
  FileQuestion,
  Clock,
  NotebookTabs,
  Loader2,
  Trash2,
  X,
  Globe,
  BarChart2,
  BookOpen,
  ExternalLink,
  GitBranch,
  Youtube,
  Sparkles,
  MapPin,
  ChevronRight,
  Play,
  Pause,
  Square,
  Volume2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
} from "recharts"

// Types
type Source = {
  id: string
  name: string
  content: string
  selected: boolean
  type: "txt" | "pdf" | "other"
}
type ChatMessage = { id: string; role: "user" | "assistant"; content: string }
type Note = {
  id: string
  title: string
  content: string
  isTimeline?: boolean
  timelineData?: TimelineEvent[]
}
type TimelineEvent = {
  date: string
  title: string
  description: string
  color?: string
}
type RelatedSource = {
  type: string
  title: string
  url: string
  description: string
  icon?: string
  videoId?: string
  domain?: string
  siteName?: string
  channel?: string
}
type ChartData = {
  type: string
  title: string
  description: string
  data: any[]
}

const PIE_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
]

const SUGGESTION_CHIPS = [
  "Summarize the key points from my sources",
  "What are the main concepts I should know?",
  "Create a quiz based on these sources",
  "Explain the most important ideas simply",
]

const RIGHT_TABS = [
  {
    id: "studio",
    label: "Studio",
    icon: <NotebookTabs className="h-3.5 w-3.5" />,
  },
  { id: "sources", label: "Sources", icon: <Globe className="h-3.5 w-3.5" /> },
  {
    id: "charts",
    label: "Charts",
    icon: <BarChart2 className="h-3.5 w-3.5" />,
  },
]

function getSourceIcon(type: Source["type"]) {
  if (type === "pdf")
    return <span className="text-[9px] font-bold text-red-600">PDF</span>
  return <FileText className="h-3.5 w-3.5" />
}

function getResourceIcon(type: string) {
  switch (type) {
    case "github":
      return <GitBranch className="h-4 w-4 text-gray-700" />
    case "youtube":
      return <Youtube className="h-4 w-4 text-red-500" />
    case "course":
      return <BookOpen className="h-4 w-4 text-purple-600" />
    case "documentation":
      return <FileText className="h-4 w-4 text-blue-600" />
    case "book":
      return <BookOpen className="h-4 w-4 text-amber-600" />
    default:
      return <Globe className="h-4 w-4 text-indigo-500" />
  }
}

function getResourceBg(type: string) {
  switch (type) {
    case "github":
      return "bg-gray-100"
    case "youtube":
      return "bg-red-50"
    case "course":
      return "bg-purple-50"
    case "documentation":
      return "bg-blue-50"
    case "book":
      return "bg-amber-50"
    default:
      return "bg-indigo-50"
  }
}

// Visual Timeline Component
function TimelineView({ events }: { events: TimelineEvent[] }) {
  const dotColors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-rose-500",
    "bg-amber-500",
    "bg-green-500",
    "bg-cyan-500",
  ]
  return (
    <div className="flex flex-col gap-0">
      {events.map((event, i) => (
        <div key={i} className="group flex gap-4">
          <div className="flex flex-col items-center">
            <div
              className={`mt-1 h-3 w-3 shrink-0 rounded-full ${dotColors[i % dotColors.length]} shadow-sm ring-4 ring-white`}
            />
            {i < events.length - 1 && (
              <div className="my-1 w-0.5 flex-1 bg-gradient-to-b from-gray-200 to-gray-100" />
            )}
          </div>
          <div className={`pb-5 ${i === events.length - 1 ? "pb-0" : ""}`}>
            <p className="mb-0.5 text-[11px] font-semibold tracking-wide text-blue-600 uppercase">
              {event.date}
            </p>
            <h4 className="text-sm leading-tight font-semibold text-gray-900">
              {event.title}
            </h4>
            <p className="mt-1 text-[12px] leading-relaxed text-gray-600">
              {event.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

// Parse timeline markdown into structured events
function parseTimeline(content: string): TimelineEvent[] {
  const events: TimelineEvent[] = []
  const lines = content.split("\n")
  let current: Partial<TimelineEvent> | null = null

  for (const line of lines) {
    const boldMatch = line.match(/\*\*(.+?)\*\*[:\s–-]+(.+)/)
    const headingMatch = line.match(/^#+\s+(.+)/)
    const bulletMatch = line.match(/^[-*]\s+(.+)/)

    if (boldMatch) {
      if (current) events.push(current as TimelineEvent)
      current = {
        date: boldMatch[1].trim(),
        title: boldMatch[2].trim(),
        description: "",
      }
    } else if (headingMatch && !current) {
      // skip main heading
    } else if (current && bulletMatch) {
      current.description =
        (current.description || "") + bulletMatch[1].trim() + " "
    } else if (current && line.trim() && !line.startsWith("#")) {
      current.description = (current.description || "") + line.trim() + " "
    }
  }
  if (current) events.push(current as TimelineEvent)
  return events.slice(0, 12)
}

function usePersistedState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(initialValue)

  useEffect(() => {
    try {
      const item = window.sessionStorage.getItem(key)
      if (item) {
        setState(JSON.parse(item))
      }
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error)
    }
  }, [key])

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(state) : value
      setState(valueToStore)
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.warn(`Error setting sessionStorage key "${key}":`, error)
    }
  }

  return [state, setValue] as const
}

export default function NotebookLM() {
  const [isLeftOpen, setIsLeftOpen] = useState(true)
  const [isRightOpen, setIsRightOpen] = useState(true)
  const [rightTab, setRightTab] = useState<"studio" | "sources" | "charts">(
    "studio"
  )

  const [sources, setSources] = usePersistedState<Source[]>(
    "notebook-sources",
    [
      {
        id: "demo-1",
        name: "Sample Physics Notes.txt",
        content:
          "Newton's First Law: An object at rest stays at rest and an object in motion stays in motion unless acted upon by an unbalanced force (inertia).\n\nNewton's Second Law: Force equals mass times acceleration (F=ma). The acceleration of an object depends on the net force acting on it and its mass.\n\nNewton's Third Law: For every action, there is an equal and opposite reaction. Forces always occur in pairs.\n\nGravity: The force of attraction between objects with mass. On Earth, gravitational acceleration is approximately 9.8 m/s².\n\nFriction: A force that opposes motion between surfaces in contact. Static friction prevents motion; kinetic friction slows moving objects.\n\nMomentum: The product of an object's mass and velocity (p = mv). In a closed system, total momentum is conserved.",
        selected: true,
        type: "txt",
      },
    ]
  )

  const [messages, setMessages] = usePersistedState<ChatMessage[]>(
    "notebook-messages",
    []
  )
  const [inputValue, setInputValue] = useState("")
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [chatError, setChatError] = useState("")

  const [notes, setNotes] = usePersistedState<Note[]>("notebook-notes", [])
  const [isGeneratingNote, setIsGeneratingNote] = useState(false)
  const [activeNote, setActiveNote] = useState<Note | null>(null)

  const [isUploadingPdf, setIsUploadingPdf] = useState(false)

  // Related Sources
  const [relatedSources, setRelatedSources] = usePersistedState<
    RelatedSource[]
  >("notebook-relatedSources", [])
  const [sourceTopic, setSourceTopic] = usePersistedState(
    "notebook-sourceTopic",
    ""
  )
  const [isDiscoveringSources, setIsDiscoveringSources] = useState(false)

  // Charts
  const [chartData, setChartData] = usePersistedState<ChartData[]>(
    "notebook-chartData",
    []
  )
  const [isGeneratingCharts, setIsGeneratingCharts] = useState(false)
  const [researchSummary, setResearchSummary] = usePersistedState<string>(
    "notebook-researchSummary",
    ""
  )

  // Audio Overview
  const [audioLines, setAudioLines] = useState<
    { speaker: string; text: string }[]
  >([])
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [isAudioReady, setIsAudioReady] = useState(false)
  const [audioProgress, setAudioProgress] = useState(0)
  const [audioCurrentTime, setAudioCurrentTime] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)
  const [currentSpeaker, setCurrentSpeaker] = useState<string>("")
  const audioTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioTotalSecondsRef = useRef(0)
  const audioElapsedRef = useRef(0)
  const isCancelledRef = useRef(false)

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  const stopAudioTimer = () => {
    if (audioTimerRef.current) {
      clearInterval(audioTimerRef.current)
      audioTimerRef.current = null
    }
  }

  const generateAudio = async () => {
    if (selectedSources.length === 0) {
      alert("Please select at least one source first.")
      return
    }
    setIsGeneratingAudio(true)
    setIsAudioReady(false)
    setAudioProgress(0)
    setAudioCurrentTime(0)
    setAudioDuration(0)
    setCurrentSpeaker("")
    isCancelledRef.current = true
    window.speechSynthesis.cancel()
    stopAudioTimer()
    try {
      const res = await fetch("/api/generate-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "audio_overview",
          sources: selectedSources.map((s) => ({
            name: s.name,
            content: s.content,
          })),
        }),
      })
      const data = await res.json()
      if (!data.text) throw new Error(data.error || "Failed to generate script")
      // Parse ALEX:/SAM: lines
      const lines: { speaker: string; text: string }[] = []
      for (const raw of data.text.split("\n")) {
        const line = raw.trim()
        if (line.startsWith("ALEX:"))
          lines.push({
            speaker: "ALEX",
            text: line.replace(/^ALEX:\s*/, "").trim(),
          })
        else if (line.startsWith("SAM:"))
          lines.push({
            speaker: "SAM",
            text: line.replace(/^SAM:\s*/, "").trim(),
          })
      }
      if (lines.length === 0)
        throw new Error("Could not parse podcast dialogue. Try regenerating.")
      const totalWords = lines.reduce(
        (a, l) => a + l.text.split(/\s+/).length,
        0
      )
      const totalSeconds = Math.round((totalWords / 145) * 60)
      setAudioLines(lines)
      audioTotalSecondsRef.current = totalSeconds
      audioElapsedRef.current = 0
      setAudioDuration(totalSeconds)
      setIsAudioReady(true)
      setIsAudioPlaying(true)
      // Start two-voice playback
      isCancelledRef.current = false
      const all = window.speechSynthesis.getVoices()
      const english = all.filter((v) => v.lang.startsWith("en"))
      const femaleKw = [
        "samantha",
        "victoria",
        "karen",
        "moira",
        "tessa",
        "fiona",
        "zira",
        "hazel",
        "susan",
        "natasha",
        "veena",
        "female",
        "woman",
      ]
      const maleKw = [
        "daniel",
        "david",
        "alex",
        "tom",
        "fred",
        "rishi",
        "mark",
        "oliver",
        "george",
        "male",
        "man",
      ]
      const samVoice =
        english.find((v) =>
          femaleKw.some((k) => v.name.toLowerCase().includes(k))
        ) ||
        english[1] ||
        english[0]
      const alexVoice =
        english.find(
          (v) =>
            maleKw.some((k) => v.name.toLowerCase().includes(k)) &&
            v !== samVoice
        ) ||
        english.find((v) => v !== samVoice) ||
        english[0]
      const speakNext = (index: number) => {
        if (isCancelledRef.current || index >= lines.length) {
          if (!isCancelledRef.current) {
            setIsAudioPlaying(false)
            stopAudioTimer()
            setAudioProgress(100)
            setAudioCurrentTime(totalSeconds)
            setCurrentSpeaker("")
          }
          return
        }
        const ln = lines[index]
        setCurrentSpeaker(ln.speaker)
        const utt = new SpeechSynthesisUtterance(ln.text)
        utt.rate = 0.97
        utt.pitch = ln.speaker === "ALEX" ? 0.92 : 1.18
        utt.volume = 1
        const voice = ln.speaker === "ALEX" ? alexVoice : samVoice
        if (voice) utt.voice = voice
        utt.onend = () => {
          if (!isCancelledRef.current) speakNext(index + 1)
        }
        utt.onerror = () => {
          if (!isCancelledRef.current) speakNext(index + 1)
        }
        window.speechSynthesis.speak(utt)
      }
      speakNext(0)
      stopAudioTimer()
      audioTimerRef.current = setInterval(() => {
        audioElapsedRef.current += 0.5
        setAudioCurrentTime(audioElapsedRef.current)
        setAudioProgress(
          Math.min((audioElapsedRef.current / totalSeconds) * 100, 100)
        )
      }, 500)
    } catch (err: any) {
      alert(err.message || "Failed to generate audio.")
    }
    setIsGeneratingAudio(false)
  }

  const pauseAudio = () => {
    window.speechSynthesis.pause()
    setIsAudioPlaying(false)
    stopAudioTimer()
  }

  const resumeAudio = () => {
    window.speechSynthesis.resume()
    setIsAudioPlaying(true)
    audioTimerRef.current = setInterval(() => {
      audioElapsedRef.current += 0.5
      setAudioCurrentTime(audioElapsedRef.current)
      setAudioProgress(
        Math.min(
          (audioElapsedRef.current / audioTotalSecondsRef.current) * 100,
          100
        )
      )
    }, 500)
  }

  const stopAudio = () => {
    isCancelledRef.current = true
    window.speechSynthesis.cancel()
    setIsAudioPlaying(false)
    stopAudioTimer()
    setAudioProgress(0)
    setAudioCurrentTime(0)
    audioElapsedRef.current = 0
    setCurrentSpeaker("")
  }

  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const selectedSources = sources.filter((s) => s.selected)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isChatLoading])

  const sendMessage = async (text?: string) => {
    const content = text || inputValue.trim()
    if (!content || isChatLoading) return
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
    }
    setMessages((prev) => [...prev, userMsg])
    setInputValue("")
    setIsChatLoading(true)
    setChatError("")
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          sources: selectedSources.map((s) => ({
            name: s.name,
            content: s.content,
          })),
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error)
        throw new Error(data.error || "Failed to get response")
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.content,
        },
      ])
    } catch (err: any) {
      setChatError(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsChatLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    for (const file of Array.from(files)) {
      if (
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf")
      ) {
        setIsUploadingPdf(true)
        const formData = new FormData()
        formData.append("file", file)
        try {
          const res = await fetch("/api/parse-pdf", {
            method: "POST",
            body: formData,
          })
          const data = await res.json()
          if (data.text) {
            setSources((prev) => [
              ...prev,
              {
                id: Math.random().toString(36).substring(7),
                name: file.name,
                content: data.text,
                selected: true,
                type: "pdf",
              },
            ])
          } else {
            alert(`Failed to parse PDF: ${data.error}`)
          }
        } catch {
          alert("Failed to upload PDF. Please try again.")
        }
        setIsUploadingPdf(false)
      } else {
        const reader = new FileReader()
        reader.onload = (event) => {
          const content = event.target?.result as string
          setSources((prev) => [
            ...prev,
            {
              id: Math.random().toString(36).substring(7),
              name: file.name,
              content,
              selected: true,
              type: "txt",
            },
          ])
        }
        reader.readAsText(file)
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const generateNote = async (type: string, title: string) => {
    if (selectedSources.length === 0) {
      alert("Please select at least one source first.")
      return
    }
    setIsGeneratingNote(true)
    try {
      const res = await fetch("/api/generate-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          sources: selectedSources.map((s) => ({
            name: s.name,
            content: s.content,
          })),
        }),
      })
      const data = await res.json()
      if (data.text) {
        const isTimeline = type === "timeline"
        const timelineData = isTimeline ? parseTimeline(data.text) : undefined
        const newNote: Note = {
          id: Date.now().toString(),
          title,
          content: data.text,
          isTimeline,
          timelineData,
        }
        setNotes((prev) => [newNote, ...prev])
        setActiveNote(newNote)
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch {
      alert("Failed to generate. Please try again.")
    }
    setIsGeneratingNote(false)
  }

  const discoverSources = async () => {
    if (selectedSources.length === 0) {
      alert("Please select at least one source first.")
      return
    }
    setIsDiscoveringSources(true)
    // Clear old cached results immediately so stale data disappears
    setRelatedSources([])
    setSourceTopic("")
    setResearchSummary("")
    try {
      const res = await fetch("/api/discover-sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sources: selectedSources.map((s) => ({
            name: s.name,
            content: s.content,
          })),
        }),
      })
      const data = await res.json()
      if (data.error) {
        alert(`Search error: ${data.error}`)
      } else if (data.sources) {
        setRelatedSources(data.sources)
        setSourceTopic(data.topic || "")
        setResearchSummary(data.researchSummary || "")
      }
    } catch {
      alert("Failed to search. Please check your internet connection.")
    }
    setIsDiscoveringSources(false)
  }

  const generateCharts = async () => {
    if (selectedSources.length === 0) {
      alert("Please select at least one source first.")
      return
    }
    setIsGeneratingCharts(true)
    try {
      const res = await fetch("/api/generate-charts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sources: selectedSources.map((s) => ({
            name: s.name,
            content: s.content,
          })),
        }),
      })
      const data = await res.json()
      if (data.charts) setChartData(data.charts)
    } catch {
      alert("Failed to generate charts.")
    }
    setIsGeneratingCharts(false)
  }

  const deleteSource = (id: string) =>
    setSources((prev) => prev.filter((s) => s.id !== id))

  return (
    <div className="flex h-screen flex-col bg-[#f0f4f9] font-sans text-[#1f1f1f]">
      {/* Note Modal */}
      {activeNote && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setActiveNote(null)}
        >
          <div
            className="flex h-full max-h-[82vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 p-5">
              <div className="flex items-center gap-2.5">
                {activeNote.isTimeline && (
                  <MapPin className="h-5 w-5 text-blue-500" />
                )}
                {!activeNote.isTimeline && (
                  <FileText className="h-5 w-5 text-yellow-500" />
                )}
                <h2 className="truncate text-lg font-semibold text-gray-900">
                  {activeNote.title}
                </h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setActiveNote(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="min-h-0 flex-1 p-6 transition-all duration-300">
              {activeNote.isTimeline &&
              activeNote.timelineData &&
              activeNote.timelineData.length > 0 ? (
                <TimelineView events={activeNote.timelineData} />
              ) : (
                <div className="prose prose-sm max-w-none pb-20 prose-headings:text-gray-900 prose-p:leading-relaxed prose-p:text-gray-700 prose-pre:border prose-pre:border-gray-200 prose-pre:bg-gray-100">
                  <ReactMarkdown>{activeNote.content}</ReactMarkdown>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <header className="flex h-16 shrink-0 items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-xl font-medium">Notebook AI</span>
          {!isLeftOpen && (
            <Button
              variant="ghost"
              size="icon"
              className="ml-1 hidden h-8 w-8 rounded-full text-gray-500 md:flex"
              onClick={() => setIsLeftOpen(true)}
            >
              <PanelLeftOpen className="h-5 w-5" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-1">
          {!isRightOpen && (
            <Button
              variant="ghost"
              size="icon"
              className="hidden h-8 w-8 rounded-full text-gray-500 lg:flex"
              onClick={() => setIsRightOpen(true)}
            >
              <PanelRightOpen className="h-5 w-5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="hidden gap-1.5 rounded-full text-sm font-normal sm:flex"
          >
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="hidden gap-1.5 rounded-full text-sm font-normal sm:flex"
          >
            <Settings className="h-4 w-4" /> Settings
          </Button>
          <Avatar className="ml-1 h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="flex flex-1 gap-3 overflow-hidden p-2 pt-0 md:p-4 md:pt-0">
        {/* Left Sidebar - Sources */}
        {isLeftOpen && (
          <aside className="hidden h-full w-[320px] shrink-0 flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm md:flex">
            <div className="flex items-center justify-between px-5 py-4 pb-3">
              <h2 className="text-base font-semibold text-gray-900">Sources</h2>
              <div className="flex items-center gap-0.5 text-gray-400">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full hover:bg-gray-100"
                >
                  <Search className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full hover:bg-gray-100"
                >
                  <Filter className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full hover:bg-gray-100"
                  onClick={() => setIsLeftOpen(false)}
                >
                  <PanelLeftClose className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="px-4 pb-3">
              <input
                type="file"
                accept=".txt,.md,.json,.pdf"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <Button
                variant="outline"
                className="h-10 w-full justify-center rounded-full border-gray-200 text-sm font-medium transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPdf}
              >
                {isUploadingPdf ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing
                    PDF...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" /> Add source
                  </>
                )}
              </Button>
              <p className="mt-1.5 text-center text-[10px] text-gray-400">
                Supports PDF, TXT, MD, JSON
              </p>
            </div>

            <ScrollArea className="min-h-0 flex-1 px-4">
              <div className="flex flex-col gap-1 pb-4">
                {sources.length > 0 && (
                  <div className="mb-1 flex items-center justify-between px-1 py-2">
                    <span className="text-xs font-medium text-gray-500">
                      All sources ({sources.length})
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400">
                        Select all
                      </span>
                      <Checkbox
                        id="select-all"
                        checked={sources.every((s) => s.selected)}
                        onCheckedChange={(checked) =>
                          setSources((s) =>
                            s.map((src) => ({ ...src, selected: !!checked }))
                          )
                        }
                        className="h-4 w-4 shrink-0 rounded-[4px] border-gray-300 shadow-none data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                      />
                    </div>
                  </div>
                )}
                {sources.length === 0 && (
                  <div className="py-12 text-center text-xs text-gray-400">
                    <FileText className="mx-auto mb-2 h-8 w-8 text-gray-200" />
                    No sources yet — upload a PDF or text file to get started
                  </div>
                )}
                {sources.map((s) => (
                  <div
                    key={s.id}
                    className={`group flex cursor-pointer items-center justify-between gap-2 rounded-xl px-2 py-2.5 transition-colors ${s.selected ? "bg-blue-50/70" : "hover:bg-gray-50"}`}
                    onClick={() =>
                      setSources((prev) =>
                        prev.map((src) =>
                          src.id === s.id
                            ? { ...src, selected: !s.selected }
                            : src
                        )
                      )
                    }
                  >
                    <div className="flex flex-1 items-center gap-3 overflow-hidden">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${s.type === "pdf" ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-600"}`}
                      >
                        {getSourceIcon(s.type)}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p
                          className={`truncate text-[13px] leading-tight font-medium ${s.selected ? "text-blue-800" : "text-gray-800"}`}
                        >
                          {s.name}
                        </p>
                        <p className="mt-0.5 text-[10px] text-gray-400">
                          {Math.ceil(s.content.length / 4).toLocaleString()}{" "}
                          tokens
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full text-gray-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteSource(s.id)
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                      <Checkbox
                        checked={s.selected}
                        onCheckedChange={(checked) =>
                          setSources((prev) =>
                            prev.map((src) =>
                              src.id === s.id
                                ? { ...src, selected: !!checked }
                                : src
                            )
                          )
                        }
                        className="h-4 w-4 shrink-0 rounded-[4px] border-gray-300 shadow-none data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </aside>
        )}

        {/* Center Chat */}
        <section className="relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <div className="flex shrink-0 items-center justify-between border-b border-gray-50 px-5 py-3.5">
            <h2 className="text-sm font-medium text-gray-600">Chat</h2>
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 rounded-full text-xs text-gray-400 hover:text-gray-600"
                onClick={() => setMessages([])}
              >
                <RotateCcw className="mr-1.5 h-3 w-3" /> Clear chat
              </Button>
            )}
          </div>

          <ScrollArea className="min-h-0 flex-1 scroll-smooth px-4">
            <div className="flex flex-col gap-5 py-4">
              {messages.length === 0 && (
                <div className="flex flex-col gap-5 py-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f0f4f9] text-gray-800">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        Notebook AI
                      </h1>
                      <p className="text-xs font-medium text-gray-400">
                        {selectedSources.length} source
                        {selectedSources.length !== 1 ? "s" : ""} selected
                      </p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-[15px] leading-relaxed text-gray-600">
                    {selectedSources.length > 0
                      ? "Your sources are ready. Ask questions, generate notes, explore the content, or discover related resources."
                      : "Upload sources from the left panel to get started. Supports PDF, TXT, and Markdown files."}
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      {
                        label: "Summary",
                        icon: <FileText className="h-5 w-5 text-yellow-500" />,
                        action: () => generateNote("summary", "Quick Summary"),
                      },
                      {
                        label: "Audio Overview",
                        icon: <AudioLines className="h-5 w-5 text-blue-500" />,
                        action: () =>
                          generateNote("audio_overview", "Audio Overview"),
                      },
                      {
                        label: "Timeline",
                        icon: <MapPin className="h-5 w-5 text-rose-500" />,
                        action: () => generateNote("timeline", "Timeline"),
                      },
                    ].map((item, i) => (
                      <Card
                        key={i}
                        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-gray-200 p-4 shadow-none transition-all hover:border-blue-200 hover:bg-blue-50"
                        onClick={item.action}
                      >
                        {item.icon}
                        <span className="text-center text-xs font-medium text-gray-700">
                          {item.label}
                        </span>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "assistant" && (
                    <div className="mt-1 mr-2.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                      N
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed ${m.role === "user" ? "rounded-br-[6px] bg-[#e8eef9] text-gray-800" : "rounded-bl-[6px] border border-gray-100 bg-gray-50 text-gray-800"}`}
                  >
                    {m.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-gray-900 prose-p:leading-relaxed prose-p:text-gray-700 prose-strong:text-gray-900 prose-pre:border prose-pre:border-gray-200 prose-pre:bg-gray-100 prose-pre:text-gray-800 prose-li:text-gray-700">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    ) : (
                      m.content
                    )}
                  </div>
                </div>
              ))}

              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="mt-1 mr-2.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    N
                  </div>
                  <div className="flex max-w-[80%] items-center gap-2 rounded-2xl rounded-bl-[6px] border border-gray-100 bg-gray-50 px-4 py-3">
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400" />
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400 [animation-delay:0.2s]" />
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400 [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              {chatError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {chatError}
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="shrink-0 rounded-b-3xl bg-white px-4 pt-2 pb-6 md:px-8">
            <div className="relative mx-auto flex max-w-2xl flex-col gap-2">
              {messages.length === 0 && (
                <div
                  className="flex items-center gap-2 overflow-x-auto pb-1"
                  style={{ scrollbarWidth: "none" }}
                >
                  {SUGGESTION_CHIPS.map((chip, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(chip)}
                      disabled={isChatLoading}
                      className="shrink-0 rounded-xl border border-gray-200 bg-white px-3 py-2 text-[12px] whitespace-nowrap text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex items-center rounded-full border border-gray-200 bg-white py-2 pr-2 pl-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all focus-within:border-[rgba(138,180,248,0.5)] focus-within:shadow-[0_4px_24px_rgba(138,180,248,0.15)]">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                  placeholder="Ask a question or make a request..."
                  disabled={isChatLoading}
                  className="flex-1 border-none bg-transparent py-1.5 text-[15px] font-medium text-gray-700 outline-none placeholder:text-[#a1a5ab]"
                />
                <div className="flex shrink-0 items-center gap-4 pl-2">
                  <span className="hidden text-[13px] font-medium text-[#a1a5ab] sm:block">
                    {selectedSources.length} source
                    {selectedSources.length !== 1 ? "s" : ""}
                  </span>
                  <Button
                    onClick={() => sendMessage()}
                    disabled={isChatLoading || !inputValue.trim()}
                    size="icon"
                    className="flex h-10 w-[54px] items-center justify-center rounded-[24px] bg-[#8ab4f8] text-white shadow-none transition-colors hover:bg-[#7a9ff7] disabled:opacity-50"
                  >
                    {isChatLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 12h16" />
                        <path d="m13 5 7 7-7 7" />
                      </svg>
                    )}
                  </Button>
                </div>
              </div>
              <p className="mt-1 text-center text-[11px] font-medium tracking-wide text-[#a1a5ab]">
                Notebook AI can be inaccurate. Double check important
                information.
              </p>
            </div>
          </div>
        </section>

        {/* Right Sidebar */}
        {isRightOpen && (
          <aside className="hidden h-full w-[320px] shrink-0 flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm lg:flex">
            {/* Tab Header */}
            <div className="flex shrink-0 items-center justify-between px-4 pt-4 pb-0">
              <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1">
                {RIGHT_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setRightTab(tab.id as any)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${rightTab === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 h-7 w-7 rounded-full text-gray-400"
                onClick={() => setIsRightOpen(false)}
              >
                <PanelRightClose className="h-3.5 w-3.5" />
              </Button>
            </div>

            <ScrollArea className="mt-3 min-h-0 flex-1">
              {/* === STUDIO TAB === */}
              {rightTab === "studio" && (
                <div className="flex flex-col gap-5 p-4 pb-8">
                  {/* Audio Overview */}
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-800">
                        Audio Overview
                      </h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full text-gray-400"
                      >
                        <Info className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <Card className="flex flex-col gap-3 rounded-2xl border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-3.5 shadow-none">
                      <div className="flex items-start gap-3">
                        <div
                          className={`shrink-0 rounded-xl bg-white p-2 shadow-sm ${isAudioPlaying ? "text-blue-600" : "text-blue-500"}`}
                        >
                          <AudioLines
                            className={`h-5 w-5 ${isAudioPlaying ? "animate-pulse" : ""}`}
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900">
                            Deep dive conversation
                          </h4>
                          <p className="mt-0.5 text-[11px] text-gray-500">
                            {isGeneratingAudio
                              ? "Generating podcast script..."
                              : isAudioPlaying && currentSpeaker
                                ? `${currentSpeaker === "ALEX" ? "Alex" : "Sam"} is speaking`
                                : isAudioReady && !isAudioPlaying
                                  ? "Paused — ready to resume"
                                  : isAudioReady
                                    ? "Audio ready"
                                    : "2 hosts · English"}
                          </p>
                        </div>
                      </div>

                      {isAudioReady && (
                        <div className="flex flex-col gap-1.5">
                          {isAudioPlaying && (
                            <div className="flex h-6 items-end justify-center gap-[3px]">
                              {[
                                3, 6, 10, 14, 18, 14, 10, 8, 12, 16, 10, 6, 14,
                                10, 6, 3,
                              ].map((h, i) => (
                                <div
                                  key={i}
                                  className="w-1 rounded-full bg-blue-500"
                                  style={{
                                    height: `${h}px`,
                                    animation: `pulse ${0.5 + (i % 3) * 0.2}s ease-in-out infinite alternate`,
                                    animationDelay: `${i * 0.07}s`,
                                  }}
                                />
                              ))}
                            </div>
                          )}
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-blue-100">
                            <div
                              className="h-full rounded-full bg-blue-600 transition-all duration-500"
                              style={{ width: `${audioProgress}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] font-medium text-gray-400">
                            <span>{formatTime(audioCurrentTime)}</span>
                            <span>{formatTime(audioDuration)}</span>
                          </div>
                        </div>
                      )}

                      {isAudioReady ? (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={stopAudio}
                            className="h-8 w-8 shrink-0 rounded-full border-blue-200 bg-white text-gray-600 hover:border-red-200 hover:text-red-500"
                          >
                            <Square className="h-3 w-3 fill-current" />
                          </Button>
                          <Button
                            onClick={isAudioPlaying ? pauseAudio : resumeAudio}
                            className="h-8 flex-1 gap-1 rounded-full bg-blue-600 text-xs font-medium text-white shadow-none hover:bg-blue-700"
                          >
                            {isAudioPlaying ? (
                              <>
                                <Pause className="h-3.5 w-3.5 fill-current" />{" "}
                                Pause
                              </>
                            ) : (
                              <>
                                <Play className="h-3.5 w-3.5 fill-current" />{" "}
                                Resume
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={generateAudio}
                            disabled={isGeneratingAudio}
                            className="h-8 flex-1 rounded-full border-blue-200 bg-white text-xs font-medium text-blue-700 hover:bg-blue-50"
                          >
                            {isGeneratingAudio ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              "Regenerate"
                            )}
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            className="h-8 flex-1 rounded-full border-blue-200 bg-white text-xs font-medium"
                          >
                            Customize
                          </Button>
                          <Button
                            onClick={generateAudio}
                            disabled={isGeneratingAudio}
                            className="h-8 flex-1 gap-1 rounded-full bg-blue-600 text-xs font-medium text-white shadow-none hover:bg-blue-700"
                          >
                            {isGeneratingAudio ? (
                              <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />{" "}
                                Generating...
                              </>
                            ) : (
                              <>
                                <Volume2 className="h-3.5 w-3.5" /> Generate
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </Card>
                  </div>

                  {/* Timeline Roadmap */}
                  <div className="flex flex-col gap-2.5">
                    <h3 className="text-sm font-semibold text-gray-800">
                      Timeline Roadmap
                    </h3>
                    <Card className="flex flex-col gap-3 rounded-2xl border-gray-200 border-rose-100 bg-gradient-to-br from-rose-50 to-orange-50 p-3.5 shadow-none">
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 rounded-xl bg-white p-2 text-rose-500 shadow-sm">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900">
                            Visual Timeline
                          </h4>
                          <p className="mt-0.5 text-[11px] text-gray-500">
                            Chronological roadmap of key events
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() =>
                          generateNote("timeline", "Timeline Roadmap")
                        }
                        disabled={isGeneratingNote}
                        className="h-8 w-full rounded-full bg-rose-500 text-xs font-medium text-white shadow-none hover:bg-rose-600"
                      >
                        {isGeneratingNote ? (
                          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <MapPin className="mr-1.5 h-3.5 w-3.5" />
                        )}
                        Generate Timeline
                      </Button>
                    </Card>
                  </div>

                  {/* Notes Section */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-800">
                        Notes
                      </h3>
                      <div className="flex items-center gap-0.5 text-gray-400">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full"
                        >
                          <Search className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full"
                        >
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="h-9 w-full justify-center rounded-full border-gray-200 text-sm font-medium"
                      onClick={() => generateNote("summary", "New Note")}
                      disabled={isGeneratingNote}
                    >
                      {isGeneratingNote ? (
                        <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Plus className="mr-2 h-4 w-4" />
                      )}
                      Summary
                    </Button>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        {
                          type: "study_guide",
                          label: "Study guide",
                          icon: <NotebookTabs className="h-3 w-3" />,
                        },
                        {
                          type: "briefing_doc",
                          label: "Briefing doc",
                          icon: <FileCheck className="h-3 w-3" />,
                        },
                        {
                          type: "faq",
                          label: "FAQ",
                          icon: <FileQuestion className="h-3 w-3" />,
                        },
                        {
                          type: "timeline",
                          label: "Timeline",
                          icon: <Clock className="h-3 w-3" />,
                        },
                      ].map((item) => (
                        <Badge
                          key={item.type}
                          variant="outline"
                          className="cursor-pointer rounded-full border-gray-200 px-2.5 py-1 text-xs font-normal transition-colors hover:border-blue-300 hover:bg-blue-50"
                          onClick={() =>
                            !isGeneratingNote &&
                            generateNote(item.type, item.label)
                          }
                        >
                          {isGeneratingNote ? (
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                          ) : (
                            React.cloneElement(item.icon, {
                              className: "mr-1.5 h-3 w-3",
                            } as any)
                          )}
                          {item.label}
                        </Badge>
                      ))}
                    </div>

                    <div className="mt-1 flex flex-col gap-2">
                      {notes.length === 0 ? (
                        <p className="py-6 text-center text-[11px] text-gray-400">
                          No notes yet. Use the buttons above to generate notes.
                        </p>
                      ) : (
                        notes.map((note) => (
                          <div
                            key={note.id}
                            className="group flex cursor-pointer flex-col gap-1.5 rounded-xl border border-transparent p-3 transition-colors hover:border-gray-200 hover:bg-gray-50"
                            onClick={() => setActiveNote(note)}
                          >
                            <div className="flex items-center gap-2">
                              {note.isTimeline ? (
                                <MapPin className="h-4 w-4 shrink-0 text-rose-500" />
                              ) : (
                                <FileText className="h-4 w-4 shrink-0 text-yellow-500" />
                              )}
                              <p className="truncate text-[13px] font-medium text-gray-900 transition-colors group-hover:text-blue-600">
                                {note.title}
                              </p>
                              <ChevronRight className="ml-auto h-3.5 w-3.5 shrink-0 text-gray-300" />
                            </div>
                            <p className="ml-6 line-clamp-2 text-[11px] leading-relaxed text-gray-500">
                              {note.content}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* === SOURCES TAB === */}
              {rightTab === "sources" && (
                <div className="flex flex-col gap-4 p-4 pb-8">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-semibold text-gray-800">
                      Related Resources
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      AI-discovered sources from across the web
                    </p>
                  </div>

                  <Button
                    onClick={discoverSources}
                    disabled={isDiscoveringSources}
                    className="h-10 w-full gap-2 rounded-2xl bg-indigo-600 text-sm font-medium text-white shadow-none hover:bg-indigo-700"
                  >
                    {isDiscoveringSources ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    {isDiscoveringSources
                      ? "Discovering sources..."
                      : "Discover Related Sources"}
                  </Button>

                  {sourceTopic && (
                    <div className="flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2">
                      <Globe className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
                      <p className="truncate text-[11px] font-medium text-indigo-700">
                        Topic: {sourceTopic}
                      </p>
                    </div>
                  )}

                  {researchSummary && (
                    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white p-4 shadow-sm">
                      <div className="mb-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-indigo-600" />
                        <h4 className="text-[12px] font-bold tracking-tight text-indigo-900 uppercase">
                          Research Overview
                        </h4>
                      </div>
                      <p className="text-[12px] leading-relaxed text-gray-700 italic">
                        "{researchSummary}"
                      </p>
                    </div>
                  )}

                  {relatedSources.length === 0 && !isDiscoveringSources && (
                    <div className="flex flex-col items-center gap-3 py-10">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                        <Globe className="h-8 w-8 text-gray-300" />
                      </div>
                      <p className="text-center text-[12px] leading-relaxed text-gray-400">
                        Click the button above to discover
                        <br />
                        related learning resources
                      </p>
                    </div>
                  )}

                  {relatedSources.length > 0 &&
                    (() => {
                      const youtubeItems = relatedSources.filter(
                        (s) => s.type === "youtube"
                      )
                      const otherItems = relatedSources.filter(
                        (s) => s.type !== "youtube"
                      )
                      return (
                        <div className="flex flex-col gap-4">
                          {/* YouTube Section */}
                          {youtubeItems.length > 0 && (
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-1.5">
                                <Youtube className="h-3.5 w-3.5 text-red-500" />
                                <h4 className="text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
                                  YouTube
                                </h4>
                              </div>
                              <div className="flex flex-col gap-2.5">
                                {youtubeItems.map((src, i) => (
                                  <a
                                    key={i}
                                    href={src.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white transition-all hover:border-red-200 hover:shadow-md"
                                  >
                                    {/* Thumbnail */}
                                    <div
                                      className="relative w-full overflow-hidden bg-gray-100"
                                      style={{ aspectRatio: "16/9" }}
                                    >
                                      {src.videoId ? (
                                        <img
                                          src={`https://img.youtube.com/vi/${src.videoId}/mqdefault.jpg`}
                                          alt={src.title}
                                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                          onError={(e) => {
                                            ;(
                                              e.target as HTMLImageElement
                                            ).src =
                                              `https://img.youtube.com/vi/${src.videoId}/default.jpg`
                                          }}
                                        />
                                      ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                          <Youtube className="h-8 w-8 text-red-400" />
                                        </div>
                                      )}
                                      {/* Play overlay */}
                                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/20">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600/90 opacity-0 shadow-lg transition-all group-hover:scale-110 group-hover:opacity-100">
                                          <Play className="ml-0.5 h-5 w-5 fill-white text-white" />
                                        </div>
                                      </div>
                                      {/* Duration badge area */}
                                      <div className="absolute right-1.5 bottom-1.5 rounded bg-black/75 px-1.5 py-0.5">
                                        <span className="text-[9px] font-medium text-white">
                                          YouTube
                                        </span>
                                      </div>
                                    </div>
                                    {/* Info */}
                                    <div className="p-2.5">
                                      <p className="line-clamp-2 text-[12px] leading-tight font-semibold text-gray-900 group-hover:text-red-700">
                                        {src.title}
                                      </p>
                                      {src.channel && (
                                        <p className="mt-1 flex items-center gap-1 text-[10px] text-gray-400">
                                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-400"></span>
                                          {src.channel}
                                        </p>
                                      )}
                                      <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-gray-500">
                                        {src.description}
                                      </p>
                                    </div>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Other Resources */}
                          {otherItems.length > 0 && (
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-1.5">
                                <Globe className="h-3.5 w-3.5 text-indigo-500" />
                                <h4 className="text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
                                  Web Resources
                                </h4>
                              </div>
                              <div className="flex flex-col gap-2">
                                {otherItems.map((src, i) => {
                                  const favicon = src.domain
                                    ? `https://www.google.com/s2/favicons?sz=32&domain=${src.domain}`
                                    : null
                                  const typeColors: Record<string, string> = {
                                    github:
                                      "border-gray-200 hover:border-gray-400",
                                    course:
                                      "border-purple-100 hover:border-purple-300",
                                    documentation:
                                      "border-blue-100 hover:border-blue-300",
                                    book: "border-amber-100 hover:border-amber-300",
                                    website:
                                      "border-gray-100 hover:border-indigo-300",
                                  }
                                  const typeBadgeColors: Record<
                                    string,
                                    string
                                  > = {
                                    github: "bg-gray-100 text-gray-700",
                                    course: "bg-purple-50 text-purple-700",
                                    documentation: "bg-blue-50 text-blue-700",
                                    book: "bg-amber-50 text-amber-700",
                                    website: "bg-indigo-50 text-indigo-700",
                                  }
                                  return (
                                    <a
                                      key={i}
                                      href={src.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`group flex items-start gap-3 rounded-xl border bg-white p-3 transition-all hover:shadow-md ${typeColors[src.type] || "border-gray-100 hover:border-indigo-300"}`}
                                    >
                                      {/* Favicon / Icon */}
                                      <div
                                        className={`flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg ${getResourceBg(src.type)}`}
                                      >
                                        {favicon ? (
                                          <img
                                            src={favicon}
                                            alt=""
                                            className="h-5 w-5 object-contain"
                                            onError={(e) => {
                                              ;(
                                                e.target as HTMLImageElement
                                              ).style.display = "none"
                                            }}
                                          />
                                        ) : (
                                          getResourceIcon(src.type)
                                        )}
                                      </div>
                                      {/* Text */}
                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-1">
                                          <p className="line-clamp-1 text-[12px] leading-snug font-semibold text-gray-900 group-hover:text-indigo-700">
                                            {src.title}
                                          </p>
                                          <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 text-gray-300 group-hover:text-indigo-400" />
                                        </div>
                                        {src.siteName && (
                                          <p className="mt-0.5 text-[10px] text-gray-400">
                                            {src.siteName}
                                          </p>
                                        )}
                                        <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-gray-500">
                                          {src.description}
                                        </p>
                                        <span
                                          className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[9px] font-medium capitalize ${typeBadgeColors[src.type] || "bg-gray-100 text-gray-600"}`}
                                        >
                                          {src.type}
                                        </span>
                                      </div>
                                    </a>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })()}
                </div>
              )}

              {/* === CHARTS TAB === */}
              {rightTab === "charts" && (
                <div className="flex flex-col gap-4 p-4 pb-8">
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-sm font-semibold text-gray-800">
                      Data Visualization
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      AI-generated charts from your source content
                    </p>
                  </div>

                  <Button
                    onClick={generateCharts}
                    disabled={isGeneratingCharts}
                    className="h-10 w-full gap-2 rounded-2xl bg-violet-600 text-sm font-medium text-white shadow-none hover:bg-violet-700"
                  >
                    {isGeneratingCharts ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <BarChart2 className="h-4 w-4" />
                    )}
                    {isGeneratingCharts
                      ? "Generating charts..."
                      : "Generate Charts"}
                  </Button>

                  {chartData.length === 0 && !isGeneratingCharts && (
                    <div className="flex flex-col items-center gap-3 py-10">
                      <BarChart2 className="h-10 w-10 text-gray-200" />
                      <p className="text-center text-[12px] leading-relaxed text-gray-400">
                        Click the button above to visualize
                        <br />
                        your source content as charts
                      </p>
                    </div>
                  )}

                  {chartData.map((chart, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                    >
                      <h4 className="mb-1 text-[13px] font-semibold text-gray-900">
                        {chart.title}
                      </h4>
                      <p className="mb-4 text-[10px] text-gray-500">
                        {chart.description}
                      </p>

                      {chart.type === "bar" && (
                        <ResponsiveContainer width="100%" height={180}>
                          <BarChart
                            data={chart.data}
                            margin={{ top: 0, right: 0, left: -20, bottom: 40 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#f0f0f0"
                            />
                            <XAxis
                              dataKey="name"
                              tick={{ fontSize: 10, fill: "#6b7280" }}
                              angle={-35}
                              textAnchor="end"
                              interval={0}
                            />
                            <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} />
                            <Tooltip
                              contentStyle={{
                                fontSize: 11,
                                borderRadius: 8,
                                border: "1px solid #e5e7eb",
                              }}
                            />
                            <Bar
                              dataKey="value"
                              fill="#6366f1"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      )}

                      {chart.type === "pie" && (
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie
                              data={chart.data}
                              cx="50%"
                              cy="50%"
                              innerRadius={45}
                              outerRadius={75}
                              paddingAngle={3}
                              dataKey="value"
                              label={({ name, percent }: any) =>
                                `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`
                              }
                              labelLine={false}
                              fontSize={9}
                            >
                              {chart.data.map((_: any, idx: number) => (
                                <Cell
                                  key={`cell-${idx}`}
                                  fill={PIE_COLORS[idx % PIE_COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{ fontSize: 11, borderRadius: 8 }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      )}

                      {chart.type === "radar" && (
                        <ResponsiveContainer width="100%" height={200}>
                          <RadarChart data={chart.data}>
                            <PolarGrid stroke="#e5e7eb" />
                            <PolarAngleAxis
                              dataKey="subject"
                              tick={{ fontSize: 10, fill: "#6b7280" }}
                            />
                            <PolarRadiusAxis tick={{ fontSize: 9 }} />
                            <Radar
                              name="Value"
                              dataKey="value"
                              stroke="#8b5cf6"
                              fill="#8b5cf6"
                              fillOpacity={0.25}
                            />
                            <Tooltip
                              contentStyle={{ fontSize: 11, borderRadius: 8 }}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </aside>
        )}
      </main>
    </div>
  )
}
