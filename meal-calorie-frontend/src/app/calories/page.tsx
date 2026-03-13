"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore, useMealStore } from "@/stores/index"
import Navbar from "@/components/Navbar"
import MealForm from "@/components/meal/MealForm"
import ResultCard from "@/components/meal/ResultCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function CaloriesPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { history, clearHistory } = useMealStore()

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

        {/* Meal History */}
        {history.length > 1 && (
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Search History</CardTitle>
              <button
                onClick={clearHistory}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                Clear
              </button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium text-muted-foreground">Dish</th>
                      <th className="text-center py-2 font-medium text-muted-foreground">Servings</th>
                      <th className="text-center py-2 font-medium text-muted-foreground">Per Serving</th>
                      <th className="text-center py-2 font-medium text-muted-foreground">Total</th>
                      <th className="text-center py-2 font-medium text-muted-foreground">Protein</th>
                      <th className="text-center py-2 font-medium text-muted-foreground">Carbs</th>
                      <th className="text-center py-2 font-medium text-muted-foreground">Fat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.slice(1).map((item, index) => (
                      <tr key={index} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="py-2 capitalize font-medium">{item.dish_name}</td>
                        <td className="py-2 text-center">{item.servings}</td>
                        <td className="py-2 text-center">{item.calories_per_serving} kcal</td>
                        <td className="py-2 text-center">
                          <Badge variant="secondary">{item.total_calories} kcal</Badge>
                        </td>
                        <td className="py-2 text-center text-blue-600 dark:text-blue-400">
                          {item.macros_per_serving?.protein_g ?? "-"}g
                        </td>
                        <td className="py-2 text-center text-yellow-600 dark:text-yellow-400">
                          {item.macros_per_serving?.carbs_g ?? "-"}g
                        </td>
                        <td className="py-2 text-center text-red-600 dark:text-red-400">
                          {item.macros_per_serving?.fat_g ?? "-"}g
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}