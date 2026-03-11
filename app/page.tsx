"use client"

import React, { useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { BookOpen } from "lucide-react"
import LandingPage from "@/components/landing-page"

export default function RootPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/notebook")
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#F2EFE9] text-[#1A261D] overflow-hidden">
        <div className="bg-noise"></div>
        
        {/* Premium Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-200/30 blur-[100px] rounded-full animate-pulse"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="relative mb-10 group">
            <div className="absolute -inset-4 bg-rose-500/10 rounded-full blur-xl group-hover:bg-rose-500/20 transition-all duration-1000 animate-pulse"></div>
            <div className="relative flex items-center justify-center w-20 h-20 bg-white border-2 border-[#1A261D] hard-shadow rounded-2xl animate-float">
              <BookOpen className="w-10 h-10 text-rose-600" />
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-black tracking-tighter uppercase mb-2">Notebook AI</h2>
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm font-serif italic text-gray-500">Entering your workspace...</p>
              
              {/* Sleek Loading Bar */}
              <div className="w-48 h-1 bg-[#1A261D]/5 rounded-full overflow-hidden border border-[#1A261D]/10">
                <div className="h-full bg-rose-600 w-1/3 rounded-full animate-[marquee_2s_infinite_linear]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <LandingPage />
}
