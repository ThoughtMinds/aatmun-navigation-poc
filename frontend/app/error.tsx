"use client"

import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
      <h1 className="text-4xl font-bold">Something went wrong</h1>
      <p className="text-xl text-muted-foreground">An error occurred while loading this page.</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
