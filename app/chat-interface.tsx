"use client"

import * as React from "react"
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { Brain, ChevronDown, ChevronUp, Copy, MessageCircle, Mic, MoreHorizontal, Plus, RefreshCw, Search, Send, Settings, BookmarkIcon } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

// Define types to match backend structure
type Model = {
  id: number;
  name: string;
  model_path: string;
  type: string;
  context_window: number;
}

type Chat = {
  id?: number;
  created_at?: string;
  updated_at?: string;
  name: string;
  model_id: number;
  lastMessageTimestamp?: string;
}

type ChatHistory = {
  id?: number;
  created_at?: string;
  updated_at?: string;
  author: 'model' | 'user';
  chat_id: number;
  text: string;
}

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
  chat_id?: number;
  token?: string;
  selected_model?: number;
  with_gpt?: boolean;
}

type ChatStreamEvent = {
  sources?: string[];
  content?: string;
}

export default function ChatInterface() {
  // State for managing models, chats, and chat history
  const [models, setModels] = React.useState<Model[]>([])
  const [chats, setChats] = React.useState<Chat[]>([])
  const [currentChat, setCurrentChat] = React.useState<Chat | null>(null)
  const [chatHistoryCache, setChatHistoryCache] = React.useState<{[chatId: number]: Message[]}>({})

  // Existing state for messages and UI
  const [messages, setMessages] = React.useState<Message[]>([])
  const [inputMessage, setInputMessage] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const messagesEndRef = React.useRef<null | HTMLDivElement>(null)

  const router = useRouter()

  // Get settings from localStorage at the beginning of the component
  const [token, setToken] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('apiToken') || '';
    }
    return '';
  });

  const [selectedModel, setSelectedModel] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedModel') || '';
    }
    return '';
  });

  const [neuroApiEnabled, setNeuroApiEnabled] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('neuroApiEnabled') === 'true';
    }
    return false;
  });

  // Update settings when localStorage changes
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleStorageChange = () => {
        setToken(localStorage.getItem('apiToken') || '');
        setSelectedModel(localStorage.getItem('selectedModel') || '');
        setNeuroApiEnabled(localStorage.getItem('neuroApiEnabled') === 'true');
      };

      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  // Fetch models and chats when component mounts
  React.useEffect(() => {
    fetchModels()
    fetchChats()
  }, [])

  // Fetch available models
  const fetchModels = async () => {
    try {
      const response = await fetch('http://localhost:8040/models', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const fetchedModels = await response.json()
      setModels(fetchedModels)
    } catch (error) {
      console.error('Error fetching models:', error)
    }
  }

  // Fetch chats
  const fetchChats = async () => {
    try {
      const response = await fetch('http://localhost:8040/chats', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const fetchedChats: Chat[] = await response.json()
      
      // Sort chats by most recent message
      const sortedChats = await Promise.all(fetchedChats.map(async (chat) => {
        try {
          // Fetch last message for each chat
          const historyResponse = await fetch(`http://localhost:8040/chat_history/${chat.id}?limit=1&order=desc`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors'
          })

          if (!historyResponse.ok) {
            console.warn(`Could not fetch last message for chat ${chat.id}`)
            return { ...chat, lastMessageTimestamp: chat.created_at }
          }

          const history: ChatHistory[] = await historyResponse.json()
          
          return { 
            ...chat, 
            lastMessageTimestamp: history.length > 0 
              ? history[0].created_at 
              : chat.created_at 
          }
        } catch (error) {
          console.error(`Error fetching last message for chat ${chat.id}:`, error)
          return { ...chat, lastMessageTimestamp: chat.created_at }
        }
      }))

      // Sort by most recent message timestamp
      const finalSortedChats = sortedChats.sort((a, b) => {
        const dateA = new Date(a.lastMessageTimestamp || a.created_at).getTime()
        const dateB = new Date(b.lastMessageTimestamp || b.created_at).getTime()
        return dateB - dateA
      })

      setChats(finalSortedChats)
    } catch (error) {
      console.error('Error fetching chats:', error)
    }
  }

  // Create a new chat
  const createNewChat = async () => {
    // Use the first model if available, otherwise default to 1
    const modelId = models.length > 0 ? models[0].id : 1

    try {
      const response = await fetch('http://localhost:8040/chats', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          name: `Новый чат ${chats.length + 1}`,
          model_id: modelId
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const newChat = await response.json()
      setChats(prev => [...prev, newChat])
      selectChat(newChat)
    } catch (error) {
      console.error('Error creating chat:', error)
      alert(`Не удалось создать чат: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`)
    }
  }

  // Load chat history
  const loadChatHistory = async (chatId: number) => {
    // Check cache first
    if (chatHistoryCache[chatId]) {
      setMessages(chatHistoryCache[chatId])
      return chatHistoryCache[chatId]
    }

    try {
      const response = await fetch(`http://localhost:8040/chat_history/${chatId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const history: ChatHistory[] = await response.json()
      
      // Convert chat history to messages
      const convertedMessages: Message[] = history.map((entry) => ({
        id: entry.id || Date.now(),
        content: entry.text,
        sender: entry.author === 'user' ? 'user' : 'assistant',
        timestamp: entry.created_at || new Date().toLocaleString(),
      }))

      // Update cache and messages
      setChatHistoryCache(prev => ({...prev, [chatId]: convertedMessages}))
      setMessages(convertedMessages)
      
      return convertedMessages
    } catch (error) {
      console.error('Error loading chat history:', error)
      return []
    }
  }

  // Select a chat and load its history
  const selectChat = async (chat: Chat) => {
    // Set current chat immediately
    setCurrentChat(chat)

    if (chat.id) {
      // Check if history is in cache
      const cachedHistory = chatHistoryCache[chat.id]
      
      if (cachedHistory) {
        // Use cached history if available
        setMessages(cachedHistory)
      } else {
        // Fetch history if not in cache
        await loadChatHistory(chat.id)
      }
    }
  }

  // Modify handleSendMessage to save messages to chat history
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !currentChat) return;

    const userMessage: Message = {
        id: Date.now(),
        content: inputMessage,
        sender: 'user',
        timestamp: new Date().toLocaleString(),
    };

    // Update local state and cache
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Update cache for current chat
    if (currentChat.id) {
        setChatHistoryCache(prev => ({
            ...prev,
            [currentChat.id]: updatedMessages
        }));

        // Update chats list to move current chat to top
        setChats(prevChats => {
            const updatedChats = prevChats.map(chat => 
                chat.id === currentChat.id 
                    ? { ...chat, lastMessageTimestamp: new Date().toISOString() }
                    : chat
            );

            // Re-sort chats
            return updatedChats.sort((a, b) => {
                const dateA = new Date(a.lastMessageTimestamp || a.created_at).getTime();
                const dateB = new Date(b.lastMessageTimestamp || b.created_at).getTime();
                return dateB - dateA;
            });
        });
    }

    // Send user message to backend
    try {
        // Save user message to chat history
        await fetch('http://localhost:8040/chat_history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            body: JSON.stringify({
                chat_id: currentChat.id,
                text: inputMessage,
                author: 'user'
            })
        });

        setInputMessage('');
        setIsLoading(true);

        const assistantMessage: Message = {
            id: Date.now() + 1,
            content: '',
            sender: 'assistant',
            timestamp: new Date().toLocaleString(),
            sources: [],
            isStreaming: true,
        };

        // Add assistant message to state
        setMessages(prev => [...prev, assistantMessage]);

        // Prepare request body with chat_id, token, selected model, and with_gpt flag
        const requestBody: ChatRequestBody = {
            query: inputMessage,
            collection_name: 'test',
            chat_id: currentChat.id,
            token: token,
            selected_model: selectedModel,
            with_gpt: neuroApiEnabled
        };

        // Use AbortController to handle request timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch('http://localhost:8040/chatting_v2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal,
            mode: 'cors',
            credentials: 'include'
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, ${await response.text()}`);
        }

        if (!response.body) {
            throw new Error('No response body');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = '';
        let sources: string[] = [];

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const events = chunk.split('\n\n');

            events.forEach(event => {
                if (event.startsWith('data: ')) {
                    try {
                        const parsedData: ChatStreamEvent = JSON.parse(event.slice(6));

                        if (parsedData.sources) {
                            sources = parsedData.sources;
                        }

                        if (parsedData.content) {
                            fullContent += parsedData.content;
                            setMessages(prev => 
                                prev.map(msg => 
                                    msg.id === assistantMessage.id 
                                        ? { ...msg, content: fullContent, sources: sources, isStreaming: true } 
                                        : msg
                                )
                            );
                        }
                    } catch (e) {
                        console.error('Error parsing event', e);
                    }
                }
            });
        }

        // Save assistant message to chat history
        await fetch('http://localhost:8040/chat_history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            body: JSON.stringify({
                chat_id: currentChat.id,
                text: fullContent,
                author: 'model'
            })
        });

        // Update messages with final content and mark as not streaming
        setMessages(prev => 
            prev.map(msg => 
                msg.id === assistantMessage.id 
                    ? { ...msg, content: fullContent, sources: sources, isStreaming: false } 
                    : msg
            )
        );

        // Update chat history cache
        if (currentChat.id) {
            setChatHistoryCache(prev => {
                const updatedMessages = prev[currentChat.id] 
                    ? [...prev[currentChat.id], 
                       { ...assistantMessage, content: fullContent, sources: sources, isStreaming: false }]
                    : [userMessage, { ...assistantMessage, content: fullContent, sources: sources, isStreaming: false }];
                
                return {
                    ...prev,
                    [currentChat.id]: updatedMessages
                };
            });
        }

        setIsLoading(false);
    } catch (error) {
        console.error('Chat error:', error);
        setIsLoading(false);

        // Detailed error handling
        const errorMessage = error instanceof Error 
            ? error.message 
            : 'Неизвестная ошибка при отправке сообщения';

        setMessages(prev => 
            prev.map(msg => 
                msg.id === (prev[prev.length - 1]?.id || 0)
                    ? { 
                        ...msg, 
                        content: `Ошибка: ${errorMessage}`, 
                        isStreaming: false 
                    } 
                    : msg
            )
        );
    }
  };

  // Scrolling logic remains the same
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Render the interface
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b flex items-center gap-2">
          <Brain className="w-6 h-6" />
          <h1 className="font-semibold">Мои чаты</h1>
          <Button 
            size="icon" 
            variant="ghost" 
            className="ml-auto rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200"
            onClick={createNewChat}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-auto">
          <div className="space-y-2 p-4">
            {chats.map((chat) => (
              <Card 
                key={chat.id} 
                className={cn(
                  "p-3 cursor-pointer hover:bg-accent",
                  currentChat?.id === chat.id ? "bg-accent" : ""
                )}
                onClick={() => selectChat(chat)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{chat.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {new Date(chat.lastMessageTimestamp || chat.created_at || '').toLocaleString()}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header with Settings Button */}
        <div className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-semibold">Window Knowledge Chat</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.push('/settings')}
            >
              <Settings className="h-5 w-5" />
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
