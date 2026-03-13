export interface User {
  id: string
  first_name: string
  last_name: string
  email: string
}

export interface Macros {
  protein_g: number
  carbs_g: number
  fat_g: number
  fiber_g: number
  sugar_g: number
}

export interface CalorieResult {
  dish_name: string
  servings: number
  calories_per_serving: number
  total_calories: number
  macros_per_serving: Macros | null
  total_macros: Macros | null
  source: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface RegisterPayload {
  first_name: string
  last_name: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface MealPayload {
  dish_name: string
  servings: number
}

export class ApiError extends Error {
  code: string
  status: number

  constructor(message: string, code: string, status: number) {
    super(message)
    this.code = code
    this.status = status
    this.name = "ApiError"
  }
}
