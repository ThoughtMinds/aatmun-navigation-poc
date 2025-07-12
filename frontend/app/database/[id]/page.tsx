"use client"

import { useState, useEffect } from "react"
import { fetchApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import JsonViewer from "@/components/json-viewer"
import ErrorMessage from "@/components/error-message"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

interface Intent {
  intent_id: number
  intent: string
  description: string
  parameters: Record<string, string>
  required: string[]
  responses: Record<string, string>
}

export default function IntentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [intent, setIntent] = useState<Intent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchIntent = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchApi<Intent>(`/api/database/intents/${params.id}`)
        setIntent(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch intent")
      } finally {
        setLoading(false)
      }
    }

    fetchIntent()
  }, [params.id])

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this intent?")) return

    try {
      setLoading(true)
      await fetchApi(`/api/database/intents/${params.id}`, {
        method: "DELETE",
      })
      router.push("/database")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete intent")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Intent Details</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/database">Back to List</Link>
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete Intent
          </Button>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : intent ? (
        <Card>
          <CardHeader>
            <CardTitle>{intent.intent}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Description</h3>
              <p>{intent.description}</p>
            </div>

            <div>
              <h3 className="font-medium mb-1">Parameters</h3>
              <JsonViewer data={intent.parameters} />
            </div>

            <div>
              <h3 className="font-medium mb-1">Required Parameters</h3>
              <JsonViewer data={intent.required} />
            </div>

            <div>
              <h3 className="font-medium mb-1">Responses</h3>
              <JsonViewer data={intent.responses} />
            </div>

            <div>
              <h3 className="font-medium mb-1">Full JSON</h3>
              <JsonViewer data={intent} />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Intent not found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
