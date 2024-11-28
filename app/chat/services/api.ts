const API_BASE_URL = 'http://localhost:8040'

export async function fetchChats() {
  const response = await fetch(`${API_BASE_URL}/chats`)
  if (!response.ok) {
    throw new Error('Failed to fetch chats')
  }
  const result = await response.json()
  return result // Backend returns array directly
}

export async function fetchChatHistory(chatId: number) {
  const response = await fetch(`${API_BASE_URL}/chat_history/${chatId}`)
  if (!response.ok) {
    throw new Error('Failed to fetch chat history')
  }
  const result = await response.json()
  return result // Backend returns array directly
}

export async function sendMessage(chatId: number, content: string) {
  const response = await fetch(`${API_BASE_URL}/chat_history`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      chat_id: chatId, 
      text: content,
      author: 'user'
    }),
  })
  if (!response.ok) {
    throw new Error('Failed to send message')
  }
  const result = await response.json()
  return result
}

export async function fetchStorages() {
  const response = await fetch(`${API_BASE_URL}/list_storages`)
  if (!response.ok) {
    throw new Error('Failed to fetch storages')
  }
  const result = await response.json()
  return result.data || [] // This endpoint might still wrap in data
}

export async function createChat(name: string, modelId: number) {
  const response = await fetch(`${API_BASE_URL}/chats`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, model_id: modelId }),
  })
  if (!response.ok) {
    throw new Error('Failed to create chat')
  }
  const result = await response.json()
  return result // Backend returns chat directly
}
