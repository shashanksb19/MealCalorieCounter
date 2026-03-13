"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMealStore } from "@/stores/index"
import { mealSchema, MealFormData } from "@/lib/validators"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function MealForm() {
  const { fetchCalories, isLoading, error, clearError } = useMealStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MealFormData>({
    resolver: zodResolver(mealSchema),
  })

  const onSubmit = async (data: MealFormData) => {
    clearError()
    await fetchCalories(data.dish_name, data.servings)
    reset({ dish_name: data.dish_name, servings: data.servings })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Calculate Calories</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="dish_name">Dish Name</Label>
            <Input
              id="dish_name"
              placeholder="e.g. chicken biryani"
              {...register("dish_name")}
            />
            {errors.dish_name && (
              <p className="text-xs text-destructive">
                {errors.dish_name.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="servings">Number of Servings</Label>
            <Input
              id="servings"
              type="number"
              step="0.5"
              min="0.5"
              placeholder="e.g. 2"
              {...register("servings", { valueAsNumber: true })}
            />
            {errors.servings && (
              <p className="text-xs text-destructive">
                {errors.servings.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Calculating...
              </span>
            ) : (
              "Get Calories"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
