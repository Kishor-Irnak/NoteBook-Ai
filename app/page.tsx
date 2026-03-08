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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend,
} from "recharts"

// Types
type Source = { id: string; name: string; content: string; selected: boolean; type: 'txt' | 'pdf' | 'other' }
type ChatMessage = { id: string; role: 'user' | 'assistant'; content: string }
type Note = { id: string; title: string; content: string; isTimeline?: boolean; timelineData?: TimelineEvent[] }
type TimelineEvent = { date: string; title: string; description: string; color?: string }
type RelatedSource = { type: string; title: string; url: string; description: string; icon: string }
type ChartData = { type: string; title: string; description: string; data: any[] }

const PIE_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6']

const SUGGESTION_CHIPS = [
  "Summarize the key points from my sources",
  "What are the main concepts I should know?",
  "Create a quiz based on these sources",
  "Explain the most important ideas simply",
]

const RIGHT_TABS = [
  { id: 'studio', label: 'Studio', icon: <NotebookTabs className="h-3.5 w-3.5" /> },
  { id: 'sources', label: 'Sources', icon: <Globe className="h-3.5 w-3.5" /> },
  { id: 'charts', label: 'Charts', icon: <BarChart2 className="h-3.5 w-3.5" /> },
]

function getSourceIcon(type: Source['type']) {
  if (type === 'pdf') return <span className="text-[9px] font-bold text-red-600">PDF</span>
  return <FileText className="h-3.5 w-3.5" />
}

function getResourceIcon(type: string) {
  switch (type) {
    case 'github': return <GitBranch className="h-4 w-4 text-gray-700" />
    case 'youtube': return <Youtube className="h-4 w-4 text-red-500" />
    case 'course': return <BookOpen className="h-4 w-4 text-purple-600" />
    case 'documentation': return <FileText className="h-4 w-4 text-blue-600" />
    case 'book': return <BookOpen className="h-4 w-4 text-amber-600" />
    default: return <Globe className="h-4 w-4 text-indigo-500" />
  }
}

function getResourceBg(type: string) {
  switch (type) {
    case 'github': return 'bg-gray-100'
    case 'youtube': return 'bg-red-50'
    case 'course': return 'bg-purple-50'
    case 'documentation': return 'bg-blue-50'
    case 'book': return 'bg-amber-50'
    default: return 'bg-indigo-50'
  }
}

// Visual Timeline Component
function TimelineView({ events }: { events: TimelineEvent[] }) {
  const dotColors = ['bg-blue-500', 'bg-purple-500', 'bg-rose-500', 'bg-amber-500', 'bg-green-500', 'bg-cyan-500']
  return (
    <div className="flex flex-col gap-0">
      {events.map((event, i) => (
        <div key={i} className="flex gap-4 group">
          <div className="flex flex-col items-center">
            <div className={`h-3 w-3 rounded-full shrink-0 mt-1 ${dotColors[i % dotColors.length]} ring-4 ring-white shadow-sm`} />
            {i < events.length - 1 && <div className="w-0.5 flex-1 bg-gradient-to-b from-gray-200 to-gray-100 my-1" />}
          </div>
          <div className={`pb-5 ${i === events.length - 1 ? 'pb-0' : ''}`}>
            <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wide mb-0.5">{event.date}</p>
            <h4 className="text-sm font-semibold text-gray-900 leading-tight">{event.title}</h4>
            <p className="text-[12px] text-gray-600 mt-1 leading-relaxed">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// Parse timeline markdown into structured events
function parseTimeline(content: string): TimelineEvent[] {
  const events: TimelineEvent[] = []
  const lines = content.split('\n')
  let current: Partial<TimelineEvent> | null = null

  for (const line of lines) {
    const boldMatch = line.match(/\*\*(.+?)\*\*[:\s–-]+(.+)/)
    const headingMatch = line.match(/^#+\s+(.+)/)
    const bulletMatch = line.match(/^[-*]\s+(.+)/)

    if (boldMatch) {
      if (current) events.push(current as TimelineEvent)
      current = { date: boldMatch[1].trim(), title: boldMatch[2].trim(), description: '' }
    } else if (headingMatch && !current) {
      // skip main heading
    } else if (current && bulletMatch) {
      current.description = (current.description || '') + bulletMatch[1].trim() + ' '
    } else if (current && line.trim() && !line.startsWith('#')) {
      current.description = (current.description || '') + line.trim() + ' '
    }
  }
  if (current) events.push(current as TimelineEvent)
  return events.slice(0, 12)
}

export default function NotebookLM() {
  const [isLeftOpen, setIsLeftOpen] = useState(true)
  const [isRightOpen, setIsRightOpen] = useState(true)
  const [rightTab, setRightTab] = useState<'studio' | 'sources' | 'charts'>('studio')

  const [sources, setSources] = useState<Source[]>([{
    id: 'demo-1',
    name: "Sample Physics Notes.txt",
    content: "Newton's First Law: An object at rest stays at rest and an object in motion stays in motion unless acted upon by an unbalanced force (inertia).\n\nNewton's Second Law: Force equals mass times acceleration (F=ma). The acceleration of an object depends on the net force acting on it and its mass.\n\nNewton's Third Law: For every action, there is an equal and opposite reaction. Forces always occur in pairs.\n\nGravity: The force of attraction between objects with mass. On Earth, gravitational acceleration is approximately 9.8 m/s².\n\nFriction: A force that opposes motion between surfaces in contact. Static friction prevents motion; kinetic friction slows moving objects.\n\nMomentum: The product of an object's mass and velocity (p = mv). In a closed system, total momentum is conserved.",
    selected: true,
    type: 'txt',
  }])

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [chatError, setChatError] = useState("")

  const [notes, setNotes] = useState<Note[]>([])
  const [isGeneratingNote, setIsGeneratingNote] = useState(false)
  const [activeNote, setActiveNote] = useState<Note | null>(null)

  const [isUploadingPdf, setIsUploadingPdf] = useState(false)

  // Related Sources
  const [relatedSources, setRelatedSources] = useState<RelatedSource[]>([])
  const [sourceTopic, setSourceTopic] = useState("")
  const [isDiscoveringSources, setIsDiscoveringSources] = useState(false)

  // Charts
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [isGeneratingCharts, setIsGeneratingCharts] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const selectedSources = sources.filter(s => s.selected)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isChatLoading])

  const sendMessage = async (text?: string) => {
    const content = text || inputValue.trim()
    if (!content || isChatLoading) return
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content }
    setMessages(prev => [...prev, userMsg])
    setInputValue("")
    setIsChatLoading(true)
    setChatError("")
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          sources: selectedSources.map(s => ({ name: s.name, content: s.content })),
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to get response')
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: data.content }])
    } catch (err: any) {
      setChatError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsChatLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    for (const file of Array.from(files)) {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        setIsUploadingPdf(true)
        const formData = new FormData()
        formData.append('file', file)
        try {
          const res = await fetch('/api/parse-pdf', { method: 'POST', body: formData })
          const data = await res.json()
          if (data.text) {
            setSources(prev => [...prev, { id: Math.random().toString(36).substring(7), name: file.name, content: data.text, selected: true, type: 'pdf' }])
          } else {
            alert(`Failed to parse PDF: ${data.error}`)
          }
        } catch {
          alert('Failed to upload PDF. Please try again.')
        }
        setIsUploadingPdf(false)
      } else {
        const reader = new FileReader()
        reader.onload = (event) => {
          const content = event.target?.result as string
          setSources(prev => [...prev, { id: Math.random().toString(36).substring(7), name: file.name, content, selected: true, type: 'txt' }])
        }
        reader.readAsText(file)
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const generateNote = async (type: string, title: string) => {
    if (selectedSources.length === 0) { alert('Please select at least one source first.'); return }
    setIsGeneratingNote(true)
    try {
      const res = await fetch('/api/generate-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, sources: selectedSources.map(s => ({ name: s.name, content: s.content })) }),
      })
      const data = await res.json()
      if (data.text) {
        const isTimeline = type === 'timeline'
        const timelineData = isTimeline ? parseTimeline(data.text) : undefined
        const newNote: Note = { id: Date.now().toString(), title, content: data.text, isTimeline, timelineData }
        setNotes(prev => [newNote, ...prev])
        setActiveNote(newNote)
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch {
      alert('Failed to generate. Please try again.')
    }
    setIsGeneratingNote(false)
  }

  const discoverSources = async () => {
    if (selectedSources.length === 0) { alert('Please select at least one source first.'); return }
    setIsDiscoveringSources(true)
    try {
      const res = await fetch('/api/discover-sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sources: selectedSources.map(s => ({ name: s.name, content: s.content })) }),
      })
      const data = await res.json()
      if (data.sources) {
        setRelatedSources(data.sources)
        setSourceTopic(data.topic || '')
      }
    } catch {
      alert('Failed to discover sources.')
    }
    setIsDiscoveringSources(false)
  }

  const generateCharts = async () => {
    if (selectedSources.length === 0) { alert('Please select at least one source first.'); return }
    setIsGeneratingCharts(true)
    try {
      const res = await fetch('/api/generate-charts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sources: selectedSources.map(s => ({ name: s.name, content: s.content })) }),
      })
      const data = await res.json()
      if (data.charts) setChartData(data.charts)
    } catch {
      alert('Failed to generate charts.')
    }
    setIsGeneratingCharts(false)
  }

  const deleteSource = (id: string) => setSources(prev => prev.filter(s => s.id !== id))

  return (
    <div className="flex h-screen flex-col bg-[#f0f4f9] text-[#1f1f1f] font-sans">

      {/* Note Modal */}
      {activeNote && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setActiveNote(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[82vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                {activeNote.isTimeline && <MapPin className="h-5 w-5 text-blue-500" />}
                {!activeNote.isTimeline && <FileText className="h-5 w-5 text-yellow-500" />}
                <h2 className="text-lg font-semibold text-gray-900 truncate">{activeNote.title}</h2>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setActiveNote(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-6">
              {activeNote.isTimeline && activeNote.timelineData && activeNote.timelineData.length > 0 ? (
                <TimelineView events={activeNote.timelineData} />
              ) : (
                <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-pre:bg-gray-100 prose-pre:border prose-pre:border-gray-200">
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-xl font-medium">Notebook AI</span>
          {!isLeftOpen && (
            <Button variant="ghost" size="icon" className="hidden md:flex h-8 w-8 rounded-full text-gray-500 ml-1" onClick={() => setIsLeftOpen(true)}>
              <PanelLeftOpen className="h-5 w-5" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-1">
          {!isRightOpen && (
            <Button variant="ghost" size="icon" className="hidden lg:flex h-8 w-8 rounded-full text-gray-500" onClick={() => setIsRightOpen(true)}>
              <PanelRightOpen className="h-5 w-5" />
            </Button>
          )}
          <Button variant="ghost" size="sm" className="hidden sm:flex text-sm font-normal rounded-full gap-1.5">
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <Button variant="ghost" size="sm" className="hidden sm:flex text-sm font-normal rounded-full gap-1.5">
            <Settings className="h-4 w-4" /> Settings
          </Button>
          <Avatar className="h-8 w-8 ml-1">
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden p-2 pt-0 md:p-4 md:pt-0 gap-3">

        {/* Left Sidebar - Sources */}
        {isLeftOpen && (
          <aside className="hidden md:flex w-[320px] shrink-0 flex-col rounded-3xl bg-white shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 pb-3">
              <h2 className="text-base font-semibold text-gray-900">Sources</h2>
              <div className="flex items-center gap-0.5 text-gray-400">
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-gray-100">
                  <Search className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-gray-100">
                  <Filter className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-gray-100" onClick={() => setIsLeftOpen(false)}>
                  <PanelLeftClose className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="px-4 pb-3">
              <input type="file" accept=".txt,.md,.json,.pdf" multiple className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
              <Button
                variant="outline"
                className="w-full justify-center rounded-full text-sm font-medium border-gray-200 h-10 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPdf}
              >
                {isUploadingPdf
                  ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing PDF...</>
                  : <><Plus className="mr-2 h-4 w-4" /> Add source</>}
              </Button>
              <p className="text-[10px] text-gray-400 text-center mt-1.5">Supports PDF, TXT, MD, JSON</p>
            </div>

            <ScrollArea className="flex-1 px-4">
              <div className="flex flex-col gap-1 pb-4">
                {sources.length > 0 && (
                  <div className="flex items-center justify-between py-2 px-1 mb-1">
                    <span className="text-xs font-medium text-gray-500">All sources ({sources.length})</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400">Select all</span>
                      <Checkbox
                        id="select-all"
                        checked={sources.every(s => s.selected)}
                        onCheckedChange={(checked) => setSources(s => s.map(src => ({ ...src, selected: !!checked })))}
                        className="h-4 w-4 shrink-0 border-gray-300 rounded-[4px] data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 shadow-none"
                      />
                    </div>
                  </div>
                )}
                {sources.length === 0 && (
                  <div className="text-xs text-gray-400 text-center py-12">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-gray-200" />
                    No sources yet — upload a PDF or text file to get started
                  </div>
                )}
                {sources.map(s => (
                  <div key={s.id} className={`flex items-center justify-between gap-2 px-2 py-2.5 rounded-xl group transition-colors cursor-pointer ${s.selected ? 'bg-blue-50/70' : 'hover:bg-gray-50'}`}
                    onClick={() => setSources(prev => prev.map(src => src.id === s.id ? { ...src, selected: !s.selected } : src))}>
                    <div className="flex items-center gap-3 overflow-hidden flex-1">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${s.type === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-600'}`}>
                        {getSourceIcon(s.type)}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className={`text-[13px] font-medium truncate leading-tight ${s.selected ? 'text-blue-800' : 'text-gray-800'}`}>{s.name}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{Math.ceil(s.content.length / 4).toLocaleString()} tokens</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button variant="ghost" size="icon"
                        className="h-6 w-6 rounded-full text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => { e.stopPropagation(); deleteSource(s.id) }}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                      <Checkbox
                        checked={s.selected}
                        onCheckedChange={(checked) => setSources(prev => prev.map(src => src.id === s.id ? { ...src, selected: !!checked } : src))}
                        className="h-4 w-4 shrink-0 border-gray-300 rounded-[4px] data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 shadow-none"
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
        <section className="flex flex-1 min-w-0 flex-col rounded-3xl bg-white shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 shrink-0 border-b border-gray-50">
            <h2 className="text-sm font-medium text-gray-600">Chat</h2>
            {messages.length > 0 && (
              <Button variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-gray-600 rounded-full h-7" onClick={() => setMessages([])}>
                <RotateCcw className="h-3 w-3 mr-1.5" /> Clear chat
              </Button>
            )}
          </div>

          <ScrollArea className="flex-1 h-full">
            <div className="max-w-2xl mx-auto px-4 md:px-8 py-6 flex flex-col gap-6 pb-64">
              {messages.length === 0 && (
                <>
                  <div>
                    <div className="text-5xl mb-4">🔬</div>
                    <h1 className="text-3xl font-light text-gray-900 tracking-tight mb-1">Notebook AI</h1>
                    <p className="text-xs text-gray-400 font-medium">{selectedSources.length} source{selectedSources.length !== 1 ? 's' : ''} selected</p>
                  </div>
                  <div className="text-gray-600 leading-relaxed text-[15px] bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    {selectedSources.length > 0
                      ? 'Your sources are ready. Ask questions, generate notes, explore the content, or discover related resources.'
                      : 'Upload sources from the left panel to get started. Supports PDF, TXT, and Markdown files.'}
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { label: 'Add note', icon: <FileText className="h-5 w-5 text-yellow-500" />, action: () => generateNote('summary', 'Quick Summary') },
                      { label: 'Audio Overview', icon: <AudioLines className="h-5 w-5 text-blue-500" />, action: () => generateNote('audio_overview', 'Audio Overview') },
                      { label: 'Timeline', icon: <MapPin className="h-5 w-5 text-rose-500" />, action: () => generateNote('timeline', 'Timeline') },
                    ].map((item, i) => (
                      <Card key={i} className="flex flex-col items-center justify-center p-4 rounded-2xl border-gray-200 cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all shadow-none gap-2" onClick={item.action}>
                        {item.icon}
                        <span className="text-xs font-medium text-center text-gray-700">{item.label}</span>
                      </Card>
                    ))}
                  </div>
                </>
              )}

              {messages.map(m => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'assistant' && (
                    <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold mr-2.5 mt-1 shrink-0">N</div>
                  )}
                  <div className={`px-4 py-3 rounded-2xl max-w-[80%] text-[14px] leading-relaxed ${m.role === 'user' ? 'bg-[#e8eef9] text-gray-800 rounded-br-[6px]' : 'bg-gray-50 border border-gray-100 text-gray-800 rounded-bl-[6px]'}`}>
                    {m.role === 'assistant' ? (
                      <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 prose-strong:text-gray-900 prose-pre:bg-gray-100 prose-pre:text-gray-800 prose-pre:border prose-pre:border-gray-200">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p>{m.content}</p>
                    )}
                  </div>
                  {m.role === 'user' && (
                    <Avatar className="h-7 w-7 ml-2.5 mt-1 shrink-0">
                      <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold mr-2.5 shrink-0">N</div>
                  <div className="px-4 py-3 rounded-2xl rounded-bl-[6px] bg-gray-50 border border-gray-100 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    <span className="text-sm text-gray-400">Thinking...</span>
                  </div>
                </div>
              )}

              {chatError && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">⚠️ {chatError}</div>
              )}
              <div ref={chatEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/95 to-transparent pt-8 pb-4 px-4 md:px-8 rounded-b-3xl">
            <div className="max-w-2xl mx-auto flex flex-col gap-2 relative">
              {messages.length === 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                  {SUGGESTION_CHIPS.map((chip, i) => (
                    <button key={i} onClick={() => sendMessage(chip)} disabled={isChatLoading}
                      className="shrink-0 text-[12px] text-gray-600 bg-white border border-gray-200 rounded-xl px-3 py-2 hover:bg-gray-50 hover:border-gray-300 transition-colors whitespace-nowrap">
                      {chip}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex items-center bg-white rounded-2xl border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.06)] pl-4 pr-2 py-2 focus-within:border-blue-300 focus-within:shadow-[0_2px_12px_rgba(59,130,246,0.1)] transition-all">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                  placeholder="Ask a question or make a request..."
                  disabled={isChatLoading}
                  className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-gray-400 py-1.5"
                />
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-medium text-gray-400 hidden sm:block">{selectedSources.length} source{selectedSources.length !== 1 ? 's' : ''}</span>
                  <Button onClick={() => sendMessage()} disabled={isChatLoading || !inputValue.trim()} size="icon"
                    className="h-9 w-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50">
                    {isChatLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 ml-0.5">
                        <path d="M5 12h14m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 text-center">Notebook AI can be inaccurate. Double check important information.</p>
            </div>
          </div>
        </section>

        {/* Right Sidebar */}
        {isRightOpen && (
          <aside className="hidden lg:flex w-[320px] shrink-0 flex-col rounded-3xl bg-white shadow-sm border border-gray-100 overflow-hidden">
            {/* Tab Header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-0 shrink-0">
              <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                {RIGHT_TABS.map(tab => (
                  <button key={tab.id} onClick={() => setRightTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${rightTab === tab.id ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                    {tab.icon}{tab.label}
                  </button>
                ))}
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-gray-400 ml-1" onClick={() => setIsRightOpen(false)}>
                <PanelRightClose className="h-3.5 w-3.5" />
              </Button>
            </div>

            <ScrollArea className="flex-1 mt-3">
              {/* === STUDIO TAB === */}
              {rightTab === 'studio' && (
                <div className="flex flex-col p-4 pb-8 gap-5">
                  {/* Audio Overview */}
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-800">Audio Overview</h3>
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full text-gray-400">
                        <Info className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <Card className="p-3.5 rounded-2xl border-gray-200 shadow-none flex flex-col gap-3 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                      <div className="flex items-start gap-3">
                        <div className="bg-white text-blue-500 p-2 rounded-xl shrink-0 shadow-sm">
                          <AudioLines className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-gray-900">Deep dive conversation</h4>
                          <p className="text-[11px] text-gray-500 mt-0.5">2 hosts (English only)</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" className="flex-1 rounded-full text-xs font-medium bg-white border-blue-200 h-8">Customize</Button>
                        <Button onClick={() => generateNote('audio_overview', 'Audio Overview')} disabled={isGeneratingNote}
                          className="flex-1 rounded-full text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white h-8 shadow-none">
                          {isGeneratingNote ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Generate"}
                        </Button>
                      </div>
                    </Card>
                  </div>

                  {/* Timeline Roadmap */}
                  <div className="flex flex-col gap-2.5">
                    <h3 className="text-sm font-semibold text-gray-800">Timeline Roadmap</h3>
                    <Card className="p-3.5 rounded-2xl border-gray-200 shadow-none flex flex-col gap-3 bg-gradient-to-br from-rose-50 to-orange-50 border-rose-100">
                      <div className="flex items-start gap-3">
                        <div className="bg-white text-rose-500 p-2 rounded-xl shrink-0 shadow-sm">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-gray-900">Visual Timeline</h4>
                          <p className="text-[11px] text-gray-500 mt-0.5">Chronological roadmap of key events</p>
                        </div>
                      </div>
                      <Button onClick={() => generateNote('timeline', 'Timeline Roadmap')} disabled={isGeneratingNote}
                        className="w-full rounded-full text-xs font-medium bg-rose-500 hover:bg-rose-600 text-white h-8 shadow-none">
                        {isGeneratingNote ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <MapPin className="w-3.5 h-3.5 mr-1.5" />}
                        Generate Timeline
                      </Button>
                    </Card>
                  </div>

                  {/* Notes Section */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-800">Notes</h3>
                      <div className="flex items-center gap-0.5 text-gray-400">
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full"><Search className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full"><MoreVertical className="h-3 w-3" /></Button>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full justify-center rounded-full text-sm font-medium border-gray-200 h-9"
                      onClick={() => generateNote('summary', 'New Note')} disabled={isGeneratingNote}>
                      {isGeneratingNote ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                      Add note
                    </Button>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { type: 'study_guide', label: 'Study guide', icon: <NotebookTabs className="h-3 w-3" /> },
                        { type: 'briefing_doc', label: 'Briefing doc', icon: <FileCheck className="h-3 w-3" /> },
                        { type: 'faq', label: 'FAQ', icon: <FileQuestion className="h-3 w-3" /> },
                        { type: 'timeline', label: 'Timeline', icon: <Clock className="h-3 w-3" /> },
                      ].map(item => (
                        <Badge key={item.type} variant="outline"
                          className="rounded-full px-2.5 py-1 text-xs font-normal border-gray-200 hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-colors"
                          onClick={() => !isGeneratingNote && generateNote(item.type, item.label)}>
                          {isGeneratingNote ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : React.cloneElement(item.icon, { className: "mr-1.5 h-3 w-3" } as any)}
                          {item.label}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex flex-col gap-2 mt-1">
                      {notes.length === 0 ? (
                        <p className="text-[11px] text-gray-400 text-center py-6">No notes yet. Use the buttons above to generate notes.</p>
                      ) : (
                        notes.map(note => (
                          <div key={note.id}
                            className="flex flex-col gap-1.5 p-3 cursor-pointer group rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                            onClick={() => setActiveNote(note)}>
                            <div className="flex items-center gap-2">
                              {note.isTimeline ? <MapPin className="h-4 w-4 text-rose-500 shrink-0" /> : <FileText className="h-4 w-4 text-yellow-500 shrink-0" />}
                              <p className="text-[13px] font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">{note.title}</p>
                              <ChevronRight className="h-3.5 w-3.5 text-gray-300 ml-auto shrink-0" />
                            </div>
                            <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed ml-6">{note.content}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* === SOURCES TAB === */}
              {rightTab === 'sources' && (
                <div className="flex flex-col p-4 pb-8 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-sm font-semibold text-gray-800">Related Resources</h3>
                    <p className="text-[11px] text-gray-500">AI-discovered sources: websites, courses, GitHub repos & more</p>
                  </div>

                  <Button onClick={discoverSources} disabled={isDiscoveringSources}
                    className="w-full rounded-2xl text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white h-10 shadow-none gap-2">
                    {isDiscoveringSources ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {isDiscoveringSources ? 'Discovering sources...' : 'Discover Related Sources'}
                  </Button>

                  {sourceTopic && (
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2">
                      <p className="text-[11px] text-indigo-700 font-medium">Topic: {sourceTopic}</p>
                    </div>
                  )}

                  {relatedSources.length === 0 && !isDiscoveringSources && (
                    <div className="flex flex-col items-center py-10 gap-3">
                      <Globe className="h-10 w-10 text-gray-200" />
                      <p className="text-[12px] text-gray-400 text-center leading-relaxed">Click the button above to discover<br />related learning resources</p>
                    </div>
                  )}

                  {relatedSources.length > 0 && (
                    <div className="flex flex-col gap-2.5">
                      {relatedSources.map((src, i) => (
                        <a key={i} href={src.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group">
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${getResourceBg(src.type)}`}>
                            {getResourceIcon(src.type)}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-[13px] font-medium text-gray-900 group-hover:text-indigo-700 truncate transition-colors">{src.title}</p>
                            <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed mt-0.5">{src.description}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Badge variant="outline" className="h-4 px-1.5 text-[9px] rounded-full border-gray-200 capitalize font-normal">{src.type}</Badge>
                            </div>
                          </div>
                          <ExternalLink className="h-3.5 w-3.5 text-gray-300 group-hover:text-indigo-400 mt-0.5 shrink-0 transition-colors" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* === CHARTS TAB === */}
              {rightTab === 'charts' && (
                <div className="flex flex-col p-4 pb-8 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-sm font-semibold text-gray-800">Data Visualization</h3>
                    <p className="text-[11px] text-gray-500">AI-generated charts from your source content</p>
                  </div>

                  <Button onClick={generateCharts} disabled={isGeneratingCharts}
                    className="w-full rounded-2xl text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white h-10 shadow-none gap-2">
                    {isGeneratingCharts ? <Loader2 className="w-4 h-4 animate-spin" /> : <BarChart2 className="w-4 h-4" />}
                    {isGeneratingCharts ? 'Generating charts...' : 'Generate Charts'}
                  </Button>

                  {chartData.length === 0 && !isGeneratingCharts && (
                    <div className="flex flex-col items-center py-10 gap-3">
                      <BarChart2 className="h-10 w-10 text-gray-200" />
                      <p className="text-[12px] text-gray-400 text-center leading-relaxed">Click the button above to visualize<br />your source content as charts</p>
                    </div>
                  )}

                  {chartData.map((chart, i) => (
                    <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                      <h4 className="text-[13px] font-semibold text-gray-900 mb-1">{chart.title}</h4>
                      <p className="text-[10px] text-gray-500 mb-4">{chart.description}</p>

                      {chart.type === 'bar' && (
                        <ResponsiveContainer width="100%" height={180}>
                          <BarChart data={chart.data} margin={{ top: 0, right: 0, left: -20, bottom: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} angle={-35} textAnchor="end" interval={0} />
                            <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} />
                            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e5e7eb' }} />
                            <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      )}

                      {chart.type === 'pie' && (
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie data={chart.data} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={9}>
                              {chart.data.map((_: any, idx: number) => (
                                <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                          </PieChart>
                        </ResponsiveContainer>
                      )}

                      {chart.type === 'radar' && (
                        <ResponsiveContainer width="100%" height={200}>
                          <RadarChart data={chart.data}>
                            <PolarGrid stroke="#e5e7eb" />
                            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#6b7280' }} />
                            <PolarRadiusAxis tick={{ fontSize: 9 }} />
                            <Radar name="Value" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.25} />
                            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
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
