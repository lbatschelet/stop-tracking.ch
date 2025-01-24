'use client'

import { useEffect, useState } from 'react'
import { useGameState } from '../../hooks/useGameState'
import { useMessages } from '../../hooks/useMessages'
import { usePosition } from '../../hooks/usePosition'
import { getNormalizedDistance, getProximityData, isButtonVisible, shouldGlitch } from '../../utils/proximity'
import ClientContent from './ClientContent'
import SplashScreen from './SplashScreen'
import StaticLayout from './StaticLayout'

/**
 * HideAndSeek - Main Game Component
 * 
 * Coordinates the interaction between:
 * - Game state (useGameState)
 * - Message system (useMessages)
 * - Positioning (usePosition)
 * - Mouse/Touch position tracking
 * 
 * Game Flow:
 * 1. Initially shows splash screen
 * 2. After game start, button is hidden
 * 3. Player must find button through mouse/touch movement
 * 4. Proximity indicators help with search
 * 5. Upon successful activation, button jumps to new position
 */
export default function HideAndSeek() {
  const {
    gameStarted,
    score,
    isClient,
    glitchActive,
    matrixCharsRef,
    isInitialButton,
    startGame,
    incrementScore,
    setGlitchActive
  } = useGameState()

  const {
    position,
    isTransitioning,
    generateNewPosition
  } = usePosition()

  const {
    messages,
    addMessage,
    getRandomMessage
  } = useMessages()

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100
      setMousePosition({ x, y })
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault() // Prevent scrolling while touching
      const touch = e.touches[0]
      const x = (touch.clientX / window.innerWidth) * 100
      const y = (touch.clientY / window.innerHeight) * 100
      setMousePosition({ x, y })
    }

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault() // Prevent scrolling while touching
      const touch = e.touches[0]
      const x = (touch.clientX / window.innerWidth) * 100
      const y = (touch.clientY / window.innerHeight) * 100
      setMousePosition({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchstart', handleTouchStart)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchstart', handleTouchStart)
    }
  }, [])

  const normalizedDistance = getNormalizedDistance(mousePosition, position)
  const isNearby = isButtonVisible(normalizedDistance)
  const shouldShowGlitch = shouldGlitch(normalizedDistance)

  useEffect(() => {
    if (shouldShowGlitch && !isTransitioning && !isInitialButton.current) {
      setGlitchActive(true)
    } else {
      setGlitchActive(false)
    }
  }, [shouldShowGlitch, isTransitioning, setGlitchActive, isInitialButton])

  const handleExecute = () => {
    incrementScore()
    const message = getRandomMessage()
    addMessage(message)
    generateNewPosition()
    isInitialButton.current = false
  }

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
      proximityData={getProximityData(normalizedDistance)}
      distance={normalizedDistance}
      position={position}
      isNearby={isNearby && !isTransitioning}
      glitchActive={glitchActive && !isInitialButton.current}
      messages={messages}
      onExecute={handleExecute}
      gameStarted={gameStarted}
    />
  )
} 