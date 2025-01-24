'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { FUNNY_MESSAGES } from '../data/messages'

const generateMatrixChars = () => {
  return Array.from({ length: 100 }).map(() => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 5,
    char: Math.random().toString(36).substring(2, 4)
  }))
}

interface Message {
  id: string
  text: string
  timestamp: number
}

// Statische Server-Komponente
function StaticLayout() {
  return (
    <div className="relative w-full h-screen bg-black flex flex-col items-center font-mono">
      <div className="absolute top-4 left-4 text-green-500 text-sm md:text-base z-20">
        <div className="cursor-blink">[SYSTEM_INITIALIZING...]</div>
      </div>
    </div>
  )
}

// Client-Komponente für Nachrichten
function MessageItem({ message, index, totalMessages }: { 
  message: Message
  index: number
  totalMessages: number 
}) {
  const isLatestMessage = index === totalMessages - 1
  const [shouldFade, setShouldFade] = useState(false)

  useEffect(() => {
    if (!isLatestMessage) {
      // Starte Fade-out nach 5 Sekunden
      const timer = setTimeout(() => {
        setShouldFade(true)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isLatestMessage])

  return (
    <div 
      className={`
        transform-gpu
        text-xs md:text-sm
        ${isLatestMessage ? 'text-green-300' : 'text-green-500'}
        w-full relative z-20
        transition-[opacity,transform] duration-[3000ms] ease-in-out
        ${shouldFade ? 'opacity-0' : 'opacity-100'}
      `}
      style={{
        transform: `translateY(${(totalMessages - 1 - index) * -2}px)`
      }}
    >
      <div className="flex">
        <span className="text-gray-500 mr-2 flex-shrink-0">
          {isLatestMessage ? '>' : '$'}
        </span>
        <span className="break-words">
          {message.text.replace(/_/g, '_\u200B')}
        </span>
      </div>
    </div>
  )
}

// Splash Screen Komponente
function SplashScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="relative w-full h-screen bg-black flex flex-col items-center justify-center font-mono">
      <div className="scanline" />
      <button 
        onClick={onStart}
        className="
          px-3 py-1 bg-transparent 
          border border-green-500 text-green-500 
          font-mono text-xl md:text-3xl 
          hover:bg-green-500 hover:text-black 
          active:bg-green-600
          transition-all duration-300
        "
      >
        [versteckis.ch]
      </button>
    </div>
  )
}

// Client-Komponente
function ClientContent({
  isClient,
  matrixChars,
  score,
  proximityData,
  distance,
  position,
  isNearby,
  glitchActive,
  messages,
  onExecute
}: {
  isClient: boolean
  matrixChars: Array<{ left: number; top: number; delay: number; char: string }>
  score: number
  proximityData: { text: string; color: string }
  distance: number
  position: { x: number; y: number }
  isNearby: boolean
  glitchActive: boolean
  messages: Message[]
  onExecute: () => void
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
    }, 50)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted || !isClient) {
    return <StaticLayout />
  }

  return (
    <div className="relative w-full h-screen bg-black flex flex-col items-center font-mono crt-screen">
      <div className="scanline" />
      
      {/* Matrix-like background effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
        {matrixChars.map((char, i) => (
          <div key={i} 
               className="absolute text-green-500 text-xs animate-matrix"
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
            PROXIMITY: {Math.round(100 - distance)}%
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
          PROXIMITY_ALERT: {Math.round(100 - distance)}%
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
        className="absolute transition-all duration-300 z-50"
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
            transition-all duration-300
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

export default function HideAndSeek() {
  const matrixCharsRef = useRef(generateMatrixChars())
  const lastPositionRef = useRef({ x: 50, y: 50 })
  const mousePositionRef = useRef({ x: 50, y: 50 })
  const isInitialButton = useRef(true)
  
  // Client-side only states
  const [isClient, setIsClient] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [score, setScore] = useState(0)
  const [messages, setMessages] = useState<Message[]>([])
  const [distance, setDistance] = useState(100)
  const [isNearby, setIsNearby] = useState(false)
  const [glitchActive, setGlitchActive] = useState(false)
  const [usedMessages, setUsedMessages] = useState<Set<string>>(new Set())

  const addMessage = useCallback((msg: string) => {
    setMessages(prev => {
      // Don't add if it's the current message
      if (prev.length > 0 && prev[prev.length - 1].text === msg) {
        return prev
      }

      const newMessages = [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          text: msg,
          timestamp: Date.now()
        }
      ].slice(-8)
      return newMessages
    })
  }, [])

  useEffect(() => {
    setIsClient(true)
  }, [])

  const startGame = useCallback(() => {
    setGameStarted(true)
    // Verzögere die erste Nachricht leicht, um Hydration-Probleme zu vermeiden
    const timer = setTimeout(() => {
      addMessage('INITIALIZING_QUANTUM_PROCESSOR...')
    }, 100)
    return () => clearTimeout(timer)
  }, [addMessage])

  const getRandomPosition = useCallback((lastPos: { x: number, y: number }) => {
    const MIN_DISTANCE = 30 // Minimaler Abstand in Prozent
    let newX, newY, dist
    
    do {
      newX = Math.random() * 80 + 10
      newY = Math.random() * 80 + 10
      dist = Math.sqrt(
        Math.pow(newX - lastPos.x, 2) + 
        Math.pow(newY - lastPos.y, 2)
      )
    } while (dist < MIN_DISTANCE)

    return { x: newX, y: newY }
  }, [])

  const generateNewPosition = useCallback(() => {
    isInitialButton.current = false
    // Update used messages
    setUsedMessages(prev => {
      const newSet = new Set(prev)
      if (messages.length > 0) {
        newSet.add(messages[messages.length - 1].text)
      }
      // Reset if all messages have been used
      if (newSet.size >= FUNNY_MESSAGES.length) {
        return new Set()
      }
      return newSet
    })

    // Get available messages
    const availableMessages = FUNNY_MESSAGES.filter(msg => !usedMessages.has(msg))
    const messagePool = availableMessages.length > 0 ? availableMessages : FUNNY_MESSAGES
    const randomMessage = messagePool[Math.floor(Math.random() * messagePool.length)]
    
    addMessage(randomMessage)

    // Fade out current button
    setIsTransitioning(true)
    
    // Generate new position after a short delay
    setTimeout(() => {
      const newPos = getRandomPosition(lastPositionRef.current)
      lastPositionRef.current = newPos
      setPosition(newPos)
      setIsTransitioning(false)
    }, 300) // Warte auf Fade-out Animation
  }, [addMessage, messages, usedMessages, getRandomPosition])

  // Funktion zum Berechnen der Distanz
  const calculateDistance = useCallback((mouseX: number, mouseY: number, buttonX: number, buttonY: number) => {
    return Math.sqrt(
      Math.pow(mouseX - buttonX, 2) + 
      Math.pow(mouseY - buttonY, 2)
    )
  }, [])

  // Update Proximity wenn sich die Position ändert
  useEffect(() => {
    const dist = calculateDistance(
      mousePositionRef.current.x,
      mousePositionRef.current.y,
      position.x,
      position.y
    )
    
    setDistance(dist)
    setIsNearby(dist < 15)
    setGlitchActive(dist < 8)
  }, [position, calculateDistance])

  // Mouse/touch movement handler
  useEffect(() => {
    if (!isClient) return

    const handleMove = (x: number, y: number) => {
      const mouseX = (x / window.innerWidth) * 100
      const mouseY = (y / window.innerHeight) * 100
      
      mousePositionRef.current = { x: mouseX, y: mouseY }
      
      const dist = calculateDistance(mouseX, mouseY, position.x, position.y)
      
      setDistance(dist)
      setIsNearby(dist < 15)
      setGlitchActive(dist < 8)
    }

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY)
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      handleMove(touch.clientX, touch.clientY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [isClient, position, calculateDistance])

  const getProximityData = () => {
    if (distance > 50) return { text: 'CONNECTION_WEAK', color: 'text-blue-500' }
    if (distance > 30) return { text: 'SIGNAL_DETECTED', color: 'text-green-500' }
    if (distance > 20) return { text: 'BREACH_IMMINENT', color: 'text-yellow-500' }
    return { text: 'SYSTEM_VULNERABLE', color: 'text-red-500 glitch' }
  }

  const proximityData = getProximityData()

  if (!isClient) {
    return <StaticLayout />
  }

  if (!gameStarted) {
    return <SplashScreen onStart={startGame} />
  }

  return (
    <ClientContent
      isClient={isClient}
      matrixChars={matrixCharsRef.current}
      score={score}
      proximityData={proximityData}
      distance={distance}
      position={position}
      isNearby={isNearby && !isTransitioning}
      glitchActive={glitchActive && !isInitialButton.current}
      messages={messages}
      onExecute={() => {
        setScore(prev => prev + 1)
        generateNewPosition()
      }}
    />
  )
} 