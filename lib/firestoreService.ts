/**
 * firestoreService.ts
 *
 * Real-time Firebase Firestore persistence for Notebook-AI.
 *
 * Architecture:
 *   • subscribeToNotebook() opens a live onSnapshot listener.
 *     The callback is invoked immediately with current data, and again
 *     whenever ANY other tab/device writes to the same document.
 *   • All user-initiated writes use the granular update helpers.
 *   • First-visit: if the document doesn't exist, we create it with
 *     defaults and the snapshot fires automatically afterwards.
 *
 * Document path: notebooks/{notebookId}
 */

import {
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
  type Unsubscribe,
  type DocumentSnapshot,
} from "firebase/firestore"
import { db } from "./firebase"

// ─── Types ────────────────────────────────────────────────────────────────────

export type Source = {
  id: string
  name: string
  content: string
  selected: boolean
  type: "txt" | "pdf" | "other"
}

export type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
}

export type TimelineEvent = {
  date: string
  title: string
  description: string
  color?: string
}

export type Note = {
  id: string
  title: string
  content: string
  isTimeline?: boolean
  timelineData?: TimelineEvent[]
}

export type RelatedSource = {
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

export type ChartData = {
  type: string
  title: string
  description: string
  data: any[]
}

export type NotebookData = {
  sources: Source[]
  messages: ChatMessage[]
  notes: Note[]
  relatedSources: RelatedSource[]
  sourceTopic: string
  chartData: ChartData[]
  researchSummary: string
  audioLines: { speaker: string; text: string }[]
  isAudioReady: boolean
}

// ─── Internal helpers ──────────────────────────────────────────────────────────

const COLLECTION = "notebooks"

function notebookRef(notebookId: string) {
  return doc(db, COLLECTION, notebookId)
}

function snapToData(snap: DocumentSnapshot): NotebookData {
  const d = snap.data() as any
  return {
    sources: d.sources ?? [],
    messages: d.messages ?? [],
    notes: d.notes ?? [],
    relatedSources: d.relatedSources ?? [],
    sourceTopic: d.sourceTopic ?? "",
    chartData: d.chartData ?? [],
    researchSummary: d.researchSummary ?? "",
    audioLines: d.audioLines ?? [],
    isAudioReady: d.isAudioReady ?? false,
  }
}

// ─── Real-time subscription ────────────────────────────────────────────────────

/**
 * Subscribe to real-time updates for a notebook.
 *
 * @param notebookId  Unique ID stored in localStorage
 * @param onData      Called with fresh data every time Firestore changes
 * @param defaultData Written to Firestore if the document doesn't exist yet
 * @returns Unsubscribe function — call it on component unmount
 */
export function subscribeToNotebook(
  notebookId: string,
  onData: (data: NotebookData) => void,
  defaultData: NotebookData
): Unsubscribe {
  return onSnapshot(
    notebookRef(notebookId),
    (snap) => {
      if (!snap.exists()) {
        // First visit: create the document; the snapshot will fire again once written
        setDoc(notebookRef(notebookId), {
          ...defaultData,
          updatedAt: serverTimestamp(),
        }).catch(console.error)
        return
      }
      onData(snapToData(snap))
    },
    (error) => {
      console.error("[Firestore] onSnapshot error:", error)
    }
  )
}

// ─── Sanitization ─────────────────────────────────────────────────────────────

/**
 * Firestore does not allow 'undefined' values.
 * This helper recursively removes them or converts them to null.
 */
function sanitize(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(sanitize)
  }
  if (obj !== null && typeof obj === "object") {
    const fresh: any = {}
    Object.keys(obj).forEach((key) => {
      const value = obj[key]
      if (value !== undefined) {
        fresh[key] = sanitize(value)
      }
    })
    return fresh
  }
  return obj
}

// ─── Granular writes ───────────────────────────────────────────────────────────

export async function writeSources(
  notebookId: string,
  sources: Source[]
): Promise<void> {
  await updateDoc(notebookRef(notebookId), {
    sources: sanitize(sources),
    updatedAt: serverTimestamp(),
  })
}

export async function writeMessages(
  notebookId: string,
  messages: ChatMessage[]
): Promise<void> {
  await updateDoc(notebookRef(notebookId), {
    messages: sanitize(messages),
    updatedAt: serverTimestamp(),
  })
}

export async function writeNotes(
  notebookId: string,
  notes: Note[]
): Promise<void> {
  await updateDoc(notebookRef(notebookId), {
    notes: sanitize(notes),
    updatedAt: serverTimestamp(),
  })
}

export async function writeRelatedSources(
  notebookId: string,
  relatedSources: RelatedSource[],
  sourceTopic: string,
  researchSummary: string
): Promise<void> {
  await updateDoc(notebookRef(notebookId), {
    relatedSources: sanitize(relatedSources),
    sourceTopic: sourceTopic || "",
    researchSummary: researchSummary || "",
    updatedAt: serverTimestamp(),
  })
}

export async function writeChartData(
  notebookId: string,
  chartData: ChartData[]
): Promise<void> {
  await updateDoc(notebookRef(notebookId), {
    chartData: sanitize(chartData),
    updatedAt: serverTimestamp(),
  })
}

export async function writeAudio(
  notebookId: string,
  audioLines: { speaker: string; text: string }[],
  isAudioReady: boolean
): Promise<void> {
  await updateDoc(notebookRef(notebookId), {
    audioLines: sanitize(audioLines),
    isAudioReady,
    updatedAt: serverTimestamp(),
  })
}
