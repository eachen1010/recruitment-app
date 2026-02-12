"use client"

import * as React from "react"
import { useAuth } from "@/contexts/auth-context"
import { usePathname, useRouter } from "next/navigation"

export function RoleSurveyCheck() {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  React.useEffect(() => {
    if (loading || !user) return

    // Don't redirect on auth pages or survey page itself
    const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/role-survey"
    if (isAuthPage) return

    // Check if user has completed the role survey
    const surveyCompleted = localStorage.getItem(`roleSurveyCompleted_${user.uid}`)
    
    if (!surveyCompleted) {
      // Redirect to survey page if not completed
      router.push("/role-survey")
    }
  }, [user, loading, pathname, router])

  return null
}
