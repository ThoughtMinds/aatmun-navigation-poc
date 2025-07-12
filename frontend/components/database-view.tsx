"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // <-- Select component for items per page
import { fetchIntents, deleteIntent, fetchIntentCount } from "@/lib/api"
import JsonViewer from "./json-viewer"
import { Loader2 } from "lucide-react"

interface Intent {
  intent_id: number
  intent: string
  description: string
  parameters: Record<string, string>
  required: string[]
  responses: Record<string, string>
}

export default function DatabaseView() {
  const [intents, setIntents] = useState<Intent[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10) // Default items per page
  const [totalIntents, setTotalIntents] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteResponse, setDeleteResponse] = useState<any>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const totalPages = Math.ceil(totalIntents / itemsPerPage)

  const loadIntents = useCallback(async () => {
    setLoading(true)
    setError(null)
    setDeleteResponse(null) // Clear delete response on new load
    setDeleteError(null) // Clear delete error on new load
    try {
      const count = await fetchIntentCount()
      setTotalIntents(count)

      const offset = (currentPage - 1) * itemsPerPage
      const data = await fetchIntents(offset, itemsPerPage)
      setIntents(data)
    } catch (err) {
      setError(err.message || "An unknown error occurred while fetching intents.")
    } finally {
      setLoading(false)
    }
  }, [currentPage, itemsPerPage])

  useEffect(() => {
    loadIntents()
  }, [loadIntents])

  const handleDelete = async (id: number) => {
    setDeleteResponse(null)
    setDeleteError(null)
    try {
      const response = await deleteIntent(id)
      setDeleteResponse(response)
      // After successful deletion, reload intents to reflect the change
      // and potentially adjust pagination if the last item on a page was deleted.
      loadIntents()
    } catch (err) {
      setDeleteError(err.message || "An unknown error occurred during deletion.")
    }
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1) // Reset to first page when items per page changes
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Database View: Intents ({totalIntents} total)</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading intents...
            </div>
          )}
          {error && <p className="text-red-500 mb-4">Error: {error}</p>}

          {!loading && intents.length === 0 && !error && (
            <p className="text-muted-foreground">No intents found. Make sure your backend is running and has data.</p>
          )}

          {!loading && intents.length > 0 && (
            <div className="space-y-4">
              {intents.map((intent) => (
                <Card key={intent.intent_id} className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{intent.intent}</h3>
                    <p className="text-sm text-muted-foreground">{intent.description}</p>
                    <p className="text-xs text-muted-foreground">ID: {intent.intent_id}</p>
                  </div>
                  <Button variant="destructive" onClick={() => handleDelete(intent.intent_id)}>
                    Delete
                  </Button>
                </Card>
              ))}

              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Items per page:</span>
                  <Select value={String(itemsPerPage)} onValueChange={handleItemsPerPageChange}>
                    <SelectTrigger className="w-[80px]">
                      <SelectValue placeholder="10" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1 || loading}
                    variant="outline"
                    size="sm"
                  >
                    First {/* <-- First button */}
                  </Button>
                  <Button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1 || loading}
                    variant="outline"
                    size="sm"
                  >
                    Previous
                  </Button>
                  <span className="text-sm font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages || loading}
                    variant="outline"
                    size="sm"
                  >
                    Next
                  </Button>
                  <Button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages || loading}
                    variant="outline"
                    size="sm"
                  >
                    Last {/* <-- Last button */}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {deleteResponse && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Delete Response:</h3>
              <JsonViewer json={deleteResponse} />
            </div>
          )}
          {deleteError && <p className="text-red-500 mt-4">Delete Error: {deleteError}</p>}
        </CardContent>
      </Card>
    </div>
  )
}
