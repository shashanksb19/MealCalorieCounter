import { create } from "zustand"
import { persist } from "zustand/middleware"
import { User } from "@/types/index"
import { setApiToken, clearApiToken } from "@/lib/auth"

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  login: (token: string, user: User) => void
  logout: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: (token: string, user: User) => {
        setApiToken(token)
        set({ token, user, isAuthenticated: true })
      },

      logout: () => {
        clearApiToken()
        set({ token: null, user: null, isAuthenticated: false })
      },

      setUser: (user: User) => {
        set({ user })
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          setApiToken(state.token)
          state.isAuthenticated = true
        }
      },
    }
  )
)