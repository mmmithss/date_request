import React, { useState, useRef, useEffect, useCallback } from "react"
import { Heart, RotateCcw } from "lucide-react"
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

  // Floating background ambient hearts before "Yes"
  const [ambientHearts] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${(i * 8.3) % 94}%`,
      size: 14 + (i % 4) * 8,
      duration: `${7 + (i % 5) * 2.5}s`,
      delay: `${(i % 5) * 1.4}s`,
      color: i % 3 === 0 ? "text-pink-300/35" : i % 3 === 1 ? "text-rose-300/35" : "text-amber-300/25",
    }))
  )

  // Gentle falling rain of hearts when accepted & dancing
  const [rainHearts] = useState(() =>
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: `${(i * 3.6) % 98}%`,
      size: 16 + (i % 5) * 7,
      duration: `${4 + (i % 6) * 1.2}s`,
      delay: `${(i * 0.28) % 4}s`,
      color:
        i % 4 === 0
          ? "text-rose-500/80"
          : i % 4 === 1
          ? "text-pink-400/85"
          : i % 4 === 2
          ? "text-red-500/75"
          : "text-amber-400/80",
    }))
  )

  const handleYesClick = () => {
    setAccepted(true)
  }

  // Ultra-smooth evasive dodge calculation
  const moveNoButton = useCallback((pointerX?: number, pointerY?: number) => {
    const now = performance.now()
    if (now - lastDodgeTimeRef.current < 75) return
    lastDodgeTimeRef.current = now

    setNoCount((prev) => prev + 1)
    
    const vw = window.innerWidth
    const vh = window.innerHeight
    const btnWidth = noButtonRef.current?.offsetWidth || 130
    const btnHeight = noButtonRef.current?.offsetHeight || 52
    
    const margin = Math.min(24, vw * 0.05)
    const minX = margin
    const maxX = Math.max(minX, vw - btnWidth - margin)
    const minY = margin
    const maxY = Math.max(minY, vh - btnHeight - margin)

    let targetX: number
    let targetY: number

    if (pointerX !== undefined && pointerY !== undefined) {
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

  // Mobile tap: spring sway and auto-accept
  const handleNoTouch = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setSwaying(true)
    setSwayMessage("Nice try! Redirecting your heart to YES... ??")

    setTimeout(() => {
      setSwaying(false)
      handleYesClick()
    }, 400)
  }

  // Desktop mouse proximity detection
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

  // Resolve base path for public assets
  const basePath = import.meta.env.BASE_URL || "./"

  return (
    <main
      ref={containerRef}
      className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50/50 via-rose-50 to-pink-100 px-3 sm:px-6 py-6 select-none"
    >
      {/* Falling Rain of Hearts from the top when accepted */}
      {accepted &&
        rainHearts.map((heart) => (
          <Heart
            key={heart.id}
            className={`heart-rain ${heart.color}`}
            style={{
              left: heart.left,
              width: `${heart.size}px`,
              height: `${heart.size}px`,
              animationDuration: heart.duration,
              animationDelay: heart.delay,
            }}
            fill="currentColor"
          />
        ))}

      {/* Floating Ambient Hearts before accepted */}
      {!accepted &&
        ambientHearts.map((heart) => (
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

      {/* CHARACTER ON THE LEFT: Guy with long hair, black bandana, white shirt with comets/stars & #11 */}
      <div
        className={`fixed left-2 sm:left-6 lg:left-14 bottom-0 z-20 pointer-events-none transition-all duration-1000 ease-in-out ${
          accepted
            ? "translate-x-[150%] opacity-0 scale-75"
            : "translate-x-0 opacity-100 scale-100"
        }`}
      >
        <div className="relative group">
          <div className="relative w-32 sm:w-52 md:w-64 lg:w-72 drop-shadow-2xl overflow-hidden rounded-2xl border-4 border-amber-200/60 bg-amber-50/20 backdrop-blur-xs">
            <img
              src={`${basePath}guy.jpg`}
              alt="Guy with bandana and comet shirt"
              className="w-full h-auto object-cover rounded-xl transition-transform duration-500 hover:scale-105"
            />
            {/* Oil paint artistic tag */}
            <div className="absolute bottom-2 left-2 right-2 rounded-lg bg-black/40 backdrop-blur-md px-2 py-1 text-center text-[10px] sm:text-xs font-semibold text-white/90">
              ?? No. 11 Stargazer
            </div>
          </div>
        </div>
      </div>

      {/* CHARACTER ON THE RIGHT: Brown girl with brown hair & bangs in iconic yellow dress */}
      <div
        className={`fixed right-2 sm:right-6 lg:right-14 bottom-0 z-20 pointer-events-none transition-all duration-1000 ease-in-out ${
          accepted
            ? "-translate-x-[150%] opacity-0 scale-75"
            : "translate-x-0 opacity-100 scale-100"
        }`}
      >
        <div className="relative group">
          <div className="relative w-32 sm:w-52 md:w-64 lg:w-72 drop-shadow-2xl overflow-hidden rounded-2xl border-4 border-yellow-200/60 bg-yellow-50/20 backdrop-blur-xs">
            <img
              src={`${basePath}girl.jpg`}
              alt="Girl in yellow dress"
              className="w-full h-auto object-cover rounded-xl transition-transform duration-500 hover:scale-105"
            />
            {/* Oil paint artistic tag */}
            <div className="absolute bottom-2 left-2 right-2 rounded-lg bg-black/40 backdrop-blur-md px-2 py-1 text-center text-[10px] sm:text-xs font-semibold text-white/90">
              ?? La La Land Dreamer
            </div>
          </div>
        </div>
      </div>

      {/* Main Container / Card */}
      <div
        className={`w-full max-w-md sm:max-w-lg transition-transform duration-300 ease-out z-30 ${
          swaying ? "animate-sway" : ""
        }`}
      >
        <Card className="border-2 border-pink-200/80 bg-white/92 shadow-[0_25px_65px_-12px_rgba(244,63,94,0.25)] backdrop-blur-xl text-center rounded-3xl overflow-hidden p-3 sm:p-5">
          {!accepted ? (
            <>
              <CardHeader className="flex flex-col items-center pb-2 pt-1 sm:pt-2 px-2 sm:px-4">
                {/* Hero Avatar with Pounding Heart */}
                <div className="relative mb-2 flex items-center justify-center">
                  <div className="absolute -inset-2 rounded-full bg-pink-400/25 blur-lg animate-pulse" />
                  <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-500 via-rose-500 to-pink-500 text-white shadow-lg shadow-pink-500/35">
                    <Heart
                      className="h-8 w-8 sm:h-10 sm:w-10 animate-heart-pound drop-shadow-sm"
                      fill="currentColor"
                    />
                  </div>
                </div>

                <CardTitle className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 bg-clip-text text-transparent py-1 leading-tight">
                  Will you go out on a date with me?
                </CardTitle>

                <CardDescription className="text-xs sm:text-sm md:text-base text-pink-950/75 font-medium mt-1 min-h-[2.5rem] flex items-center justify-center">
                  {swayMessage ? (
                    <span className="text-rose-600 font-bold animate-pulse">
                      {swayMessage}
                    </span>
                  ) : noCount > 0 ? (
                    `Dodge count: ${noCount} ????? Two worlds destined to collide!`
                  ) : (
                    "City of stars, are you shining just for us? ???"
                  )}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-3 sm:pt-4 pb-4 px-2 sm:px-4">
                {/* Responsive Button Container */}
                <div className="relative flex flex-wrap items-center justify-center gap-4 sm:gap-6 min-h-[90px]">
                  {/* YES Button featuring pounding heart */}
                  <Button
                    onClick={handleYesClick}
                    variant="romantic"
                    size="lg"
                    style={{
                      transform: `scale(${Math.min(1 + noCount * 0.08, 1.4)})`,
                    }}
                    className="group relative px-8 sm:px-10 py-3.5 sm:py-4 text-lg sm:text-xl font-bold shadow-xl shadow-pink-500/30 transition-all duration-200 cursor-pointer overflow-hidden active:scale-95"
                  >
                    <span className="animate-heart-pound mr-2 inline-flex items-center">
                      <Heart className="h-5 w-5 sm:h-6 sm:w-6 fill-white text-white drop-shadow" />
                    </span>
                    
                    <span>YES!</span>

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

                <div className="mt-4 text-[11px] font-semibold text-pink-400 tracking-wider uppercase">
                  Tip: Look at the two lovers on the sides... say yes to bring them together! ?
                </div>
              </CardContent>
            </>
          ) : (
            /* ACCEPTED STATE: DANCING COUPLE IN OIL PAINTING + HEART RAIN */
            <div className="py-2 sm:py-4 px-2 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-700">
              {/* Couple Dancing Together in Oil Painting with Continuous Dance Loop */}
              <div className="relative mb-3 w-full max-w-xs sm:max-w-sm overflow-hidden rounded-3xl border-4 border-amber-300/80 shadow-2xl shadow-rose-500/30 bg-black/5">
                <img
                  src={`${basePath}couple_dancing.jpg`}
                  alt="Couple dancing in oil painting style"
                  className="w-full h-auto object-cover rounded-2xl animate-dance-loop"
                />

                {/* Soft romantic gradient vignette */}
                <div className="absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-3 right-3 text-center text-xs sm:text-sm font-bold text-amber-200 drop-shadow">
                  ?? Dancing under the city of stars ?
                </div>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 bg-clip-text text-transparent leading-tight">
                IT&apos;S A DATE! ??
              </h2>

              <p className="mt-1 text-sm sm:text-base font-semibold text-neutral-700 max-w-sm mx-auto">
                They finally came together to dance! Best decision ever made. ??
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <Button
                  onClick={() => {
                    setAccepted(false)
                    setNoButtonPos(null)
                    setNoCount(0)
                    setSwayMessage(null)
                  }}
                  variant="outline"
                  size="default"
                  className="rounded-full text-xs sm:text-sm border-pink-200 hover:bg-pink-50"
                >
                  <RotateCcw className="mr-1.5 h-4 w-4" />
                  Ask Again
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Floating Evasive NO Button when dislodged */}
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

      {/* Footer message */}
      <footer className="absolute bottom-2 text-center text-[11px] text-pink-950/40 font-medium tracking-wide">
        City of Stars • Made with love ??
      </footer>
    </main>
  )
}
