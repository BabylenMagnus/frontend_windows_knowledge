import { 
  Chat, 
  Model, 
  ChatHistory, 
  ChatRequestBody 
} from '../types/chat'

const BASE_URL = 'http://localhost:8040'

export const chatApi = {
  // Fetch all chats with sorting
  async fetchChats(): Promise<Chat[]> {
    try {
      const response = await fetch(`${BASE_URL}/chats`, {
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
          const historyResponse = await fetch(`${BASE_URL}/chat_history/${chat.id}?limit=1&order=desc`, {
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
      return sortedChats.sort((a, b) => {
        const dateA = new Date(a.lastMessageTimestamp || a.created_at).getTime()
        const dateB = new Date(b.lastMessageTimestamp || b.created_at).getTime()
        return dateB - dateA
      })
    } catch (error) {
      console.error('Error fetching chats:', error)
      return []
    }
  },

  // Create a new chat
  async createChat(name: string, modelId: number): Promise<Chat | null> {
    try {
      const response = await fetch(`${BASE_URL}/chats`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          name: name,
          model_id: modelId
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating chat:', error)
      return null
    }
  },

  // Fetch available models
  async fetchModels(): Promise<Model[]> {
    try {
      const response = await fetch(`${BASE_URL}/models`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching models:', error)
      return []
    }
  }
}
