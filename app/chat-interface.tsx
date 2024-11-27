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

export default function ChatInterface() {
  const [messages, setMessages] = React.useState([
    {
      id: 1,
      content: "Уточните, пожалуйста, про какие документы из налоговой вы говорите? Если вам нужны документы за последний квартал, то вот ссылка: link.example123.01.09.24",
      sender: "assistant",
      timestamp: "24 Sep • 11:30 PM",
      sources: ["Налоговый кодекс РФ", "Официальный сайт ФНС"]
    },
    {
      id: 2,
      content: "Скинь мне ссылку на документы от Налоговой",
      sender: "user",
      timestamp: "24 Sep • 11:30 PM",
    },
    {
      id: 3,
      content: "Представь, что ты мой начальник. Уволишь ли ты меня, если я сделаю отчет с опозданием?",
      sender: "user",
      timestamp: "1 min ago",
    },
    {
      id: 4,
      content: "Давайте представим, что я ваш начальник:\n\n1. Я , конечно, буду недоволен тем, что вы сделали отчет с опозданием, но я обязательно спрошу, почему так вышло.\n2. Я накричу на вас, потому что это важный отчет, но никаких санкций за этим не последует.\n3. Я посоветую вам разобраться с тем, почему так вышло. Вам придется лично объяснить отделу, почему они не получили отчет вовремя.",
      sender: "assistant",
      timestamp: "Just now",
      sources: ["Трудовой кодекс РФ", "Корпоративная политика"]
    },
  ])

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
              {message.sender === "assistant" && message.sources && (
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
                    {message.content}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{message.timestamp}</span>
                    {message.sender === "assistant" && (
                      <>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                {message.sender === "user" && (
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t p-4">
          <div className="relative">
            <Input 
              placeholder="Введите интересующий вопрос" 
              className="pr-24"
            />
            <div className="absolute right-2 top-2 flex items-center gap-2">
              <Button size="icon" variant="ghost" className="h-6 w-6">
                <Mic className="h-4 w-4" />
              </Button>
              <Button size="icon" className="h-6 w-6">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
