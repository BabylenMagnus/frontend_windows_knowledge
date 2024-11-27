import React, { useState } from 'react'
import { Send, Mic } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInput({ 
  onSendMessage, 
  isLoading 
}: ChatInputProps) {
  const [inputMessage, setInputMessage] = useState('')

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    onSendMessage(inputMessage)
    setInputMessage('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send message on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="border-t p-4 flex items-end gap-2">
      <div className="flex-1">
        <Textarea
          placeholder="Введите сообщение..."
          className="min-h-[50px] max-h-[200px] resize-y"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
      </div>
      
      <div className="flex gap-2">
        <Button 
          size="icon" 
          variant="outline"
          className="rounded-full"
          disabled
        >
          <Mic className="h-5 w-5" />
        </Button>
        
        <Button 
          size="icon" 
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isLoading}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
