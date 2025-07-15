"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"

interface Intent {
  intent_id: number
  intent: string
  description: string
  parameters: Record<string, string>
  required: string[]
  responses: Record<string, string>
}

interface IntentListItemProps {
  intent: Intent
  onEdit: (intent: Intent) => void
  onDelete: (intentId: number) => void
}

export function IntentListItem({ intent, onEdit, onDelete }: IntentListItemProps) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{intent.intent}</h4>
              <Badge variant="secondary">ID: {intent.intent_id}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{intent.description}</p>

            {intent.required.length > 0 && (
              <div className="flex flex-wrap gap-1">
                <span className="text-xs font-medium">Required:</span>
                {intent.required.map((param) => (
                  <Badge key={param} variant="outline" className="text-xs">
                    {param}
                  </Badge>
                ))}
              </div>
            )}

            {Object.keys(intent.parameters).length > 0 && (
              <div className="text-xs text-muted-foreground">
                Parameters: {Object.keys(intent.parameters).join(", ")}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(intent)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onDelete(intent.intent_id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
