import React, { useState, useRef, useEffect, useCallback } from "react"
import confetti from "canvas-confetti"
import { Heart, PartyPopper, Smile, Compass, Flame, RotateCcw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./components/ui/card"
import { Button } from "./components/ui/button"

export default function App() {
  const [accepted, setAccepted] = useState(false)
  const [noButtonPos, setNoButtonPos] = useState<{ x: number; y: number } | null>(null)
  const [noCount, setNoCount] = useState(0)
  const [swaying, setSwaying] = useState(false)
  const [swayMessage, setSwayMessage] = useState<string | null>(null)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const noButtonRef = useRef<HTMLButtonElement>(null)
  const lastDodgeTimeRef = useRef<number>(0)

  // Floating background ambient hearts - stable with GPU translation
  const [ambientHearts] = useState(() =>
    Array.from({ length: 14 }, (_, i) => ({
      id: i,
      left: `${(i * 7.1) % 94}%`,
      size: 14 + (i % 4) * 8,
      duration: `${7 + (i % 5) * 2.5}s`,
      delay: `${(i % 5) * 1.4}s`,
      color: i % 3 === 0 ? "text-pink-300/35" : i % 3 === 1 ? "text-rose-300/35" : "text-red-300/25",
    }))
  )

  // Smooth multi-angle confetti heart & celebration shower
  const triggerHeartShower = useCallback(() => {
    const duration = 4 * 1000
    const animationEnd = Date.now() + duration
    const romanticColors = ["#ff2d55", "#ff375f", "#ff6482", "#ff85a1", "#ffd1dc", "#e11d48", "#fda4af"]

    const frame = () => {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 65,
        origin: { x: 0, y: 0.75 },
        colors: romanticColors,
        scalar: 1.25,
      })
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 65,
        origin: { x: 1, y: 0.75 },
        colors: romanticColors,
        scalar: 1.25,
      })
      confetti({
        particleCount: 5,
        spread: 90,
        origin: { x: 0.5, y: 0.35 },
        colors: romanticColors,
      })

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame)
      }
    }
    frame()
  }, [])

  const handleYesClick = () => {
    setAccepted(true)
    triggerHeartShower()
  }

  // Ultra-smooth evasive dodge calculation
  const moveNoButton = useCallback((pointerX?: number, pointerY?: number) => {
    const now = performance.now()
    // Throttle dodge slightly to prevent micro-jitter
    if (now - lastDodgeTimeRef.current < 80) return
    lastDodgeTimeRef.current = now

    setNoCount((prev) => prev + 1)
    
    // Viewport bounds with safe margins
    const vw = window.innerWidth
    const vh = window.innerHeight
    const btnWidth = noButtonRef.current?.offsetWidth || 130
    const btnHeight = noButtonRef.current?.offsetHeight || 52
    
    const margin = Math.min(24, vw * 0.05)
    const minX = margin
    const maxX = Math.max(minX, vw - btnWidth - margin)
    const minY = margin
    const maxY = Math.max(minY, vh - btnHeight - margin)

    // Calculate intelligent evasive trajectory away from cursor/finger if position is provided
    let targetX: number
    let targetY: number

    if (pointerX !== undefined && pointerY !== undefined) {
      // Find a spot in the opposite or far quadrant from the pointer
      const awayX = pointerX < vw / 2 ? pointerX + 160 + Math.random() * (vw - pointerX - 180) : pointerX - 160 - Math.random() * (pointerX - 180)
      const awayY = pointerY < vh / 2 ? pointerY + 120 + Math.random() * (vh - pointerY - 140) : pointerY - 120 - Math.random() * (pointerY - 140)

      targetX = Math.min(Math.max(awayX, minX), maxX)
      targetY = Math.min(Math.max(awayY, minY), maxY)
    } else {
      targetX = Math.floor(Math.random() * (maxX - minX)) + minX
      targetY = Math.floor(Math.random() * (maxY - minY)) + minY
    }

    setNoButtonPos({ x: Math.round(targetX), y: Math.round(targetY) })
  }, [])

  // Mobile tap handler: gently sways the card and triggers YES naturally
  const handleNoTouch = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setSwaying(true)
    setSwayMessage("Nice try! Destiny chose YES for you... ??")

    setTimeout(() => {
      setSwaying(false)
      handleYesClick()
    }, 400)
  }

  // Smooth proximity evasion for desktop cursor
  useEffect(() => {
    let rafId: number | null = null

    const handleMouseMove = (e: MouseEvent) => {
      if (accepted || !noButtonRef.current) return

      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        if (!noButtonRef.current) return
        const rect = noButtonRef.current.getBoundingClientRect()
        const buttonCenterX = rect.left + rect.width / 2
        const buttonCenterY = rect.top + rect.height / 2

        const distance = Math.hypot(e.clientX - buttonCenterX, e.clientY - buttonCenterY)

        // Trigger smooth dodge when cursor approaches within 85px
        if (distance < 85) {
          moveNoButton(e.clientX, e.clientY)
        }
      })
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [accepted, moveNoButton])

  // Playful dodge phrases
  const noButtonTexts = [
    "No",
    "Are you sure? ??",
    "Wait, think again! ??",
    "Can't catch me! ?????",
    "Wrong button! ??",
    "Nice try! ??",
    "Not an option! ??",
    "Destiny says YES! ?",
    "Give in to love! ??",
  ]

  const currentNoText = noButtonTexts[Math.min(noCount, noButtonTexts.length - 1)]

  return (
    <main
      ref={containerRef}
      className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-pink-100 via-rose-50 to-red-100 px-3 sm:px-6 py-8 select-none"
    >
      {/* Background Animated Floating Hearts */}
      {ambientHearts.map((heart) => (
        <Heart
          key={heart.id}
          className={`floating-bg-heart ${heart.color}`}
          style={{
            left: heart.left,
            bottom: "-48px",
            width: `${heart.size}px`,
            height: `${heart.size}px`,
            animationDuration: heart.duration,
            animationDelay: heart.delay,
          }}
          fill="currentColor"
        />
      ))}

      {/* Main Proposal Card */}
      <div
        className={`w-full max-w-md sm:max-w-lg transition-transform duration-300 ease-out z-10 ${
          swaying ? "animate-sway" : ""
        }`}
      >
        <Card className="border border-pink-200/90 bg-white/90 shadow-[0_20px_60px_-15px_rgba(244,63,94,0.22)] backdrop-blur-xl text-center rounded-3xl overflow-hidden p-3 sm:p-6">
          {!accepted ? (
            <>
              <CardHeader className="flex flex-col items-center pb-2 pt-2 sm:pt-4 px-2 sm:px-6">
                {/* Pounding Heart Hero Avatar */}
                <div className="relative mb-3 flex items-center justify-center">
                  <div className="absolute -inset-2.5 rounded-full bg-pink-400/25 blur-lg animate-pulse" />
                  <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-red-500 text-white shadow-lg shadow-pink-500/35">
                    <Heart
                      className="h-10 w-10 sm:h-12 sm:w-12 animate-heart-pound drop-shadow-sm"
                      fill="currentColor"
                    />
                  </div>
                </div>

                <CardTitle className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-pink-600 via-rose-600 to-red-500 bg-clip-text text-transparent py-1 leading-tight">
                  Will you go out on a date with me?
                </CardTitle>

                <CardDescription className="text-sm sm:text-base text-pink-900/75 font-medium mt-2 min-h-[3rem] flex items-center justify-center">
                  {swayMessage ? (
                    <span className="text-rose-600 font-bold animate-pulse">
                      {swayMessage}
                    </span>
                  ) : noCount > 0 ? (
                    `Dodge count: ${noCount} ????? Destiny clearly has other plans!`
                  ) : (
                    "I promise delicious treats, great conversation, and unlimited laughs! ??"
                  )}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-4 sm:pt-6 pb-6 px-2 sm:px-6">
                {/* Responsive Button Container */}
                <div className="relative flex flex-wrap items-center justify-center gap-4 sm:gap-6 min-h-[95px]">
                  {/* YES Button featuring pounding heart (No AI sparkles) */}
                  <Button
                    onClick={handleYesClick}
                    variant="romantic"
                    size="lg"
                    style={{
                      transform: `scale(${Math.min(1 + noCount * 0.08, 1.45)})`,
                    }}
                    className="group relative px-7 sm:px-9 py-3.5 sm:py-4 text-lg sm:text-xl font-bold shadow-xl shadow-pink-500/30 transition-all duration-200 cursor-pointer overflow-hidden active:scale-95"
                  >
                    {/* Left Pounding Heart */}
                    <span className="animate-heart-pound mr-2 inline-flex items-center">
                      <Heart className="h-5 w-5 sm:h-6 sm:w-6 fill-white text-white drop-shadow" />
                    </span>
                    
                    <span>YES!</span>

                    {/* Right Heart with hover expansion */}
                    <Heart className="ml-2 h-4 w-4 sm:h-5 sm:w-5 fill-white/80 group-hover:scale-125 transition-transform duration-200" />
                  </Button>

                  {/* NO Button (initial stationary position) */}
                  {!noButtonPos && (
                    <Button
                      ref={noButtonRef}
                      onMouseEnter={(e) => moveNoButton(e.clientX, e.clientY)}
                      onTouchStart={handleNoTouch}
                      onClick={handleNoTouch}
                      variant="outline"
                      size="lg"
                      className="border-2 border-neutral-300 text-neutral-600 hover:text-neutral-800 text-base sm:text-lg font-semibold px-5 sm:px-7 py-3.5 sm:py-4 transition-all duration-150 cursor-pointer"
                    >
                      {currentNoText}
                    </Button>
                  )}
                </div>

                <div className="mt-6 text-[11px] sm:text-xs font-semibold text-pink-400 tracking-wider uppercase">
                  Tip: Resistance is futile! ??
                </div>
              </CardContent>
            </>
          ) : (
            /* Accepted State */
            <div className="py-6 sm:py-8 px-2 sm:px-6 flex flex-col items-center justify-center">
              <div className="relative mb-5">
                <div className="absolute -inset-3 rounded-full bg-pink-500/30 blur-xl animate-pulse" />
                <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-red-500 text-white shadow-xl shadow-pink-500/40">
                  <PartyPopper className="h-10 w-10 sm:h-12 sm:w-12 animate-bounce" />
                </div>
              </div>

              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text text-transparent leading-tight">
                YAYYY! It&apos;s a Date! ??
              </h2>

              <p className="mt-3 text-base sm:text-lg font-semibold text-neutral-700 max-w-sm sm:max-w-md mx-auto">
                Best decision ever made! I cannot wait. ??
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-100 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-pink-700">
                  <Flame className="h-3.5 w-3.5 text-rose-500" /> Great Chemistry
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-rose-700">
                  <Smile className="h-3.5 w-3.5 text-rose-500" /> Fun Times
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-red-700">
                  <Compass className="h-3.5 w-3.5 text-red-500" /> Core Memories
                </span>
              </div>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Button
                  onClick={triggerHeartShower}
                  variant="romantic"
                  size="default"
                  className="rounded-full shadow-lg text-sm sm:text-base font-semibold"
                >
                  <span className="animate-heart-pound mr-1.5 inline-flex items-center">
                    <Heart className="h-4 w-4 fill-white" />
                  </span>
                  Shower More Hearts!
                </Button>
                <Button
                  onClick={() => {
                    setAccepted(false)
                    setNoButtonPos(null)
                    setNoCount(0)
                    setSwayMessage(null)
                  }}
                  variant="outline"
                  size="default"
                  className="rounded-full text-sm sm:text-base"
                >
                  <RotateCcw className="mr-1.5 h-4 w-4" />
                  Play Again
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Ultra-Smooth Evasive NO Button when dislodged (Hardware-Accelerated transform) */}
      {!accepted && noButtonPos && (
        <button
          ref={noButtonRef}
          onMouseEnter={(e) => moveNoButton(e.clientX, e.clientY)}
          onTouchStart={handleNoTouch}
          onClick={handleNoTouch}
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            transform: `translate3d(${noButtonPos.x}px, ${noButtonPos.y}px, 0)`,
            transition: "transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)",
            zIndex: 9999,
            willChange: "transform",
          }}
          className="h-12 sm:h-14 px-6 sm:px-8 rounded-2xl border-2 border-pink-300 bg-white/95 text-pink-700 font-bold shadow-2xl backdrop-blur-md text-base sm:text-lg cursor-pointer hover:bg-pink-50 active:scale-95 select-none touch-manipulation"
        >
          {currentNoText}
        </button>
      )}

      {/* Clean Bottom Footer */}
      <footer className="absolute bottom-3 sm:bottom-4 text-center text-xs text-pink-900/40 font-medium tracking-wide">
        Made with love ??
      </footer>
    </main>
  )
}
