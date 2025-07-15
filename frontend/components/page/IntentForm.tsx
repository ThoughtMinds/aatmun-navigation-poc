"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import React from "react"

interface IntentData {
  intent: string
  description: string
  parameters: Record<string, string>
  required: string[]
  responses: Record<string, string>
  chroma_id?: string | null
}

interface IntentFormProps {
  intent: IntentData
  onIntentChange: (newIntent: IntentData) => void
}

export function IntentForm({ intent, onIntentChange }: IntentFormProps) {
  const [parameterInput, setParameterInput] = React.useState({ key: "", value: "" })
  const [requiredInput, setRequiredInput] = React.useState("")
  const [responseInput, setResponseInput] = React.useState({ key: "", value: "" })

  const addParameter = () => {
    if (parameterInput.key && parameterInput.value) {
      onIntentChange({
        ...intent,
        parameters: { ...intent.parameters, [parameterInput.key]: parameterInput.value },
      })
      setParameterInput({ key: "", value: "" })
    }
  }

  const removeParameter = (key: string) => {
    const { [key]: removed, ...rest } = intent.parameters
    onIntentChange({ ...intent, parameters: rest })
  }

  const addRequired = () => {
    if (requiredInput && !intent.required.includes(requiredInput)) {
      onIntentChange({
        ...intent,
        required: [...intent.required, requiredInput],
      })
      setRequiredInput("")
    }
  }

  const removeRequired = (item: string) => {
    onIntentChange({
      ...intent,
      required: intent.required.filter((r) => r !== item),
    })
  }

  const addResponse = () => {
    if (responseInput.key && responseInput.value) {
      onIntentChange({
        ...intent,
        responses: { ...intent.responses, [responseInput.key]: responseInput.value },
      })
      setResponseInput({ key: "", value: "" })
    }
  }

  const removeResponse = (key: string) => {
    const { [key]: removed, ...rest } = intent.responses
    onIntentChange({ ...intent, responses: rest })
  }

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="intent-name">Intent Name *</Label>
          <Input
            id="intent-name"
            value={intent.intent}
            onChange={(e) => onIntentChange({ ...intent, intent: e.target.value })}
            placeholder="e.g., navigate_to_dashboard"
          />
        </div>

        <div>
          <Label htmlFor="intent-description">Description *</Label>
          <Textarea
            id="intent-description"
            value={intent.description}
            onChange={(e) => onIntentChange({ ...intent, description: e.target.value })}
            placeholder="Describe what this intent does..."
          />
        </div>

        
      </div>

      {/* Parameters */}
      <div className="space-y-3">
        <Label>Parameters</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Parameter name"
            value={parameterInput.key}
            onChange={(e) => setParameterInput((prev) => ({ ...prev, key: e.target.value }))}
          />
          <Input
            placeholder="Parameter value"
            value={parameterInput.value}
            onChange={(e) => setParameterInput((prev) => ({ ...prev, value: e.target.value }))}
          />
          <Button type="button" onClick={addParameter} size="sm">
            Add
          </Button>
        </div>
        {Object.entries(intent.parameters).length > 0 && (
          <div className="space-y-1">
            {Object.entries(intent.parameters).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between bg-muted p-2 rounded">
                <span className="text-sm">
                  {key}: {value}
                </span>
                <Button variant="ghost" size="sm" onClick={() => removeParameter(key)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Required Fields */}
      <div className="space-y-3">
        <Label>Required Fields</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Required field name"
            value={requiredInput}
            onChange={(e) => setRequiredInput(e.target.value)}
          />
          <Button type="button" onClick={addRequired} size="sm">
            Add
          </Button>
        </div>
        {intent.required.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {intent.required.map((item) => (
              <Badge key={item} variant="secondary" className="flex items-center gap-1">
                {item}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1"
                  onClick={() => removeRequired(item)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Responses */}
      <div className="space-y-3">
        <Label>Responses</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Response key"
            value={responseInput.key}
            onChange={(e) => setResponseInput((prev) => ({ ...prev, key: e.target.value }))}
          />
          <Input
            placeholder="Response value"
            value={responseInput.value}
            onChange={(e) => setResponseInput((prev) => ({ ...prev, value: e.target.value }))}
          />
          <Button type="button" onClick={addResponse} size="sm">
            Add
          </Button>
        </div>
        {Object.entries(intent.responses).length > 0 && (
          <div className="space-y-1">
            {Object.entries(intent.responses).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between bg-muted p-2 rounded">
                <span className="text-sm">
                  {key}: {value}
                </span>
                <Button variant="ghost" size="sm" onClick={() => removeResponse(key)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
