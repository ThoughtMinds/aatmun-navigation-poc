import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
      <h1 className="text-4xl font-bold">API Integration Dashboard</h1>
      <p className="text-xl text-muted-foreground max-w-md text-center">
        A simple interface to interact with the Database and Navigation API endpoints
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/database">Database</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/navigation">Navigation</Link>
        </Button>
      </div>
    </div>
  )
}
