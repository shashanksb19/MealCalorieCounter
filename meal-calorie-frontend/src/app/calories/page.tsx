"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/index"
import Navbar from "@/components/Navbar"
import MealForm from "@/components/meal/MealForm"
import ResultCard from "@/components/meal/ResultCard"

export default function CaloriesPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Calorie Calculator</h1>
          <p className="text-muted-foreground mt-1">
            Enter a dish name and servings to get nutrition data.
          </p>
        </div>
        <MealForm />
        <ResultCard />
      </main>
    </div>
  )
}