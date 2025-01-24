import { useEffect, useState } from 'react'
import type { Message } from '../../types/game'

interface MessageItemProps {
  message: Message
  index: number
  totalMessages: number
}

export default function MessageItem({ message, index, totalMessages }: MessageItemProps) {
  const isLatestMessage = index === totalMessages - 1
  const [shouldFade, setShouldFade] = useState(false)

  useEffect(() => {
    if (!isLatestMessage) {
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