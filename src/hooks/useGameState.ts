import { useCallback, useEffect, useRef, useState } from 'react'
import { generateMatrixChars } from '../utils/matrix'

/**
 * Hook for managing the core game state
 * 
 * Handles:
 * - Game start/stop state
 * - Score tracking
 * - Client-side detection
 * - Matrix background characters
 * - Glitch effect state
 * - Initial button state
 * 
 * @returns Game state and control functions
 */
export const useGameState = () => {
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [glitchActive, setGlitchActive] = useState(false)
  const matrixCharsRef = useRef(generateMatrixChars())
  const isInitialButton = useRef(true)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const startGame = useCallback(() => {
    setGameStarted(true)
  }, [])

  const incrementScore = useCallback(() => {
    setScore(prev => prev + 1)
  }, [])

  return {
    gameStarted,
    score,
    isClient,
    glitchActive,
    matrixCharsRef,
    isInitialButton,
    startGame,
    incrementScore,
    setGlitchActive
  }
} 