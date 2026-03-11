<html lang="en" class="scroll-smooth"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>YJA 2026 | New Jersey</title>
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800&amp;family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,600&amp;family=Space+Grotesk:wght@400;500;700&amp;display=swap" rel="stylesheet">
<style>
/* Custom Font Settings */
:root {
--bg-cream: #F2EFE9;
--text-dark: #1A261D;
--accent-green: #3D6B4F;
--accent-lime: #C9E265;
--accent-orange: #FF6B4A;
--accent-purple: #9D8BB5;
}
body {
font-family: 'Space Grotesk', sans-serif;
background-color: var(--bg-cream);
color: var(--text-dark);
overflow-x: hidden;
}
.font-serif { font-family: 'Playfair Display', serif; }
.font-sans { font-family: 'Inter', sans-serif; }
/* Noise Texture */
.bg-noise {
position: fixed;
top: 0; left: 0; width: 100%; height: 100%;
pointer-events: none; z-index: 50; opacity: 0.06;
background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}
/* Animations */
@keyframes float {
0%, 100% { transform: translateY(0) rotate(0deg); }
50% { transform: translateY(-20px) rotate(2deg); }
}
@keyframes float-reverse {
0%, 100% { transform: translateY(0) rotate(0deg); }
50% { transform: translateY(15px) rotate(-2deg); }
}
@keyframes spin-slow {
from { transform: rotate(0deg); }
to { transform: rotate(360deg); }
}
@keyframes marquee {
0% { transform: translateX(0); }
100% { transform: translateX(-50%); }
}
@keyframes jelly {
0% { transform: scale(1, 1); }
30% { transform: scale(1.25, 0.75); }
40% { transform: scale(0.75, 1.25); }
50% { transform: scale(1.15, 0.85); }
65% { transform: scale(0.95, 1.05); }
75% { transform: scale(1.05, 0.95); }
100% { transform: scale(1, 1); }
}
.animate-float { animation: float 6s ease-in-out infinite; }
.animate-float-delayed { animation: float-reverse 7s ease-in-out infinite; animation-delay: 1s; }
.animate-spin-slow { animation: spin-slow 12s linear infinite; }
.animate-marquee { animation: marquee 30s linear infinite; }
.hover-jelly:hover { animation: jelly 0.5s both; }
/* Utilities */
.text-stroke {
-webkit-text-stroke: 1px #1A261D;
color: transparent;
}
.text-stroke-white {
-webkit-text-stroke: 1px #F2EFE9;
color: transparent;
}
.hard-shadow {
box-shadow: 6px 6px 0px 0px #1A261D;
border: 2px solid #1A261D;
}
.hard-shadow-hover:hover {
box-shadow: 2px 2px 0px 0px #1A261D;
transform: translate(4px, 4px);
}
.hard-shadow-sm {
box-shadow: 4px 4px 0px 0px #1A261D;
border: 2px solid #1A261D;
}
/* Hide Scrollbar but allow scrolling */
.no-scrollbar::-webkit-scrollbar {
display: none;
}
.no-scrollbar {
-ms-overflow-style: none;
scrollbar-width: none;
}
/* Custom Scrollbar for body */
::-webkit-scrollbar { width: 10px; }
::-webkit-scrollbar-track { background: #F2EFE9; border-left: 2px solid #1A261D; }
::-webkit-scrollbar-thumb { background: #FF6B4A; border: 2px solid #1A261D; border-radius: 99px; }
::-webkit-scrollbar-thumb:hover { background: #3D6B4F; }
</style></head>
<body class="antialiased selection:bg-[#C9E265] selection:text-[#1A261D]">

    <div class="bg-noise"></div>

    <!-- Sticker Elements (Floating Background) -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <!-- Sun -->
        <div class="absolute top-[15%] left-[5%] text-[#FF6B4A] animate-spin-slow opacity-80">
            <iconify-icon icon="solar:sun-2-bold" width="80"></iconify-icon>
        </div>
        <!-- Flower -->
        <div class="absolute top-[60%] right-[5%] text-[#C9E265] animate-float opacity-80 rotate-12">
            <iconify-icon icon="solar:flower-bold" width="120"></iconify-icon>
        </div>
        <!-- Abstract Shape -->
        <div class="absolute bottom-[20%] left-[15%] text-[#9D8BB5] animate-float-delayed opacity-60">
            <iconify-icon icon="solar:infinity-bold" width="100"></iconify-icon>
        </div>
    </div>

    <!-- Navigation -->
    <nav class="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <div class="bg-[#F2EFE9]/90 backdrop-blur-md hard-shadow rounded-full px-2 py-2 flex items-center gap-2 max-w-2xl w-full justify-between transition-all">
            <a href="#" class="flex items-center gap-3 bg-[#1A261D] text-[#F2EFE9] px-4 py-2 rounded-full hover:bg-[#FF6B4A] transition-colors group">
                <span class="font-serif italic font-bold text-xl group-hover:rotate-12 transition-transform block">Y</span>
                <span class="font-bold tracking-tight text-sm">2026</span>
            </a>

            <div class="hidden md:flex gap-1 items-center">
                <a href="#about" class="px-4 py-2 rounded-full text-sm font-medium hover:bg-[#C9E265] hover:text-[#1A261D] transition-colors">Theme</a>
                <a href="#memories" class="px-4 py-2 rounded-full text-sm font-medium hover:bg-[#9D8BB5] hover:text-[#1A261D] transition-colors">Memories</a>
                <a href="#schedule" class="px-4 py-2 rounded-full text-sm font-medium hover:bg-[#FF6B4A] hover:text-[#1A261D] transition-colors">Schedule</a>
            </div>

            <button class="bg-[#C9E265] hover:bg-[#b5d145] text-[#1A261D] px-5 py-2.5 rounded-full text-sm font-bold border-2 border-[#1A261D] shadow-[2px_2px_0px_0px_#1A261D] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center gap-2">
                Join List <iconify-icon icon="solar:arrow-right-linear" width="18"></iconify-icon>
            </button>
        </div>
    </nav>

    <!-- Hero Section -->
    <header class="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden">

        <!-- Large Decorative Text Behind -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-0 opacity-5 select-none pointer-events-none">
            <span class="text-[20vw] leading-none font-bold text-[#3D6B4F]">2026</span>
        </div>

        <div class="relative z-10 text-center max-w-6xl mx-auto px-6 flex flex-col items-center">

            <!-- Date Badge -->
            <div class="animate-float mb-8">
                <div class="bg-[#1A261D] text-[#F2EFE9] pl-6 pr-2 py-1.5 rounded-full border-2 border-[#1A261D] shadow-[4px_4px_0px_0px_#C9E265] font-bold text-sm tracking-wide uppercase transform -rotate-2 inline-flex items-center gap-4">
                    July 2nd - 5th, 2026
                    <span class="bg-[#FF6B4A] text-[#1A261D] px-3 py-1 rounded-full text-xs font-black">SAVE THE DATE</span>
                </div>
            </div>

            <!-- Main Title -->
            <h1 class="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-[#1A261D] leading-[0.9] mb-4 relative group cursor-default">
                YJA CONVENTION
                <br>
                <span class="font-serif italic text-[#3D6B4F] relative inline-block">
                    New Jersey
                    <iconify-icon icon="solar:map-point-wave-bold" class="absolute -top-6 -right-12 text-[#FF6B4A] text-6xl md:text-7xl -z-10 rotate-12 animate-bounce" width="1em"></iconify-icon>
                </span>
            </h1>

            <!-- Theme: The Art of the In-Between -->
            <div class="mt-8 mb-12 relative">
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-[#C9E265] to-transparent h-[1px] top-1/2 -z-10 opacity-50"></div>
                <div class="bg-[#F2EFE9] px-6 inline-block relative">
                    <p class="text-xl md:text-3xl font-medium tracking-tight">
                        <span class="text-[#1A261D]/60 italic font-serif mr-2">theme:</span>
                        The Art of the <span class="bg-[#9D8BB5] text-[#F2EFE9] px-2 italic font-serif transform -skew-x-12 inline-block mx-1 border-2 border-[#1A261D] rounded-sm">In-Between</span>
                    </p>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-6 justify-center items-center relative">
                <button class="bg-[#1A261D] text-[#F2EFE9] px-10 py-5 rounded-full text-xl font-bold hard-shadow hard-shadow-hover transition-all flex items-center gap-3 group">
                    Register Interest
                    <iconify-icon icon="solar:stars-bold" class="text-[#C9E265] group-hover:rotate-180 transition-transform duration-500" width="24"></iconify-icon>
                </button>
                <button class="bg-[#F2EFE9] text-[#1A261D] px-10 py-5 rounded-full text-xl font-bold hard-shadow hard-shadow-hover transition-all flex items-center gap-3">
                    <iconify-icon icon="solar:play-circle-bold" width="24"></iconify-icon>
                    2024 Recap
                </button>
            </div>
        </div>

        <!-- Floating Cards Decoration -->
        <div class="absolute bottom-20 left-10 md:left-20 animate-float hidden lg:block">
            <div class="bg-white p-2 pb-6 rounded-lg hard-shadow-sm rotate-[-6deg] w-48">
                <div class="bg-[#3D6B4F] h-40 rounded mb-2 flex items-center justify-center overflow-hidden relative">
                    <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg" class="w-full h-full object-cover grayscale mix-blend-luminosity hover:mix-blend-normal transition-all duration-500" alt="Convention crowd">
                </div>
                <div class="font-serif italic text-center text-sm font-bold">2024 Memories</div>
            </div>
        </div>
        <div class="absolute top-40 right-10 md:right-20 animate-float-delayed hidden lg:block">
            <div class="bg-white p-2 pb-6 rounded-lg hard-shadow-sm rotate-[12deg] w-40 z-20">
                <div class="bg-[#FF6B4A] h-28 rounded mb-2 flex items-center justify-center">
                    <iconify-icon icon="solar:music-note-bold" class="text-[#F2EFE9] text-5xl"></iconify-icon>
                </div>
                 <div class="font-serif italic text-center text-sm font-bold">Socials</div>
            </div>
        </div>
    </header>

    <!-- Marquee Banner -->
    <div class="relative py-12 bg-[#3D6B4F] -rotate-1 scale-105 border-y-4 border-[#1A261D] z-20 overflow-hidden shadow-lg">
        <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div class="flex animate-marquee whitespace-nowrap">
            <span class="text-4xl md:text-5xl font-black text-[#F2EFE9] px-8 uppercase flex items-center gap-6">
                Art of the In-Between <iconify-icon icon="solar:star-bold" class="text-[#C9E265]"></iconify-icon>
                July 2-5 2026 <iconify-icon icon="solar:star-bold" class="text-[#FF6B4A]"></iconify-icon>
                New Jersey <iconify-icon icon="solar:star-bold" class="text-[#9D8BB5]"></iconify-icon>
                YJA Convention <iconify-icon icon="solar:star-bold" class="text-[#C9E265]"></iconify-icon>
            </span>
            <span class="text-4xl md:text-5xl font-black text-[#F2EFE9] px-8 uppercase flex items-center gap-6">
                Art of the In-Between <iconify-icon icon="solar:star-bold" class="text-[#C9E265]"></iconify-icon>
                July 2-5 2026 <iconify-icon icon="solar:star-bold" class="text-[#FF6B4A]"></iconify-icon>
                New Jersey <iconify-icon icon="solar:star-bold" class="text-[#9D8BB5]"></iconify-icon>
                YJA Convention <iconify-icon icon="solar:star-bold" class="text-[#C9E265]"></iconify-icon>
            </span>
        </div>
    </div>

    <!-- Theme Section -->
    <section id="about" class="py-24 px-6 md:px-12 relative max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div class="relative z-10 order-2 lg:order-1">
                <div class="inline-block bg-[#C9E265] text-[#1A261D] font-bold px-3 py-1 rounded border-2 border-[#1A261D] mb-6 shadow-[2px_2px_0px_0px_#1A261D]">
                    THEME REVEAL
                </div>
                <h2 class="text-5xl md:text-7xl font-bold tracking-tighter text-[#1A261D] mb-8 leading-[0.9]">
                    Finding beauty in the <br>
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B4A] to-[#9D8BB5] italic font-serif">Transition.</span>
                </h2>
                <div class="space-y-6 text-xl text-[#1A261D]/80 font-medium">
                    <p>
                        <span class="font-bold text-[#1A261D]">The Art of the In-Between</span> explores the spaces where we grow. Between tradition and modernity. Between youth and adulthood. Between who we were and who we are becoming.
                    </p>
                    <p>
                        New Jersey, the Garden State, sits between major cities and quiet nature—the perfect backdrop to explore our duality.
                    </p>
                </div>

                <div class="mt-10 flex gap-4">
                    <div class="bg-[#F2EFE9] border-2 border-[#1A261D] px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                        <div class="w-3 h-3 bg-[#3D6B4F] rounded-full"></div> Growth
                    </div>
                    <div class="bg-[#F2EFE9] border-2 border-[#1A261D] px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                        <div class="w-3 h-3 bg-[#FF6B4A] rounded-full"></div> Connection
                    </div>
                    <div class="bg-[#F2EFE9] border-2 border-[#1A261D] px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                        <div class="w-3 h-3 bg-[#9D8BB5] rounded-full"></div> Balance
                    </div>
                </div>
            </div>

            <div class="relative h-[500px] w-full order-1 lg:order-2">
                <!-- Abstract "In-Between" Graphic -->
                <div class="absolute inset-0 flex items-center justify-center">
                    <!-- Left Shape -->
                    <div class="w-64 h-80 bg-[#1A261D] rounded-t-full rounded-b-full absolute left-10 top-0 mix-blend-multiply opacity-90 animate-float z-10 border-4 border-[#F2EFE9]"></div>
                    <!-- Right Shape -->
                    <div class="w-64 h-80 bg-[#FF6B4A] rounded-t-full rounded-b-full absolute right-10 bottom-0 mix-blend-multiply opacity-90 animate-float-delayed z-10 border-4 border-[#F2EFE9]"></div>

                    <!-- Text in the middle/overlap -->
                    <div class="z-20 text-center bg-[#F2EFE9]/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-[#1A261D] shadow-xl rotate-3">
                        <iconify-icon icon="solar:infinity-bold" class="text-[#3D6B4F] text-5xl mb-2"></iconify-icon>
                        <p class="font-serif italic font-bold text-xl">Where paths meet</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Previous Years Gallery (Scrapbook Style) -->
    <section id="memories" class="py-20 bg-[#1A261D] overflow-hidden relative border-t-4 border-[#F2EFE9]">

        <div class="flex justify-between items-end px-6 md:px-12 max-w-7xl mx-auto mb-12">
            <div>
                <h2 class="text-4xl md:text-5xl font-black text-[#F2EFE9]">The Archive</h2>
                <p class="text-[#C9E265] mt-2 font-serif italic text-xl">Moments from past conventions</p>
            </div>
            <div class="hidden md:flex gap-2">
                <button class="w-12 h-12 rounded-full border-2 border-[#F2EFE9] text-[#F2EFE9] flex items-center justify-center hover:bg-[#C9E265] hover:text-[#1A261D] hover:border-[#C9E265] transition-colors">
                    <iconify-icon icon="solar:arrow-left-linear" width="24"></iconify-icon>
                </button>
                <button class="w-12 h-12 rounded-full border-2 border-[#F2EFE9] text-[#F2EFE9] flex items-center justify-center hover:bg-[#C9E265] hover:text-[#1A261D] hover:border-[#C9E265] transition-colors">
                    <iconify-icon icon="solar:arrow-right-linear" width="24"></iconify-icon>
                </button>
            </div>
        </div>

        <!-- Scroll Container -->
        <div class="flex overflow-x-auto gap-8 px-6 md:px-12 pb-12 snap-x no-scrollbar">

            <!-- Video Card 1 -->
            <div class="flex-shrink-0 snap-center relative group">
                <div class="w-[300px] md:w-[400px] h-[300px] bg-[#F2EFE9] p-3 pb-12 rounded-lg rotate-2 hard-shadow group-hover:rotate-0 transition-transform duration-300">
                    <div class="bg-black w-full h-full rounded border border-[#1A261D] flex items-center justify-center relative overflow-hidden">
                        <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4734259a-bad7-422f-981e-ce01e79184f2_1600w.jpg" class="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700">
                        <div class="absolute inset-0 flex items-center justify-center">
                            <div class="w-16 h-16 rounded-full bg-[#F2EFE9]/20 backdrop-blur-md flex items-center justify-center border-2 border-[#F2EFE9] group-hover:scale-110 transition-transform">
                                <iconify-icon icon="solar:play-bold" class="text-[#F2EFE9] text-3xl ml-1"></iconify-icon>
                            </div>
                        </div>
                    </div>
                    <div class="absolute bottom-3 left-4 font-serif italic font-bold text-[#1A261D]">2024 Highlight Reel</div>
                </div>
            </div>

            <!-- Photo Card 1 -->
            <div class="flex-shrink-0 snap-center relative group mt-8">
                <div class="w-[280px] h-[340px] bg-[#F2EFE9] p-3 pb-12 rounded-lg -rotate-3 hard-shadow group-hover:rotate-0 transition-transform duration-300">
                    <div class="bg-gray-200 w-full h-full rounded border border-[#1A261D] overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&amp;w=800&amp;auto=format&amp;fit=crop" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500">
                    </div>
                    <div class="absolute bottom-4 right-4 text-[#FF6B4A]">
                        <iconify-icon icon="solar:sticker-circle-bold" width="32"></iconify-icon>
                    </div>
                </div>
            </div>

            <!-- Photo Card 2 -->
            <div class="flex-shrink-0 snap-center relative group">
                <div class="w-[320px] h-[300px] bg-[#F2EFE9] p-3 pb-12 rounded-lg rotate-1 hard-shadow group-hover:rotate-0 transition-transform duration-300">
                    <div class="bg-gray-200 w-full h-full rounded border border-[#1A261D] overflow-hidden">
                         <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&amp;w=800&amp;auto=format&amp;fit=crop" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500">
                    </div>
                    <div class="absolute bottom-3 left-4 font-serif italic font-bold text-[#1A261D]">Garba Night '22</div>
                </div>
            </div>

            <!-- Video Card 2 -->
            <div class="flex-shrink-0 snap-center relative group mt-6">
                <div class="w-[300px] md:w-[400px] h-[300px] bg-[#F2EFE9] p-3 pb-12 rounded-lg -rotate-2 hard-shadow group-hover:rotate-0 transition-transform duration-300">
                    <div class="bg-black w-full h-full rounded border border-[#1A261D] flex items-center justify-center relative overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&amp;w=800&amp;auto=format&amp;fit=crop" class="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700">
                        <div class="absolute inset-0 flex items-center justify-center">
                            <div class="w-16 h-16 rounded-full bg-[#F2EFE9]/20 backdrop-blur-md flex items-center justify-center border-2 border-[#F2EFE9] group-hover:scale-110 transition-transform">
                                <iconify-icon icon="solar:play-bold" class="text-[#F2EFE9] text-3xl ml-1"></iconify-icon>
                            </div>
                        </div>
                    </div>
                    <div class="absolute bottom-3 left-4 font-serif italic font-bold text-[#1A261D]">Keynote Speech</div>
                </div>
            </div>

             <!-- Photo Card 3 -->
             <div class="flex-shrink-0 snap-center relative group">
                <div class="w-[280px] h-[340px] bg-[#F2EFE9] p-3 pb-12 rounded-lg rotate-3 hard-shadow group-hover:rotate-0 transition-transform duration-300">
                    <div class="bg-gray-200 w-full h-full rounded border border-[#1A261D] overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1526045612212-70caf35c14df?q=80&amp;w=800&amp;auto=format&amp;fit=crop" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500">
                    </div>
                    <div class="absolute top-[-10px] left-[40%] w-8 h-12 bg-[#C9E265]/80 backdrop-blur rotate-3 z-10 shadow-sm"></div>
                </div>
            </div>
        </div>
    </section>

    <!-- Why NJ (Ticker Tape Style) -->
    <section class="py-24 bg-[#F2EFE9] relative overflow-hidden text-[#1A261D] border-t-4 border-[#1A261D]">

        <div class="max-w-5xl mx-auto text-center relative z-10 px-6">
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#1A261D] bg-[#F2EFE9] text-[#1A261D] text-sm font-bold mb-8 shadow-[4px_4px_0px_0px_#1A261D]">
                <iconify-icon icon="solar:bolt-bold" width="16" class="text-[#FF6B4A]"></iconify-icon>
                LOCATION
            </div>

            <h2 class="text-5xl md:text-7xl font-black tracking-tight mb-8">
                The Garden <br><span class="text-stroke italic font-serif text-[#C9E265]">State of Mind</span>
            </h2>
            <p class="text-xl md:text-2xl text-[#1A261D]/70 mb-12 font-medium max-w-3xl mx-auto">
                Home to one of the largest Jain populations outside India. A perfect ecosystem for growth, spirituality, and community.
            </p>

            <div class="flex flex-wrap justify-center gap-6">
                <div class="bg-white text-[#1A261D] px-6 py-4 rounded-xl font-bold border-2 border-[#1A261D] shadow-[4px_4px_0px_0px_#1A261D] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#1A261D] transition-all flex items-center gap-3">
                    <iconify-icon icon="solar:tram-bold" class="text-[#FF6B4A] text-xl"></iconify-icon>
                    Easy Transit Access
                </div>
                <div class="bg-white text-[#1A261D] px-6 py-4 rounded-xl font-bold border-2 border-[#1A261D] shadow-[4px_4px_0px_0px_#1A261D] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#1A261D] transition-all flex items-center gap-3">
                    <iconify-icon icon="solar:leaf-bold" class="text-[#3D6B4F] text-xl"></iconify-icon>
                    Botanical Gardens
                </div>
                <div class="bg-white text-[#1A261D] px-6 py-4 rounded-xl font-bold border-2 border-[#1A261D] shadow-[4px_4px_0px_0px_#1A261D] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#1A261D] transition-all flex items-center gap-3">
                    <iconify-icon icon="solar:buildings-2-bold" class="text-[#9D8BB5] text-xl"></iconify-icon>
                    NYC Skyline Views
                </div>
            </div>
        </div>
    </section>

    <!-- Registration CTA -->
    <section class="py-32 px-6 relative overflow-hidden bg-[#3D6B4F] border-t-4 border-[#1A261D]">
        <!-- Decorations -->
        <div class="absolute top-10 left-10 text-[#C9E265] opacity-20 animate-spin-slow">
            <iconify-icon icon="solar:settings-bold" width="100"></iconify-icon>
        </div>
        <div class="absolute bottom-10 right-10 text-[#FF6B4A] opacity-20 animate-float">
            <iconify-icon icon="solar:star-circle-bold" width="120"></iconify-icon>
        </div>

        <div class="max-w-4xl mx-auto text-center relative z-10 rounded-3xl border-4 border-[#1A261D] p-8 md:p-16 bg-[#F2EFE9] hard-shadow shadow-[12px_12px_0px_0px_#1A261D]">
            <div class="mb-6 flex justify-center">
                <div class="w-20 h-20 bg-[#C9E265] rounded-full border-2 border-[#1A261D] flex items-center justify-center text-[#1A261D] animate-float">
                    <iconify-icon icon="solar:mailbox-bold" width="40"></iconify-icon>
                </div>
            </div>

            <h2 class="text-5xl md:text-7xl font-black tracking-tighter text-[#1A261D] mb-6">
                Be part of <br>
                <span class="text-[#FF6B4A] font-serif italic">history.</span>
            </h2>
            <p class="text-xl text-[#1A261D]/70 mb-10 font-medium">
                Sign up for early access tickets and exclusive updates for YJA 2026.
            </p>

            <form class="flex flex-col md:flex-row gap-4 max-w-lg mx-auto relative">
                <input type="email" placeholder="enter@email.com" class="flex-1 bg-white border-2 border-[#1A261D] rounded-xl px-6 py-4 outline-none focus:ring-4 focus:ring-[#C9E265]/50 text-[#1A261D] placeholder-[#1A261D]/40 font-bold transition-all">
                <button type="button" class="bg-[#1A261D] text-[#F2EFE9] px-8 py-4 rounded-xl font-bold hover:bg-[#FF6B4A] transition-colors shadow-[4px_4px_0px_0px_#9D8BB5] hover:shadow-[2px_2px_0px_0px_#9D8BB5] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none">
                    Join Waitlist
                </button>
            </form>
            <p class="text-sm font-bold text-[#1A261D]/40 mt-6 uppercase tracking-wider">No spam. Only epic updates.</p>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-[#1A261D] text-[#F2EFE9] pt-20 pb-10 px-6">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div class="col-span-1 md:col-span-2">
                <a href="#" class="text-3xl font-black tracking-tighter text-[#F2EFE9] flex items-center gap-2 mb-6 group w-fit">
                    <span class="w-10 h-10 rounded-lg bg-[#C9E265] text-[#1A261D] border-2 border-[#F2EFE9] flex items-center justify-center font-serif italic text-xl group-hover:rotate-12 transition-transform">Y</span>
                    YJA 2026
                </a>
                <p class="text-[#9D8BB5] max-w-sm text-lg font-medium leading-relaxed">
                    Young Jain Professionals of America. <br>
                    Connecting souls, building futures.
                </p>
            </div>

            <div>
                <h4 class="text-[#FF6B4A] font-bold mb-6 uppercase tracking-wider text-sm border-b-2 border-[#FF6B4A]/30 pb-2 w-fit">Navigation</h4>
                <ul class="space-y-4 text-[#F2EFE9]/70 font-medium">
                    <li><a href="#" class="hover:text-[#C9E265] transition-colors flex items-center gap-2"><iconify-icon icon="solar:arrow-right-linear"></iconify-icon> About YJA</a></li>
                    <li><a href="#" class="hover:text-[#C9E265] transition-colors flex items-center gap-2"><iconify-icon icon="solar:arrow-right-linear"></iconify-icon> Convention History</a></li>
                    <li><a href="#" class="hover:text-[#C9E265] transition-colors flex items-center gap-2"><iconify-icon icon="solar:arrow-right-linear"></iconify-icon> Sponsorship</a></li>
                </ul>
            </div>

            <div>
                <h4 class="text-[#FF6B4A] font-bold mb-6 uppercase tracking-wider text-sm border-b-2 border-[#FF6B4A]/30 pb-2 w-fit">Socials</h4>
                <div class="flex gap-4">
                    <a href="#" class="w-12 h-12 rounded-xl bg-[#F2EFE9]/10 border-2 border-[#F2EFE9]/20 flex items-center justify-center hover:bg-[#C9E265] hover:text-[#1A261D] hover:border-[#C9E265] hover:-translate-y-1 transition-all">
                        <iconify-icon icon="logos:instagram-icon" width="24" style="filter: grayscale(100%) brightness(200%);"></iconify-icon>
                    </a>
                    <a href="#" class="w-12 h-12 rounded-xl bg-[#F2EFE9]/10 border-2 border-[#F2EFE9]/20 flex items-center justify-center hover:bg-[#C9E265] hover:text-[#1A261D] hover:border-[#C9E265] hover:-translate-y-1 transition-all">
                        <iconify-icon icon="logos:twitter" width="20" style="filter: grayscale(100%) brightness(200%);"></iconify-icon>
                    </a>
                </div>
            </div>
        </div>

        <div class="max-w-7xl mx-auto pt-8 border-t border-[#F2EFE9]/10 text-center md:text-left flex flex-col md:flex-row justify-between text-[#9D8BB5] text-sm font-medium">
            <p>© 2026 Young Jain Professionals.</p>
            <p class="flex items-center gap-2 justify-center md:justify-end">
                Designed with <iconify-icon icon="solar:heart-bold" class="text-[#FF6B4A]"></iconify-icon> in NJ.
            </p>
        </div>
    </footer>

</body></html>s
