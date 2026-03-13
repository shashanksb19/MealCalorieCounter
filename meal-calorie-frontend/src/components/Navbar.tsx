"use client"

import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/index"
import { useMealStore } from "@/stores/index"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import ThemeToggle from "@/components/ThemeToggle"

// Inside the flex div on the right side, add before the Sign Out button:

export default function Navbar() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const { clearResult, clearHistory } = useMealStore()

  const handleLogout = () => {
    clearResult()
    clearHistory()
    logout()
    router.push("/login")
  }

  return (
    <nav className="w-full border-b bg-background">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/dashboard")}
        >
          <span className="text-xl font-bold text-primary">🥗 CalorieTracker</span>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <span className="text-sm text-muted-foreground hidden sm:block">
                Hey, <span className="font-medium text-foreground">{user.first_name}</span>
              </span>
              <Separator orientation="vertical" className="h-6 hidden sm:block" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/calories")}
              >
                Calculator
              </Button>
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                
                Sign Out
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
