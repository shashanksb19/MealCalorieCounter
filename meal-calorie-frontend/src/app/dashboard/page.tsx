"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/index"
import Navbar from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {user?.first_name}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your meal nutrition using USDA data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => router.push("/calories")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🔍 Calculate Calories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Search any dish and get instant calorie and macro breakdown
                  powered by USDA FoodData Central.
                </p>
                <Button className="mt-4 w-full">Get Started</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📊 How It Works
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>1. Enter a dish name like "chicken biryani"</p>
                <p>2. Specify the number of servings</p>
                <p>3. Get calories, protein, carbs, fat and more</p>
                <p>4. Data sourced from USDA FoodData Central</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}