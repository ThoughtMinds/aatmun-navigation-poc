"use client"

import { useState, useEffect } from "react"
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { IntentListItem } from "./IntentListItem"
import { AddIntentModal } from "./AddIntentModal"
import { EditIntentModal } from "./EditIntentModal"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface Intent {
  intent_id: number
  intent: string
  description: string
  parameters: Record<string, string>
  required: string[]
  responses: Record<string, string>
  chroma_id: string | null
}

export function IntentList() {
  const [intents, setIntents] = useState<Intent[]>([])
  const [totalIntents, setTotalIntents] = useState(0)
  const [loadingIntents, setLoadingIntents] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [editingIntent, setEditingIntent] = useState<Intent | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  const totalPages = Math.ceil(totalIntents / itemsPerPage)
  const offset = (currentPage - 1) * itemsPerPage

  useEffect(() => {
    fetchIntentCount()
    fetchIntents()
  }, [currentPage, itemsPerPage])

  const fetchIntentCount = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/database/get_intent_count`)
      if (response.ok) {
        const data = await response.json()
        setTotalIntents(data.count || Object.values(data)[0] || 0)
      }
    } catch (error) {
      console.error("Failed to fetch intent count:", error)
    }
  }

  const fetchIntents = async () => {
    setLoadingIntents(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/database/intents/?offset=${offset}&limit=${itemsPerPage}`)
      if (response.ok) {
        const data = await response.json()
        setIntents(data)
      }
    } catch (error) {
      console.error("Failed to fetch intents:", error)
    } finally {
      setLoadingIntents(false)
    }
  }

  const handleDeleteIntent = async (intentId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/database/intents/${intentId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchIntentCount()
        if (intents.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1)
        } else {
          fetchIntents()
        }
      }
    } catch (error) {
      console.error("Failed to delete intent:", error)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  const handleIntentAdded = () => {
    fetchIntentCount()
    fetchIntents()
  }

  const handleIntentUpdated = () => {
    fetchIntents()
  }

  const openEditModal = (intent: Intent) => {
    setEditingIntent(intent)
    setShowEditModal(true)
  }

  const closeEditModal = () => {
    setEditingIntent(null)
    setShowEditModal(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            Database - Intents
            <Badge variant="outline" className="ml-2">
              {totalIntents} total
            </Badge>
          </span>
          <AddIntentModal onIntentAdded={handleIntentAdded} />
        </CardTitle>
        <CardDescription>Manage intents with their parameters and responses</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Pagination Controls - Top */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="items-per-page" className="text-sm">
              Items per page:
            </Label>
            <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1 || loadingIntents}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loadingIntents}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loadingIntents}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages || loadingIntents}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Intents List */}
        <div className="space-y-4">
          {loadingIntents ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading intents...
            </div>
          ) : intents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No intents found. Add your first intent to get started.
            </div>
          ) : (
            intents.map((intent) => (
              <IntentListItem
                key={intent.intent_id}
                intent={intent}
                onEdit={openEditModal}
                onDelete={handleDeleteIntent}
              />
            ))
          )}
        </div>

        {/* Pagination Controls - Bottom */}
        {totalIntents > 0 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {offset + 1} to {Math.min(offset + itemsPerPage, totalIntents)} of {totalIntents} intents
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1 || loadingIntents}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loadingIntents}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground px-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loadingIntents}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || loadingIntents}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <EditIntentModal
        intent={editingIntent}
        isOpen={showEditModal}
        onClose={closeEditModal}
        onIntentUpdated={handleIntentUpdated}
      />
    </Card>
  )
}
