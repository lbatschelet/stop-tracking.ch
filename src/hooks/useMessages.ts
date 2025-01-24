import { useCallback, useState } from 'react'
import { FUNNY_MESSAGES } from '../data/messages'
import type { Message } from '../types/game'

/**
 * Hook for managing game messages
 * 
 * Features:
 * - Maintains message history
 * - Tracks used messages to prevent duplicates
 * - Provides random message selection
 * - Handles message addition with timestamps
 * 
 * @returns Message state and control functions
 */
export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [usedMessages, setUsedMessages] = useState<Set<string>>(new Set())

  const addMessage = useCallback((text: string) => {
    if (usedMessages.has(text)) return

    const newMessage: Message = {
      id: Math.random().toString(36).substring(2),
      text,
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, newMessage])
    setUsedMessages(prev => new Set(prev).add(text))
  }, [usedMessages])

  const getRandomMessage = useCallback(() => {
    const availableMessages = FUNNY_MESSAGES.filter(msg => !usedMessages.has(msg))
    if (availableMessages.length === 0) {
      setUsedMessages(new Set())
      return FUNNY_MESSAGES[Math.floor(Math.random() * FUNNY_MESSAGES.length)]
    }
    return availableMessages[Math.floor(Math.random() * availableMessages.length)]
  }, [usedMessages])

  return {
    messages,
    addMessage,
    getRandomMessage
  }
} 