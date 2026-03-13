import { create } from "zustand"
import { CalorieResult } from "@/types/index"
import { api } from "@/lib/api"
import { useAuthStore } from "./authStore"

interface MealState {
  currentResult: CalorieResult | null
  history: CalorieResult[]
  isLoading: boolean
  error: string | null
  fetchCalories: (dish_name: string, servings: number) => Promise<void>
  clearResult: () => void
  clearHistory: () => void
  clearError: () => void
}

export const useMealStore = create<MealState>()((set) => ({
  currentResult: null,
  history: [],
  isLoading: false,
  error: null,

  fetchCalories: async (dish_name: string, servings: number) => {
    set({ isLoading: true, error: null })
    try {
      const result = await api.calories.get({ dish_name, servings })
      set((state) => ({
        currentResult: result,
        history: [result, ...state.history].slice(0, 20),
        isLoading: false,
      }))
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      set({ error: message, isLoading: false, currentResult: null })

      // If unauthorized, trigger logout
      if ((err as { status?: number })?.status === 401) {
        useAuthStore.getState().logout()
      }
    }
  },

  clearResult: () => set({ currentResult: null, error: null }),
  clearHistory: () => set({ history: [] }),
  clearError: () => set({ error: null }),
}))