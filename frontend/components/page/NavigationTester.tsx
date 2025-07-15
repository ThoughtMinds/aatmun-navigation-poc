"use client"

import type React from "react"
import { useState } from "react"
import { Upload, Search, Loader2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface NavigationTestResult {
  query: string
  actual_intent: string
  predicted_intent: string
  response_time: number
}

interface NavigationResult {
  id: string
  reasoning: string
  intent_name: string
}

export function NavigationTester() {
  const [navigationQuery, setNavigationQuery] = useState("")
  const [navigationResult, setNavigationResult] = useState<NavigationResult | null>(null)
  const [testResults, setTestResults] = useState<NavigationTestResult[]>([])
  const [loading, setLoading] = useState(false)

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

      const response = await fetch(`${API_BASE_URL}/api/navigation/test_navigation/`, {
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

  return (
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
                    <strong>Intent Name:</strong> {navigationResult.intent_name}
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
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 border-b">
                      <tr>
                        <th className="text-left p-3 font-medium">User Query</th>
                        <th className="text-left p-3 font-medium">Actual Intent</th>
                        <th className="text-left p-3 font-medium">Predicted Intent</th>
                        <th className="text-left p-3 font-medium">Response Time (s)</th>
                        <th className="text-center p-3 font-medium">Match</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testResults.map((result, index) => (
                        <tr key={index} className="border-b hover:bg-muted/25">
                          <td className="p-3 font-medium">{result.query}</td>
                          <td className="p-3 text-muted-foreground">{result.actual_intent}</td>
                          <td className="p-3 text-muted-foreground">{result.predicted_intent}</td>
                          <td className="p-3 text-muted-foreground">{result.response_time}</td>
                          <td className="p-3 text-center">
                            {result.actual_intent === result.predicted_intent ? (
                              <Check className="h-4 w-4 text-green-500 mx-auto" />
                            ) : (
                              <X className="h-4 w-4 text-red-500 mx-auto" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
