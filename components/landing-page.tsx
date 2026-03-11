import React from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  BookOpen, 
  Sparkles, 
  Brain, 
  AudioLines, 
  ArrowRight, 
  PlayCircle, 
  Star, 
  MapPin, 
  Infinity as InfinityIcon,
  Sun,
  Flower2,
  Sticker,
  Mail,
  Heart
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F2EFE9] text-[#1A261D] font-sans selection:bg-[#C9E265] selection:text-[#1A261D] overflow-x-hidden relative">
      <div className="bg-noise"></div>

      {/* Sticker Elements (Floating Background) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[15%] left-[5%] text-[#FF6B4A] animate-spin-slow opacity-80">
          <Sun size={80} fill="currentColor" />
        </div>
        <div className="absolute top-[60%] right-[5%] text-[#C9E265] animate-float opacity-80 rotate-12">
          <Flower2 size={120} fill="currentColor" />
        </div>
        <div className="absolute bottom-[20%] left-[15%] text-[#9D8BB5] animate-float-delayed opacity-60">
          <InfinityIcon size={100} />
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <div className="bg-[#F2EFE9]/90 backdrop-blur-md hard-shadow rounded-full px-2 py-2 flex items-center gap-2 max-w-2xl w-full justify-between transition-all">
          <Link href="/" className="flex items-center gap-3 bg-[#1A261D] text-[#F2EFE9] px-2 pr-4 py-1.5 rounded-full hover:bg-rose-600 transition-colors group">
            <div className="relative w-10 h-10 group-hover:rotate-12 transition-transform">
              <Image 
                src="https://i.postimg.cc/TwNwrGCT/n-removebg-preview.png" 
                alt="Logo" 
                fill 
                className="object-contain"
              />
            </div>
            <span className="font-bold tracking-tight text-sm">Notebook AI</span>
          </Link>
          
          <div className="hidden md:flex gap-1 items-center">
            <a href="#features" className="px-4 py-2 rounded-full text-sm font-medium hover:bg-[#C9E265] hover:text-[#1A261D] transition-colors">Features</a>
            <a href="#about" className="px-4 py-2 rounded-full text-sm font-medium hover:bg-[#9D8BB5] hover:text-[#1A261D] transition-colors">About</a>
          </div>

          <Link href="/register" className="bg-[#C9E265] hover:bg-[#b5d145] text-[#1A261D] px-5 py-2.5 rounded-full text-sm font-bold border-2 border-[#1A261D] shadow-[2px_2px_0px_0px_#1A261D] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center gap-2">
            Get Started <ArrowRight size={18} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden">
        {/* Large Decorative Text Behind */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-0 opacity-5 select-none pointer-events-none">
          <span className="text-[20vw] leading-none font-bold text-[#3D6B4F]">AI</span>
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto px-6 flex flex-col items-center">
          {/* Badge */}
          <div className="animate-float mb-8">
            <div className="bg-[#1A261D] text-[#F2EFE9] pl-6 pr-2 py-1.5 rounded-full border-2 border-[#1A261D] shadow-[4px_4px_0px_0px_#C9E265] font-bold text-sm tracking-wide uppercase transform -rotate-2 inline-flex items-center gap-4">
              Now with Gemini 1.5 Pro
              <span className="bg-[#FF6B4A] text-[#1A261D] px-3 py-1 rounded-full text-xs font-black">LATEST UPDATE</span>
            </div>
          </div>
          
          {/* Main Title */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-[#1A261D] leading-[0.9] mb-4 relative group cursor-default">
            NOTEBOOK AI
            <br />
            <span className="font-serif italic text-[#3D6B4F] relative inline-block">
              Organize Thoughts
              <Sparkles size={60} className="absolute -top-6 -right-12 text-[#FF6B4A] -z-10 rotate-12 animate-bounce" />
            </span>
          </h1>

          {/* Theme */}
          <div className="mt-8 mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C9E265] to-transparent h-[1px] top-1/2 -z-10 opacity-50"></div>
            <div className="bg-[#F2EFE9] px-6 inline-block relative">
              <p className="text-xl md:text-3xl font-medium tracking-tight">
                <span className="text-[#1A261D]/60 italic font-serif mr-2">mission:</span>
                The Art of <span className="bg-[#9D8BB5] text-[#F2EFE9] px-2 italic font-serif transform -skew-x-12 inline-block mx-1 border-2 border-[#1A261D] rounded-sm">Intelligent Learning</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center relative">
            <Link href="/register" className="bg-[#1A261D] text-[#F2EFE9] px-10 py-5 rounded-full text-xl font-bold hard-shadow hard-shadow-hover transition-all flex items-center gap-3 group">
              Start Your Notebook
              <Star size={24} className="text-[#C9E265] group-hover:rotate-180 transition-transform duration-500" fill="currentColor" />
            </Link>
            <Link href="/login" className="bg-white text-[#1A261D] px-10 py-5 rounded-full text-xl font-bold hard-shadow hard-shadow-hover transition-all flex items-center gap-3">
              <PlayCircle size={24} />
              Login Back
            </Link>
          </div>
        </div>

        {/* Floating Cards Decoration */}
        <div className="absolute bottom-20 left-10 md:left-20 animate-float hidden lg:block">
          <div className="bg-white p-2 pb-6 rounded-lg hard-shadow-sm rotate-[-6deg] w-48">
            <div className="bg-[#3D6B4F] h-40 rounded mb-2 flex items-center justify-center overflow-hidden relative">
              <img src="https://i.postimg.cc/vHxH9rWC/bg-login.jpg" className="w-full h-full object-cover grayscale mix-blend-luminosity hover:mix-blend-normal transition-all duration-500" alt="App Preview" />
            </div>
            <div className="font-serif italic text-center text-sm font-bold">Smart Interface</div>
          </div>
        </div>
        <div className="absolute top-40 right-10 md:right-20 animate-float-delayed hidden lg:block">
          <div className="bg-white p-2 pb-6 rounded-lg hard-shadow-sm rotate-[12deg] w-40 z-20">
            <div className="bg-[#FF6B4A] h-28 rounded mb-2 flex items-center justify-center">
              <AudioLines size={40} className="text-[#F2EFE9]" />
            </div>
             <div className="font-serif italic text-center text-sm font-bold">Audio Overviews</div>
          </div>
        </div>
      </header>

      <div className="relative py-12 bg-[#3D6B4F] -rotate-1 scale-105 border-y-4 border-[#1A261D] z-20 overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="flex animate-marquee whitespace-nowrap items-center">
          <span className="text-4xl md:text-5xl font-black text-[#F2EFE9] px-8 uppercase flex items-center gap-6">
            Intelligent Summaries <Sparkles className="text-[#C9E265]" fill="currentColor" /> 
            Source Analysis <Brain className="text-[#FF6B4A]" fill="currentColor" />
            Audio Conversations <AudioLines className="text-[#9D8BB5]" />
            <div className="relative w-12 h-12">
              <Image src="https://i.postimg.cc/TwNwrGCT/n-removebg-preview.png" alt="N" fill className="object-contain" />
            </div>
            Notebook AI
          </span>
          <span className="text-4xl md:text-5xl font-black text-[#F2EFE9] px-8 uppercase flex items-center gap-6">
            Intelligent Summaries <Sparkles className="text-[#C9E265]" fill="currentColor" /> 
            Source Analysis <Brain className="text-[#FF6B4A]" fill="currentColor" />
            Audio Conversations <AudioLines className="text-[#9D8BB5]" />
            <div className="relative w-12 h-12">
              <Image src="https://i.postimg.cc/TwNwrGCT/n-removebg-preview.png" alt="N" fill className="object-contain" />
            </div>
            Notebook AI
          </span>
        </div>
      </div>

      {/* Content Section */}
      <section id="features" className="py-24 px-6 md:px-12 relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10 order-2 lg:order-1">
            <div className="inline-block bg-[#C9E265] text-[#1A261D] font-bold px-3 py-1 rounded border-2 border-[#1A261D] mb-6 shadow-[2px_2px_0px_0px_#1A261D]">
              NEXT GEN AI
            </div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-[#1A261D] mb-8 leading-[0.9]">
              Turn your sources into <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B4A] to-rose-600 italic font-serif">Knowledge.</span>
            </h2>
            <div className="space-y-6 text-xl text-[#1A261D]/80 font-medium">
              <p>
                <span className="font-bold text-[#1A261D]">Notebook AI</span> uses Gemini 1.5 Pro to ground its intelligence in your own documents. Upload PDFs, texts, or markdown files and start a conversation.
              </p>
              <p>
                It doesn't just search; it understands. Get summaries, timelines, and even deep-dive audio discussions based purely on your input.
              </p>
            </div>
            
            <div className="mt-10 flex flex-wrap gap-4">
              <div className="bg-[#F2EFE9] border-2 border-[#1A261D] px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                <div className="w-3 h-3 bg-[#3D6B4F] rounded-full"></div> Summarization
              </div>
              <div className="bg-[#F2EFE9] border-2 border-[#1A261D] px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                <div className="w-3 h-3 bg-rose-600 rounded-full"></div> Citations
              </div>
              <div className="bg-[#F2EFE9] border-2 border-[#1A261D] px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                <div className="w-3 h-3 bg-[#9D8BB5] rounded-full"></div> Analysis
              </div>
            </div>
          </div>

          <div className="relative h-[500px] w-full order-1 lg:order-2 flex items-center justify-center">
            {/* Abstract Graphic */}
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="w-64 h-80 bg-[#1A261D] rounded-t-full rounded-b-full absolute left-10 top-0 mix-blend-multiply opacity-90 animate-float z-10 border-4 border-[#F2EFE9]"></div>
              <div className="w-64 h-80 bg-rose-600 rounded-t-full rounded-b-full absolute right-10 bottom-0 mix-blend-multiply opacity-90 animate-float-delayed z-10 border-4 border-[#F2EFE9]"></div>
              
              <div className="z-20 text-center bg-[#F2EFE9]/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-[#1A261D] shadow-xl rotate-3 max-w-[200px]">
                <Brain className="text-[#3D6B4F] w-12 h-12 mb-2 mx-auto" />
                <p className="font-serif italic font-bold text-xl">Privacy First Research</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ticker Tape */}
      <section className="py-24 bg-[#F2EFE9] relative overflow-hidden text-[#1A261D] border-t-4 border-[#1A261D]">
        <div className="max-w-5xl mx-auto text-center relative z-10 px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#1A261D] bg-[#F2EFE9] text-[#1A261D] text-sm font-bold mb-8 shadow-[4px_4px_0px_0px_#1A261D]">
            <MapPin size={16} className="text-[#FF6B4A]" />
            EVERYWHERE
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-8">
            Your Digital <br /><span className="text-stroke italic font-serif text-[#C9E265]">Zen Garden</span>
          </h2>
          <p className="text-xl md:text-2xl text-[#1A261D]/70 mb-12 font-medium max-w-3xl mx-auto">
            Available on all devices. Synchronized via the cloud. Your research, your notes, your brain—amplified.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            <div className="bg-white text-[#1A261D] px-6 py-4 rounded-xl font-bold border-2 border-[#1A261D] shadow-[4px_4px_0px_0px_#1A261D] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#1A261D] transition-all flex items-center gap-3">
              <Sun className="text-rose-600 w-5 h-5" />
              Lightweight
            </div>
            <div className="bg-white text-[#1A261D] px-6 py-4 rounded-xl font-bold border-2 border-[#1A261D] shadow-[4px_4px_0px_0px_#1A261D] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#1A261D] transition-all flex items-center gap-3">
              <BookOpen className="text-[#3D6B4F] w-5 h-5" />
              Markdown Ready
            </div>
            <div className="bg-white text-[#1A261D] px-6 py-4 rounded-xl font-bold border-2 border-[#1A261D] shadow-[4px_4px_0px_0px_#1A261D] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#1A261D] transition-all flex items-center gap-3">
              <Sparkles className="text-[#9D8BB5] w-5 h-5" />
              AI Powered
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-32 px-6 relative overflow-hidden bg-[#3D6B4F] border-t-4 border-[#1A261D]">
        <div className="absolute top-10 left-10 text-[#C9E265] opacity-20 animate-spin-slow">
          <InfinityIcon size={100} />
        </div>
        <div className="absolute bottom-10 right-10 text-[#FF6B4A] opacity-20 animate-float">
          <Star size={120} />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 rounded-3xl border-4 border-[#1A261D] p-8 md:p-16 bg-[#F2EFE9] hard-shadow shadow-[12px_12px_0px_0px_#1A261D]">
          <div className="mb-6 flex justify-center">
            <div className="relative w-20 h-20 bg-[#C9E265] rounded-full border-2 border-[#1A261D] flex items-center justify-center animate-float">
              <Image 
                src="https://i.postimg.cc/TwNwrGCT/n-removebg-preview.png" 
                alt="Logo" 
                fill 
                className="object-contain p-4"
              />
            </div>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-[#1A261D] mb-6">
            Write the <br />
            <span className="text-rose-600 font-serif italic">Future.</span>
          </h2>
          <p className="text-xl text-[#1A261D]/70 mb-10 font-medium">
            Join thousands of students and researchers using Notebook AI to supercharge their learning.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-[#1A261D] text-[#F2EFE9] px-10 py-5 rounded-full text-xl font-bold hard-shadow hard-shadow-hover transition-all flex items-center justify-center gap-3">
              Create Free Account
            </Link>
          </div>
          <p className="text-sm font-bold text-[#1A261D]/40 mt-6 uppercase tracking-wider">No credit card required. Pure intelligence.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A261D] text-[#F2EFE9] pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-3xl font-black tracking-tighter text-[#F2EFE9] flex items-center gap-3 mb-6 group w-fit">
              <div className="relative w-12 h-12 bg-[#C9E265] rounded-xl border-2 border-[#F2EFE9] group-hover:rotate-12 transition-transform overflow-hidden">
                <Image 
                  src="https://i.postimg.cc/TwNwrGCT/n-removebg-preview.png" 
                  alt="Logo" 
                  fill 
                  className="object-contain p-1.5"
                />
              </div>
              Notebook AI
            </Link>
            <p className="text-[#9D8BB5] max-w-sm text-lg font-medium leading-relaxed">
              Amplifying human intelligence with grounded AI. <br />
              Research, understand, and create like never before.
            </p>
          </div>
          
          <div>
            <h4 className="text-[#FF6B4A] font-bold mb-6 uppercase tracking-wider text-sm border-b-2 border-[#FF6B4A]/30 pb-2 w-fit">Quick Links</h4>
            <ul className="space-y-4 text-[#F2EFE9]/70 font-medium">
              <li><Link href="/login" className="hover:text-[#C9E265] transition-colors flex items-center gap-2">Login</Link></li>
              <li><Link href="/register" className="hover:text-[#C9E265] transition-colors flex items-center gap-2">Register</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#FF6B4A] font-bold mb-6 uppercase tracking-wider text-sm border-b-2 border-[#FF6B4A]/30 pb-2 w-fit">Connect</h4>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#F2EFE9]/10 border-2 border-[#F2EFE9]/20 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all cursor-pointer">
                <Heart size={20} />
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#F2EFE9]/10 border-2 border-[#F2EFE9]/20 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all cursor-pointer">
                <Mail size={20} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 border-t border-[#F2EFE9]/10 text-center md:text-left flex flex-col md:flex-row justify-between text-[#9D8BB5] text-sm font-medium">
          <p>© 2024 Notebook AI. All rights reserved.</p>
          <p className="flex items-center gap-2 justify-center md:justify-end">
            Made with <Heart size={16} className="text-rose-600" fill="currentColor" /> for researchers.
          </p>
        </div>
      </footer>
    </div>
  )
}
