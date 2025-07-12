"use client"

import { useState, useEffect } from "react"
import { fetchApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import JsonViewer from "@/components/json-viewer"
import ErrorMessage from "@/components/error-message"
import Link from "next/link"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface Intent {
  intent_id: number
  intent: string
  description: string
  parameters: Record<string, string>
  required: string[]
  responses: Record<string, string>
}

export default function DatabasePage() {
  const [intents, setIntents] = useState<Intent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [offset, setOffset] = useState(0)
  const [limit] = useState(10)

  const fetchIntents = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchApi<Intent[]>(`/api/database/intents/?offset=${offset}&limit=${limit}`)
      setIntents(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch intents")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIntents()
  }, [offset])

  const handleNextPage = () => {
    setOffset((prev) => prev + limit)
  }

  const handlePrevPage = () => {
    setOffset((prev) => Math.max(0, prev - limit))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Database</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/database/create">Create Intent</Link>
          </Button>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          {intents.length > 0 ? (
            <div className="grid gap-4">
              {intents.map((intent) => (
                <Card key={intent.intent_id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between">
                      <span>{intent.intent}</span>
                      <div className="flex gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/database/${intent.intent_id}`}>View</Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={async () => {
                            if (confirm("Are you sure you want to delete this intent?")) {
                              try {
                                await fetchApi(`/api/database/intents/${intent.intent_id}`, {
                                  method: "DELETE",
                                })
                                fetchIntents()
                              } catch (err) {
                                setError(err instanceof Error ? err.message : "Failed to delete intent")
                              }
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-2">{intent.description}</p>
                    <JsonViewer data={intent} />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <p className="text-muted-foreground mb-4">No intents found</p>
                <Button asChild>
                  <Link href="/database/create">Create Intent</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={handlePrevPage}
                  className={offset === 0 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink>Page {Math.floor(offset / limit) + 1}</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={handleNextPage}
                  className={intents.length < limit ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  )
}
