"use client"

import dynamic from "next/dynamic"

const AuthForm = dynamic(() => import("@/components/auth/AuthForm").then(mod => mod.default), {
  ssr: false,
})

export default function RegisterPage() {
  return <AuthForm mode="register" />
}