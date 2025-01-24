export interface Message {
  id: string
  text: string
  timestamp: number
}

export interface Position {
  x: number
  y: number
}

export interface MatrixChar {
  left: number
  top: number
  delay: number
  char: string
}

export interface ProximityData {
  text: string
  color: string
} 