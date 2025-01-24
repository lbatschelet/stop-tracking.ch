import type { MatrixChar } from '../types/game'

export const generateMatrixChars = (): MatrixChar[] => {
  return Array.from({ length: 100 }).map(() => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 5,
    char: Math.random().toString(36).substring(2, 4)
  }))
} 