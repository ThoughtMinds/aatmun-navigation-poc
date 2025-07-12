"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CopyIcon, CheckIcon } from "lucide-react"

interface JsonViewerProps {
  data: any
}

export default function JsonViewer({ data }: JsonViewerProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative">
      <Button size="sm" variant="ghost" className="absolute right-2 top-2" onClick={copyToClipboard}>
        {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
      </Button>
      <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[500px] text-sm">
        <code className="language-json">{JSON.stringify(data, null, 2)}</code>
      </pre>
    </div>
  )
}
