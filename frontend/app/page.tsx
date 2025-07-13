"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Moon, Sun, Plus, Edit, Trash2, Upload, Search, Check, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTheme } from "next-themes"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Intent {
  intent_id: number
  intent: string
  description: string
  parameters: Record<string, string>
  required: string[]
  responses: Record<string, string>
}

interface NavigationTestResult {
  query: string
  actual_intent: string
  predicted_intent: string
}

interface NavigationResult {
  id: string | number
  reasoning: string
}

export default function IntentManagementApp() {
  const { theme, setTheme } = useTheme()
  const [intents, setIntents] = useState<Intent[]>([])
  const [navigationQuery, setNavigationQuery] = useState("")
  const [navigationResult, setNavigationResult] = useState<NavigationResult | null>(null)
  const [testResults, setTestResults] = useState<NavigationTestResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newIntent, setNewIntent] = useState({
    intent: "",
    description: "",
    parameters: {} as Record<string, string>,
    required: [] as string[],
    responses: {} as Record<string, string>,
    chroma_id: null as string | null,
  })
  const [parameterInput, setParameterInput] = useState({ key: "", value: "" })
  const [requiredInput, setRequiredInput] = useState("")
  const [responseInput, setResponseInput] = useState({ key: "", value: "" })

  // Load intents on component mount
  useEffect(() => {
    fetchIntents()
  }, [])

  const fetchIntents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/database/intents/`)
      if (response.ok) {
        const data = await response.json()
        setIntents(data)
      }
    } catch (error) {
      console.error("Failed to fetch intents:", error)
    }
  }

  const handleGetNavigation = async () => {
    if (!navigationQuery.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/navigation/get_navigation/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: navigationQuery,
          source: null,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setNavigationResult(result)
      }
    } catch (error) {
      console.error("Failed to get navigation:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTestNavigation = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`${API_BASE_URL}/api/navigation/test_naivgation/`, {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const results = await response.json()
        setTestResults(results)
      }
    } catch (error) {
      console.error("Failed to test navigation:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteIntent = async (intentId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/database/intents/${intentId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setIntents(intents.filter((intent) => intent.intent_id !== intentId))
      }
    } catch (error) {
      console.error("Failed to delete intent:", error)
    }
  }

  const resetForm = () => {
    setNewIntent({
      intent: "",
      description: "",
      parameters: {},
      required: [],
      responses: {},
      chroma_id: null,
    })
    setParameterInput({ key: "", value: "" })
    setRequiredInput("")
    setResponseInput({ key: "", value: "" })
  }

  const addParameter = () => {
    if (parameterInput.key && parameterInput.value) {
      setNewIntent((prev) => ({
        ...prev,
        parameters: { ...prev.parameters, [parameterInput.key]: parameterInput.value },
      }))
      setParameterInput({ key: "", value: "" })
    }
  }

  const removeParameter = (key: string) => {
    setNewIntent((prev) => {
      const { [key]: removed, ...rest } = prev.parameters
      return { ...prev, parameters: rest }
    })
  }

  const addRequired = () => {
    if (requiredInput && !newIntent.required.includes(requiredInput)) {
      setNewIntent((prev) => ({
        ...prev,
        required: [...prev.required, requiredInput],
      }))
      setRequiredInput("")
    }
  }

  const removeRequired = (item: string) => {
    setNewIntent((prev) => ({
      ...prev,
      required: prev.required.filter((r) => r !== item),
    }))
  }

  const addResponse = () => {
    if (responseInput.key && responseInput.value) {
      setNewIntent((prev) => ({
        ...prev,
        responses: { ...prev.responses, [responseInput.key]: responseInput.value },
      }))
      setResponseInput({ key: "", value: "" })
    }
  }

  const removeResponse = (key: string) => {
    setNewIntent((prev) => {
      const { [key]: removed, ...rest } = prev.responses
      return { ...prev, responses: rest }
    })
  }

  const handleCreateIntent = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/database/intents/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newIntent),
      })

      if (response.ok) {
        const createdIntent = await response.json()
        setIntents((prev) => [...prev, createdIntent])
        setShowAddModal(false)
        resetForm()
      }
    } catch (error) {
      console.error("Failed to create intent:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Intent Management</h1>
          <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Navigation Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Navigation
            </CardTitle>
            <CardDescription>Test navigation queries and upload Excel files for batch testing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Get Navigation */}
            <div className="space-y-4">
              <Label htmlFor="navigation-query">Navigation Query</Label>
              <div className="flex gap-2">
                <Input
                  id="navigation-query"
                  placeholder="Enter your navigation query..."
                  value={navigationQuery}
                  onChange={(e) => setNavigationQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGetNavigation()}
                />
                <Button onClick={handleGetNavigation} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Get Navigation"
                  )}
                </Button>
              </div>

              {navigationResult && (
                <Card>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div>
                        <strong>ID:</strong> {navigationResult.id}
                      </div>
                      <div>
                        <strong>Reasoning:</strong> {navigationResult.reasoning}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <Separator />

            {/* Test Navigation */}
            <div className="space-y-4">
              <Label htmlFor="excel-upload">Test Navigation (Excel Upload)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="excel-upload"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleTestNavigation}
                  disabled={loading}
                />
                <Upload className="h-4 w-4 text-muted-foreground" />
              </div>

              {testResults.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Test Results</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {testResults.map((result, index) => (
                      <Card key={index} className="p-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-1">
                            <div className="text-sm font-medium">{result.query}</div>
                            <div className="text-xs text-muted-foreground">
                              <div>Actual: {result.actual_intent}</div>
                              <div>Predicted: {result.predicted_intent}</div>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            {result.actual_intent === result.predicted_intent ? (
                              <Check className="h-5 w-5 text-green-500" />
                            ) : (
                              <X className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Database Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">Database - Intents</span>
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

                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="intent-name">Intent Name *</Label>
                        <Input
                          id="intent-name"
                          value={newIntent.intent}
                          onChange={(e) => setNewIntent((prev) => ({ ...prev, intent: e.target.value }))}
                          placeholder="e.g., navigate_to_dashboard"
                        />
                      </div>

                      <div>
                        <Label htmlFor="intent-description">Description *</Label>
                        <Textarea
                          id="intent-description"
                          value={newIntent.description}
                          onChange={(e) => setNewIntent((prev) => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe what this intent does..."
                        />
                      </div>

                      <div>
                        <Label htmlFor="chroma-id">Chroma ID (Optional)</Label>
                        <Input
                          id="chroma-id"
                          value={newIntent.chroma_id || ""}
                          onChange={(e) => setNewIntent((prev) => ({ ...prev, chroma_id: e.target.value || null }))}
                          placeholder="Optional chroma identifier"
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
                      {Object.entries(newIntent.parameters).length > 0 && (
                        <div className="space-y-1">
                          {Object.entries(newIntent.parameters).map(([key, value]) => (
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
                      {newIntent.required.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {newIntent.required.map((item) => (
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
                      {Object.entries(newIntent.responses).length > 0 && (
                        <div className="space-y-1">
                          {Object.entries(newIntent.responses).map(([key, value]) => (
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
            </CardTitle>
            <CardDescription>Manage intents with their parameters and responses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {intents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No intents found. Add your first intent to get started.
                </div>
              ) : (
                intents.map((intent) => (
                  <Card key={intent.intent_id}>
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
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteIntent(intent.intent_id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
