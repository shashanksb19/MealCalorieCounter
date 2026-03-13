"use client"

import { useMealStore } from "@/stores/index"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function ResultCard() {
  const { currentResult } = useMealStore()

  if (!currentResult) return null

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="capitalize">{currentResult.dish_name}</CardTitle>
        <Badge variant="secondary">{currentResult.source}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* Calories Summary */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-muted rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Servings</p>
            <p className="text-2xl font-bold">{currentResult.servings}</p>
          </div>
          <div className="bg-muted rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Per Serving</p>
            <p className="text-2xl font-bold">
              {currentResult.calories_per_serving}
            </p>
            <p className="text-xs text-muted-foreground">kcal</p>
          </div>
          <div className="bg-primary/10 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Total Calories</p>
            <p className="text-2xl font-bold text-primary">
              {currentResult.total_calories}
            </p>
            <p className="text-xs text-muted-foreground">kcal</p>
          </div>
        </div>

        {/* Macros */}
        {currentResult.macros_per_serving && (
          <>
            <Separator />
            <div>
              <p className="text-sm font-semibold mb-3">
                Macros per Serving
              </p>
              <div className="grid grid-cols-5 gap-2 text-center">
                <div className="bg-blue-500/10 rounded-lg p-2">
                  <p className="text-xs text-muted-foreground">Protein</p>
                  <p className="text-sm font-bold">
                    {currentResult.macros_per_serving.protein_g}g
                  </p>
                </div>
                <div className="bg-yellow-500/10 rounded-lg p-2">
                  <p className="text-xs text-muted-foreground">Carbs</p>
                  <p className="text-sm font-bold">
                    {currentResult.macros_per_serving.carbs_g}g
                  </p>
                </div>
                <div className="bg-red-500/10 rounded-lg p-2">
                  <p className="text-xs text-muted-foreground">Fat</p>
                  <p className="text-sm font-bold">
                    {currentResult.macros_per_serving.fat_g}g
                  </p>
                </div>
                <div className="bg-green-500/10 rounded-lg p-2">
                  <p className="text-xs text-muted-foreground">Fiber</p>
                  <p className="text-sm font-bold">
                    {currentResult.macros_per_serving.fiber_g}g
                  </p>
                </div>
                <div className="bg-purple-500/10 rounded-lg p-2">
                  <p className="text-xs text-muted-foreground">Sugar</p>
                  <p className="text-sm font-bold">
                    {currentResult.macros_per_serving.sugar_g}g
                  </p>
                </div>
              </div>
            </div>

            {currentResult.total_macros && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-semibold mb-3">
                    Total Macros ({currentResult.servings} servings)
                  </p>
                  <div className="grid grid-cols-5 gap-2 text-center">
                    <div className="bg-blue-500/10 rounded-lg p-2">
                      <p className="text-xs text-muted-foreground">Protein</p>
                      <p className="text-sm font-bold">
                        {currentResult.total_macros.protein_g}g
                      </p>
                    </div>
                    <div className="bg-yellow-500/10 rounded-lg p-2">
                      <p className="text-xs text-muted-foreground">Carbs</p>
                      <p className="text-sm font-bold">
                        {currentResult.total_macros.carbs_g}g
                      </p>
                    </div>
                    <div className="bg-red-500/10 rounded-lg p-2">
                      <p className="text-xs text-muted-foreground">Fat</p>
                      <p className="text-sm font-bold">
                        {currentResult.total_macros.fat_g}g
                      </p>
                    </div>
                    <div className="bg-green-500/10 rounded-lg p-2">
                      <p className="text-xs text-muted-foreground">Fiber</p>
                      <p className="text-sm font-bold">
                        {currentResult.total_macros.fiber_g}g
                      </p>
                    </div>
                    <div className="bg-purple-500/10 rounded-lg p-2">
                      <p className="text-xs text-muted-foreground">Sugar</p>
                      <p className="text-sm font-bold">
                        {currentResult.total_macros.sugar_g}g
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
