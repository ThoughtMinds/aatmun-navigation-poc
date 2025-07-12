"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="font-bold text-xl">
          API Dashboard
        </Link>
        <nav className="ml-auto flex gap-2">
          <Button asChild variant={pathname.includes("/database") ? "default" : "ghost"}>
            <Link href="/database">Database</Link>
          </Button>
          <Button asChild variant={pathname.includes("/navigation") ? "default" : "ghost"}>
            <Link href="/navigation">Navigation</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
