"use client"

import { useEffect } from "react"
import { toast } from "sonner"

export function DismissLoadingToast() {
  useEffect(() => {
    // Dismiss any loading toasts when the page loads
    toast.dismiss("loading-template")
  }, [])

  return null
}
