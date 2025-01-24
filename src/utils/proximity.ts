import type { Position, ProximityData } from '../types/game'

export const calculateDistance = (pos1: Position, pos2: Position): number => {
  const dx = pos1.x - pos2.x
  const dy = pos1.y - pos2.y
  return Math.sqrt(dx * dx + dy * dy)
}

// Normalisiert die Distanz auf einen Wert zwischen 0 und 100
export const getNormalizedDistance = (mousePos: Position, buttonPos: Position): number => {
  const distance = calculateDistance(mousePos, buttonPos)
  // Wir kehren die Distanz um, damit 100 "nah dran" bedeutet
  return Math.min(100, Math.max(0, 100 - distance))
}

export const getProximityData = (normalizedDistance: number): ProximityData => {
  if (normalizedDistance < 70) return { text: 'CONNECTION_WEAK', color: 'text-blue-400' }
  if (normalizedDistance < 80) return { text: 'SIGNAL_DETECTED', color: 'text-emerald-400' }
  if (normalizedDistance < 85) return { text: 'BREACH_IMMINENT', color: 'text-yellow-400' }
  if (normalizedDistance < 95) return { text: 'SYSTEM_VULNERABLE', color: 'text-red-400' }
  return { text: 'SYSTEM_COMPROMISED', color: 'text-red-500 glitch' }
}

// Hilfsfunktionen für die Sichtbarkeit und den Glitch-Effekt
export const isButtonVisible = (normalizedDistance: number): boolean => {
  return normalizedDistance >= 85 // Sichtbar ab 85% Nähe
}

export const shouldGlitch = (normalizedDistance: number): boolean => {
  return normalizedDistance >= 95 // Glitch ab 95% Nähe
} 