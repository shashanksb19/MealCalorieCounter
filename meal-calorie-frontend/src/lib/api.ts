import { getApiToken, clearApiToken } from "./auth"
import {
  ApiError,
  AuthResponse,
  CalorieResult,
  RegisterPayload,
  LoginPayload,
  MealPayload,
} from "@/types/index"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined")
}

async function baseClient<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getApiToken()

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  }

  let response: Response

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    })
  } catch {
    throw new ApiError(
      "Network error. Please check your connection.",
      "NETWORK_ERROR",
      0
    )
  }

  if (!response.ok) {
    let errorData: { code?: string; message?: string } = {}
    try {
      const body = await response.json()
      errorData = body.detail || body
    } catch {
      errorData = { message: "An unexpected error occurred." }
    }

    // Handle expired token globally
    if (response.status === 401) {
      clearApiToken()
      if (typeof window !== "undefined") {
        window.location.replace("/login")
      }
    }

    throw new ApiError(
      errorData.message || "An unexpected error occurred.",
      errorData.code || "UNKNOWN_ERROR",
      response.status
    )
  }

  return response.json() as Promise<T>
}

export const api = {
  auth: {
    register(payload: RegisterPayload): Promise<AuthResponse> {
      return baseClient<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      })
    },

    login(payload: LoginPayload): Promise<AuthResponse> {
      return baseClient<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      })
    },
  },

  calories: {
    get(payload: MealPayload): Promise<CalorieResult> {
      return baseClient<CalorieResult>("/get-calories", {
        method: "POST",
        body: JSON.stringify(payload),
      })
    },
  },
}
