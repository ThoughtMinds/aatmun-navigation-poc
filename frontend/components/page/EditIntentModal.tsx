"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { IntentForm } from "./IntentForm"

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

interface EditIntentModalProps {
  intent: Intent | null
  isOpen: boolean
  onClose: () => void
  onIntentUpdated: () => void
}

export function EditIntentModal({ intent, isOpen, onClose, onIntentUpdated }: EditIntentModalProps) {
  const [editIntent, setEditIntent] = useState({
    intent: "",
    description: "",
    parameters: {} as Record<string, string>,
    required: [] as string[],
    responses: {} as Record<string, string>,
    chroma_id: null as string | null,
  })

  useEffect(() => {
    if (intent) {
      setEditIntent({
        intent: intent.intent,
        description: intent.description,
        parameters: { ...intent.parameters },
        required: [...intent.required],
        responses: { ...intent.responses },
        chroma_id: intent.chroma_id || null,
      })
    }
  }, [intent])

  const handleUpdateIntent = async () => {
    if (!intent) return

    try {
      const response = await fetch(`${API_BASE_URL}/api/database/intents/${intent.intent_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editIntent),
      })

      if (response.ok) {
        onIntentUpdated()
        onClose()
      }
    } catch (error) {
      console.error("Failed to update intent:", error)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
    >
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Intent</DialogTitle>
          <DialogDescription>
            Update the intent with new parameters, required fields, and responses.
          </DialogDescription>
        </DialogHeader>

        <IntentForm intent={editIntent} onIntentChange={setEditIntent} />

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpdateIntent} disabled={!editIntent.intent || !editIntent.description}>
            Update Intent
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
