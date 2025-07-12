import config from "./config"

// API client for making requests to the backend
export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${config.apiUrl}${endpoint}`

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.detail || "An error occurred")
    }

    return data as T
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

interface IntentCreate {
  chroma_id?: string | null
  intent: string
  description: string
  parameters: Record<string, string>
  required: string[]
  responses: Record<string, string>
}

interface IntentResponse {
  intent_id: number
  intent: string
  description: string
  parameters: Record<string, string>
  required: string[]
  responses: Record<string, string>
}

const API_URL = config.apiUrl

export async function fetchIntents(offset: number, limit: number): Promise<IntentResponse[]> {
  try {
    const response = await fetch(`${API_URL}/api/database/intents/?offset=${offset}&limit=${limit}`)
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch intents")
    }
    return response.json()
  } catch (error) {
    console.error("Error fetching intents:", error)
    throw error
  }
}

export async function fetchIntentCount(): Promise<number> {
  try {
    const response = await fetch(`${API_URL}/api/database/get_intent_count`)
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch intent count")
    }
    const data = await response.json()
    // The schema indicates a dictionary with boolean values, but the summary says "integer"
    // Assuming the actual count is under a key like 'count' or 'total'
    // Adjust this based on your actual API response for get_intent_count
    return data.count || data.total || 0 // Adjust key based on actual API response
  } catch (error) {
    console.error("Error fetching intent count:", error)
    throw error
  }
}

export async function deleteIntent(id: number): Promise<{ ok: boolean }> {
  try {
    const response = await fetch(`${API_URL}/api/database/intents/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to delete intent")
    }
    return { ok: true }
  } catch (error) {
    console.error(`Error deleting intent ${id}:`, error)
    throw error
  }
}

export async function processNavigation(textInput: string): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/api/navigation/get_navigation/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: textInput }),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Navigation processing failed")
    }
    return response.json()
  } catch (error) {
    console.error("Error processing navigation:", error)
    throw error
  }
}

export async function uploadNavigationExcel(file: File): Promise<any[]> {
  try {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${API_URL}/api/navigation/test_naivgation/`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to upload navigation Excel.")
    }
    return response.json()
  } catch (error) {
    console.error("Error uploading navigation Excel:", error)
    throw error
  }
}
