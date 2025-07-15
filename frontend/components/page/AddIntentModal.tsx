"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { IntentForm } from "./IntentForm"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface AddIntentModalProps {
  onIntentAdded: () => void
}

export function AddIntentModal({ onIntentAdded }: AddIntentModalProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [newIntent, setNewIntent] = useState({
    intent: "",
    description: "",
    parameters: {} as Record<string, string>,
    required: [] as string[],
    responses: {} as Record<string, string>,
    chroma_id: null as string | null,
  })

  const resetForm = () => {
    setNewIntent({
      intent: "",
      description: "",
      parameters: {},
      required: [],
      responses: {},
      chroma_id: null,
    })
  }

  const handleCreateIntent = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/database/intents/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newIntent,
          chroma_id: null,
        }),
      })

      if (response.ok) {
        setShowAddModal(false)
        resetForm()
        onIntentAdded()
      }
    } catch (error) {
      console.error("Failed to create intent:", error)
    }
  }

  return (
    <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Intent
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Intent</DialogTitle>
          <DialogDescription>
            Create a new intent with parameters, required fields, and responses.
          </DialogDescription>
        </DialogHeader>

        <IntentForm intent={newIntent} onIntentChange={setNewIntent} />

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateIntent} disabled={!newIntent.intent || !newIntent.description}>
            Create Intent
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
