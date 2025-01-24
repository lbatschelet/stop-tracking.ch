import { useEffect, useState } from 'react'
import type { MatrixChar, Message, Position, ProximityData } from '../../types/game'
import MessageItem from './MessageItem'
import StaticLayout from './StaticLayout'

interface ClientContentProps {
  isClient: boolean
  matrixChars: MatrixChar[]
  score: number
  proximityData: ProximityData
  distance: number
  position: Position
  isNearby: boolean
  glitchActive: boolean
  messages: Message[]
  onExecute: () => void
  gameStarted: boolean
}

export default function ClientContent({
  isClient,
  matrixChars,
  score,
  proximityData,
  distance,
  position,
  isNearby,
  glitchActive,
  messages,
  onExecute,
  gameStarted
}: ClientContentProps) {
  const [mounted, setMounted] = useState(false)
  const [showMatrix, setShowMatrix] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
    }, 50)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (gameStarted) {
      // Verzögere den Matrix-Effekt leicht, damit er nach dem Spielstart erscheint
      const timer = setTimeout(() => {
        setShowMatrix(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [gameStarted])

  if (!mounted || !isClient) {
    return <StaticLayout />
  }

  return (
    <div className="relative w-full h-screen bg-black flex flex-col items-center font-mono crt-screen">
      <div className="scanline" />
      
      {/* Matrix-like background effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0 overflow-hidden">
        {showMatrix && matrixChars.map((char, i) => (
          <div key={i} 
               className="absolute text-emerald-300 text-xs animate-matrix-start"
               style={{ 
                 left: `${char.left}%`,
                 top: `${char.top}%`,
                 animationDelay: `${char.delay}s`
               }}>
            {char.char}
          </div>
        ))}
      </div>

      {/* Terminal-like interface */}
      <div className="absolute top-4 left-4 text-green-500 text-sm md:text-base z-20">
        {/* Desktop-only status */}
        <div className="hidden md:block">
          <div className="mb-2 cursor-blink">[SYS.STATUS=ACTIVE]</div>
          <div>
            SUCCESSFUL_BREACHES: {score}
          </div>
        </div>

        {/* Mobile-only status */}
        <div className="flex flex-col gap-1 md:hidden">
          <div className={`${proximityData.color} flex items-center gap-2`}>
            <div className={`w-2 h-2 rounded-full animate-pulse bg-current`} />
            {proximityData.text}
          </div>
          <div className="text-gray-500 font-mono">
            PROXIMITY: {Math.round(distance)}%
          </div>
          <div className="text-green-500">
            BREACHES: {score}
          </div>
        </div>
      </div>

      {/* Signal strength - desktop only */}
      <div className="absolute top-4 right-4 text-sm md:text-base z-20 hidden md:block">
        <div className={`${proximityData.color} flex items-center gap-2`}>
          <div className={`w-2 h-2 rounded-full animate-pulse bg-current`} />
          {proximityData.text}
        </div>
        <div className="text-gray-500 mt-1 font-mono">
          PROXIMITY_ALERT: {Math.round(distance)}%
        </div>
      </div>

      {/* Console output */}
      <div className="fixed bottom-0 left-0 w-full md:w-[32rem] p-4 z-10">
        <div className="relative">
          {/* Gradient overlay */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0) 100%)'
            }}
          />
          
          <div className="space-y-1">
            {messages.map((message, index) => (
              <MessageItem
                key={message.id}
                message={message}
                index={index}
                totalMessages={messages.length}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Hidden access point */}
      <div 
        className="absolute z-50"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <button
          className={`
            px-3 py-1 bg-transparent 
            border border-green-500 text-green-500 font-mono text-sm md:text-base glitch-hover
            hover:bg-green-500 hover:text-black active:bg-green-600
            transition-opacity duration-150 ease-in-out
            ${isNearby ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
            ${glitchActive ? 'glitch' : ''}
          `}
          onClick={onExecute}
        >
          [EXECUTE]
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 text-gray-500 text-xs md:text-sm text-right font-mono z-20 hidden md:block">
        [OBJECTIVE: LOCATE_VULNERABILITY]<br />
        [METHOD: PROXIMITY_SCAN]
      </div>
    </div>
  )
} 