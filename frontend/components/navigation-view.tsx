"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { processNavigation, uploadNavigationExcel } from "@/lib/api"
import JsonViewer from "./json-viewer"
import { Loader2 } from "lucide-react"

export default function NavigationView() {
  const [inputText, setInputText] = useState("")
  const [outputJson, setOutputJson] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadResponse, setUploadResponse] = useState<any>(null)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleProcess = async () => {
    setLoading(true)
    setError(null)
    setOutputJson(null)
    try {
      const result = await processNavigation(inputText)
      setOutputJson(result)
    } catch (err) {
      setError(err.message || "An unknown error occurred during navigation processing.")
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async () => {
    if (!uploadFile) {
      setUploadError("Please select a file to upload.")
      return
    }
    setUploadLoading(true)
    setUploadError(null)
    setUploadResponse(null)
    try {
      const result = await uploadNavigationExcel(uploadFile)
      setUploadResponse(result)
    } catch (err) {
      setUploadError(err.message || "An unknown error occurred during file upload.")
    } finally {
      setUploadLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Navigation View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label htmlFor="navigation-input" className="block text-sm font-medium text-gray-700 mb-2">
              Enter text for navigation:
            </label>
            <Textarea
              id="navigation-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g., 'Go to settings' or 'Show me my profile'"
              rows={5}
              className="w-full"
            />
          </div>
          <Button onClick={handleProcess} disabled={loading || !inputText.trim()}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
              </>
            ) : (
              "Process Navigation"
            )}
          </Button>

          {error && <p className="text-red-500 mt-4">Error: {error}</p>}

          {outputJson && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Output JSON:</h3>
              <JsonViewer json={outputJson} />
            </div>
          )}

          <div className="mt-8 pt-4 border-t">
            <h3 className="text-lg font-semibold mb-4">Upload Navigation Excel</h3>
            <div className="mb-4">
              <label htmlFor="excel-file-input" className="block text-sm font-medium text-gray-700 mb-2">
                Select Excel File:
              </label>
              <Input
                id="excel-file-input"
                type="file"
                accept=".xls,.xlsx"
                onChange={(e) => setUploadFile(e.target.files ? e.target.files[0] : null)}
                className="w-full"
              />
            </div>
            <Button onClick={handleUpload} disabled={uploadLoading || !uploadFile}>
              {uploadLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                </>
              ) : (
                "Upload Excel"
              )}
            </Button>

            {uploadError && <p className="text-red-500 mt-4">Upload Error: {uploadError}</p>}

            {uploadResponse && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Upload Response:</h3>
                <JsonViewer json={uploadResponse} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
