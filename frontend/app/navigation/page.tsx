"use client"

import type React from "react"

import { useState } from "react"
import { fetchApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import JsonViewer from "@/components/json-viewer"
import ErrorMessage from "@/components/error-message"

interface NavigationQuery {
  query: string
  source?: string | null
}

interface Navigation {
  id: number
  reasoning: string
}

export default function NavigationPage() {
  const [query, setQuery] = useState("")
  const [source, setSource] = useState("")
  const [result, setResult] = useState<Navigation | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError(null)

      const navigationQuery: NavigationQuery = {
        query,
        source: source || null,
      }

      const data = await fetchApi<Navigation>("/api/navigation/get_navigation/", {
        method: "POST",
        body: JSON.stringify(navigationQuery),
      })

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get navigation")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Navigation</h1>

      {error && <ErrorMessage message={error} />}

      <Card>
        <CardHeader>
          <CardTitle>Navigation Query</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="query" className="font-medium">
                Query
              </label>
              <Input
                id="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your navigation query"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="source" className="font-medium">
                Source (Optional)
              </label>
              <Input
                id="source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Enter source"
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Navigation Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">ID</h3>
                <p>{result.id}</p>
              </div>

              <div>
                <h3 className="font-medium mb-1">Reasoning</h3>
                <p className="whitespace-pre-wrap">{result.reasoning}</p>
              </div>

              <div>
                <h3 className="font-medium mb-1">Full JSON Response</h3>
                <JsonViewer data={result} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
