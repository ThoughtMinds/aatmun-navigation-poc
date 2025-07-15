"use client"

import { Header } from "@/components/page/Header"
import { IntentList } from "@/components/page/IntentList"
import { NavigationTester } from "@/components/page/NavigationTester"

export default function IntentManagementApp() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 space-y-8">
        <NavigationTester />
        <IntentList />
      </div>
    </div>
  )
}