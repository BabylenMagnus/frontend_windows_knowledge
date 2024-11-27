import React, { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { Message } from '../types/message'
import { cn } from '@/lib/utils'
import { Brain, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ChatMessagesProps {
  messages: Message[];
  isLoading?: boolean;
}

export function ChatMessages({ 
  messages, 
  isLoading 
}: ChatMessagesProps) {
  const messagesEndRef = useRef<null | HTMLDivElement>(null)

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Copy message to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <div 
          key={message.id} 
          className={cn(
            "flex items-start gap-4",
            message.sender === 'user' ? "justify-end" : "justify-start"
          )}
        >
          {message.sender === 'assistant' && (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary" />
            </div>
          )}
          
          <div 
            className={cn(
              "max-w-[75%] p-3 rounded-lg",
              message.sender === 'user' 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold">
                {message.sender === 'user' ? 'Вы' : 'Помощник'}
              </span>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-6 w-6"
                onClick={() => copyToClipboard(message.content)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            <ReactMarkdown 
              components={{
                a: ({node, ...props}) => (
                  <a 
                    {...props} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:underline"
                  />
                ),
                code: ({node, ...props}) => (
                  <code 
                    {...props} 
                    className="bg-gray-100 p-1 rounded text-sm"
                  />
                )
              }}
            >
              {message.content}
            </ReactMarkdown>

            {message.sources && message.sources.length > 0 && (
              <div className="mt-2 text-xs text-muted-foreground">
                <strong>Источники:</strong>
                <ul>
                  {message.sources.map((source, idx) => (
                    <li key={idx}>
                      <a 
                        href={source} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:underline"
                      >
                        {source}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Brain className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <div className="bg-muted p-3 rounded-lg animate-pulse">
            Генерация ответа...
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}
