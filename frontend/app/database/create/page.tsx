"use client"

import type React from "react"

import { useState } from "react"
import { fetchApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import ErrorMessage from "@/components/error-message"
import Link from "next/link"
import { useRouter } from "next/navigation"
import JsonViewer from "@/components/json-viewer"

interface IntentCreate {
  intent: string
  description: string
  parameters: Record<string, string>
  required: string[]
  responses: Record<string, string>
}

export default function CreateIntentPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<IntentCreate>({
    intent: "",
    description: "",
    parameters: {},
    required: [],
    responses: {},
  })
  const [paramKey, setParamKey] = useState("")
  const [paramValue, setParamValue] = useState("")
  const [responseKey, setResponseKey] = useState("")
  const [responseValue, setResponseValue] = useState("")
  const [requiredParam, setRequiredParam] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError(null)

      await fetchApi("/api/database/intents/", {
        method: "POST",
        body: JSON.stringify(formData),
      })

      router.push("/database")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create intent")
      setLoading(false)
    }
  }

  const addParameter = () => {
    if (!paramKey.trim()) return

    setFormData((prev) => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [paramKey]: paramValue,
      },
    }))

    setParamKey("")
    setParamValue("")
  }

  const addResponse = () => {
    if (!responseKey.trim()) return

    setFormData((prev) => ({
      ...prev,
      responses: {
        ...prev.responses,
        [responseKey]: responseValue,
      },
    }))

    setResponseKey("")
    setResponseValue("")
  }

  const addRequiredParam = () => {
    if (!requiredParam.trim()) return

    setFormData((prev) => ({
      ...prev,
      required: [...prev.required, requiredParam],
    }))

    setRequiredParam("")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Create Intent</h1>
        <Button asChild variant="outline">
          <Link href="/database">Cancel</Link>
        </Button>
      </div>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Intent Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="intent" className="font-medium">
                Intent Name
              </label>
              <Input
                id="intent"
                value={formData.intent}
                onChange={(e) => setFormData((prev) => ({ ...prev, intent: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="font-medium">Parameters</label>
              <div className="flex gap-2">
                <Input placeholder="Parameter name" value={paramKey} onChange={(e) => setParamKey(e.target.value)} />
                <Input placeholder="Description" value={paramValue} onChange={(e) => setParamValue(e.target.value)} />
                <Button type="button" onClick={addParameter}>
                  Add
                </Button>
              </div>
              {Object.keys(formData.parameters).length > 0 && <JsonViewer data={formData.parameters} />}
            </div>

            <div className="space-y-2">
              <label className="font-medium">Required Parameters</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Parameter name"
                  value={requiredParam}
                  onChange={(e) => setRequiredParam(e.target.value)}
                />
                <Button type="button" onClick={addRequiredParam}>
                  Add
                </Button>
              </div>
              {formData.required.length > 0 && <JsonViewer data={formData.required} />}
            </div>

            <div className="space-y-2">
              <label className="font-medium">Responses</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Response key"
                  value={responseKey}
                  onChange={(e) => setResponseKey(e.target.value)}
                />
                <Input
                  placeholder="Response value"
                  value={responseValue}
                  onChange={(e) => setResponseValue(e.target.value)}
                />
                <Button type="button" onClick={addResponse}>
                  Add
                </Button>
              </div>
              {Object.keys(formData.responses).length > 0 && <JsonViewer data={formData.responses} />}
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Creating..." : "Create Intent"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
