"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = theme === "dark"

  const toggle = () => setTheme(isDark ? "light" : "dark")

  return (
    <button
      onClick={toggle}
      className="relative inline-flex items-center cursor-pointer select-none"
      aria-label="Toggle theme"
    >
      <div
        className={`
          relative flex items-center gap-1 px-2 py-1.5 rounded-full
          transition-all duration-500 ease-in-out
          ${isDark
            ? "bg-slate-800 shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]"
            : "bg-amber-50 shadow-[inset_0_2px_8px_rgba(0,0,0,0.1),0_2px_8px_rgba(251,191,36,0.3)]"
          }
          w-20 h-10
        `}
      >
        {/* Sun icon */}
        <div className={`
          flex items-center justify-center w-7 h-7 rounded-full
          transition-all duration-500
          ${isDark ? "opacity-30 scale-75" : "opacity-100 scale-100"}
        `}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={`w-5 h-5 transition-all duration-500 ${isDark ? "text-slate-500" : "text-amber-400"}`}
            fill="currentColor"
          >
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.166 17.834a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 001.061-1.06l-1.59-1.591zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.166 6.166a.75.75 0 001.06 1.06l1.59-1.59a.75.75 0 00-1.06-1.061L6.166 6.166z" />
          </svg>
        </div>

        {/* Sliding circle */}
        <div
          className={`
            absolute top-1.5 w-7 h-7 rounded-full
            transition-all duration-500 ease-in-out
            flex items-center justify-center
            ${isDark
              ? "translate-x-10 bg-slate-600 shadow-[0_0_12px_rgba(148,163,184,0.4)]"
              : "translate-x-0.5 bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6),0_0_24px_rgba(251,191,36,0.3)]"
            }
          `}
        >
          {isDark ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-4 h-4 text-slate-200"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-4 h-4 text-white"
              fill="currentColor"
            >
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.166 17.834a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 001.061-1.06l-1.59-1.591zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.166 6.166a.75.75 0 001.06 1.06l1.59-1.59a.75.75 0 00-1.06-1.061L6.166 6.166z" />
            </svg>
          )}
        </div>

        {/* Moon icon */}
        <div className={`
          flex items-center justify-center w-7 h-7 rounded-full ml-auto
          transition-all duration-500
          ${isDark ? "opacity-100 scale-100" : "opacity-30 scale-75"}
        `}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={`w-5 h-5 transition-all duration-500 ${isDark ? "text-slate-300" : "text-slate-400"}`}
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </button>
  )
}