import { useCallback, useRef, useState } from 'react'
import type { Position } from '../types/game'
import { calculateDistance } from '../utils/proximity'

/**
 * Hook for managing button position and movement
 * 
 * Features:
 * - Handles button position state
 * - Manages transition states
 * - Ensures minimum distance between positions
 * - Provides smooth position changes
 * 
 * @returns Position state and control functions
 */
export const usePosition = () => {
  const [position, setPosition] = useState<Position>({ x: 50, y: 50 })
  const lastPositionRef = useRef<Position>({ x: 50, y: 50 })
  const [isTransitioning, setIsTransitioning] = useState(false)

  const generateNewPosition = useCallback(() => {
    setIsTransitioning(true)
    
    // Verzögere die Positionsänderung, bis der Button unsichtbar ist
    setTimeout(() => {
      const newPosition: Position = {
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10
      }

      // Ensure minimum distance from last position
      while (calculateDistance(newPosition, lastPositionRef.current) < 30) {
        newPosition.x = Math.random() * 80 + 10
        newPosition.y = Math.random() * 80 + 10
      }

      lastPositionRef.current = position
      setPosition(newPosition)
      
      // Kurze Verzögerung bevor der Button wieder erscheint
      setTimeout(() => {
        setIsTransitioning(false)
      }, 50)
    }, 150) // Warte bis die Ausblend-Animation abgeschlossen ist
  }, [position])

  return {
    position,
    isTransitioning,
    generateNewPosition
  }
} 