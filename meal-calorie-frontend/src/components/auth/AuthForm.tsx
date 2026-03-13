"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { registerSchema, loginSchema, RegisterFormData, LoginFormData } from "@/lib/validators"
import { api } from "@/lib/api"
import { useAuthStore } from "@/stores/index"
import { ApiError } from "@/types/index"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AuthFormProps {
  mode: "login" | "register"
}

type FormData = RegisterFormData | LoginFormData

function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const { login } = useAuthStore()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const schema = mode === "register" ? registerSchema : loginSchema

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setError(null)
    try {
      const response =
        mode === "register"
          ? await api.auth.register(data as RegisterFormData)
          : await api.auth.login(data as LoginFormData)
      login(response.token, response.user)
      router.push("/dashboard")
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Something went wrong. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #fda085 100%)"
      }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full opacity-30"
        style={{ background: "radial-gradient(circle, #a78bfa, transparent)" }} />
      <div className="absolute bottom-[-80px] right-[-80px] w-96 h-96 rounded-full opacity-30"
        style={{ background: "radial-gradient(circle, #fb7185, transparent)" }} />
      <div className="absolute top-1/2 left-[-60px] w-48 h-48 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #34d399, transparent)" }} />

      {/* Card */}
      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/50">

        {/* Logo + Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg"
            style={{ background: "linear-gradient(135deg, #667eea, #f5576c)" }}
          >
            <span className="text-3xl">🥗</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === "register" ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {mode === "register"
              ? "Start tracking your nutrition today"
              : "Sign in to your CalorieTracker"}
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {mode === "register" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="first_name" className="text-gray-700 text-sm font-medium">First Name</Label>
                <Input
                  id="first_name"
                  placeholder="John"
                  className="bg-white border-gray-200 focus:border-purple-400 rounded-xl"
                  {...register("first_name" as keyof FormData)}
                />
                {"first_name" in errors && errors.first_name && (
                  <p className="text-xs text-red-500">{errors.first_name.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="last_name" className="text-gray-700 text-sm font-medium">Last Name</Label>
                <Input
                  id="last_name"
                  placeholder="Doe"
                  className="bg-white border-gray-200 focus:border-purple-400 rounded-xl"
                  {...register("last_name" as keyof FormData)}
                />
                {"last_name" in errors && errors.last_name && (
                  <p className="text-xs text-red-500">{errors.last_name.message}</p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="email" className="text-gray-700 text-sm font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              className="bg-white border-gray-200 focus:border-purple-400 rounded-xl"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="password" className="text-gray-700 text-sm font-medium">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="bg-white border-gray-200 focus:border-purple-400 rounded-xl"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            style={{ background: "linear-gradient(135deg, #667eea, #f5576c)" }}
          >
            {isLoading
              ? "Please wait..."
              : mode === "register"
              ? "Create Account"
              : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {mode === "register" ? (
            <>
              Already have an account?{" "}
              <a href="/login" className="font-semibold text-purple-600 hover:underline">
                Sign in
              </a>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <a href="/register" className="font-semibold text-purple-600 hover:underline">
                Create one
              </a>
            </>
          )}
        </p>
      </div>
    </div>
  )
}

export default AuthForm