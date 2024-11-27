"use client"

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { Brain, ChevronDown, ChevronUp, Copy, MessageCircle, Mic, MoreHorizontal, Plus, RefreshCw, Search, Send, Settings, BookmarkIcon } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

// Define types for the chat functionality
type Message = {
  id: number;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  sources?: string[];
  isStreaming?: boolean;
}

type ChatRequestBody = {
  query: string;
  collection_name?: string;
}

type ChatStreamEvent = {
  sources?: string[];
  content?: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [inputMessage, setInputMessage] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const messagesEndRef = React.useRef<null | HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleString(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    const assistantMessage: Message = {
      id: Date.now() + 1,
      content: '',
      sender: 'assistant',
      timestamp: new Date().toLocaleString(),
      sources: [],
      isStreaming: true,
    }

    setMessages(prev => [...prev, assistantMessage])

    try {
      // Prepare request body with type safety
      const requestBody: ChatRequestBody = {
        query: inputMessage,
        collection_name: 'test'
      }

      // Use AbortController to handle request timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch('http://localhost:8040/chatting_v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add custom headers for CORS preflight
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
        // Explicitly set CORS mode
        mode: 'cors',
        // Include credentials if needed
        credentials: 'include'
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, ${await response.text()}`)
      }

      if (!response.body) {
        throw new Error('No response body')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''
      let sources: string[] = []

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const events = chunk.split('\n\n')

        events.forEach(event => {
          if (event.startsWith('data: ')) {
            try {
              const parsedData: ChatStreamEvent = JSON.parse(event.slice(6))
              
              if (parsedData.sources) {
                sources = parsedData.sources
              }

              if (parsedData.content) {
                fullContent += parsedData.content
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === assistantMessage.id 
                      ? { ...msg, content: fullContent, sources: sources } 
                      : msg
                  )
                )
              }
            } catch (e) {
              console.error('Error parsing event', e)
            }
          }
        })
      }

      setIsLoading(false)
    } catch (error) {
      console.error('Chat error:', error)
      setIsLoading(false)
      
      // Detailed error handling
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Неизвестная ошибка при отправке сообщения'

      setMessages(prev => 
        prev.map(msg => 
          msg.id === assistantMessage.id 
            ? { 
                ...msg, 
                content: `Ошибка: ${errorMessage}`, 
                isStreaming: false 
              } 
            : msg
        )
      )
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b flex items-center gap-2">
          <Brain className="w-6 h-6" />
          <h1 className="font-semibold">Мои чаты</h1>
          <Button size="icon" variant="ghost" className="ml-auto rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200">
            <Plus className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="chats" className="flex-1">
          <TabsList className="w-full justify-start gap-2 rounded-none border-b bg-background p-0">
            <TabsTrigger value="chats" className="data-[state=active]:bg-background rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              <MessageCircle className="mr-2 h-4 w-4" />
              CHATS <span className="ml-1 text-muted-foreground">51</span>
            </TabsTrigger>
            <TabsTrigger value="saved" className="data-[state=active]:bg-background rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              <BookmarkIcon className="mr-2 h-4 w-4" />
              SAVED <span className="ml-1 text-muted-foreground">24</span>
            </TabsTrigger>
          </TabsList>

          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-8" />
            </div>
          </div>

          <TabsContent value="chats" className="m-0">
            <div className="space-y-2 p-4">
              {["Как закрыть квартал", "Почему я работаю в субботу", "Нормальная ли у меня зп"].map((chat, i) => (
                <Card key={i} className="p-3 cursor-pointer hover:bg-accent">
                  <h3 className="font-medium">{chat}</h3>
                  <p className="text-sm text-muted-foreground">Last message preview...</p>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="border-b p-4 flex items-center justify-between">
          <h2 className="font-semibold">Текущий чат с Ассистентом</h2>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost">
              <Search className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex flex-col gap-1 max-w-[80%]", message.sender === "assistant" ? "mr-auto" : "ml-auto")}
            >
              {message.sender === "assistant" && message.sources && message.sources.length > 0 && (
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <button className="flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors">
                      <ChevronDown className="h-3 w-3 mr-1" />
                      Источники
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-1">
                    <ul className="text-xs text-muted-foreground list-disc list-inside">
                      {message.sources.map((source, index) => (
                        <li key={index}>{source}</li>
                      ))}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              )}
              <div className={cn("flex gap-3", message.sender === "assistant" ? "mr-auto" : "ml-auto")}>
                {message.sender === "assistant" && (
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}
                <div className="space-y-1">
                  <div className={cn(
                    "rounded-lg p-3",
                    message.sender === "assistant" ? "bg-blue-50" : "bg-primary text-primary-foreground"
                  )}>
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{message.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Area */}
        <div className="border-t p-4 flex items-center gap-2">
          <Input 
            placeholder="Введите интересующий вопрос" 
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
