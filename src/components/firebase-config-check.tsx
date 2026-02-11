"use client"

import * as React from "react"
import { auth } from "@/lib/firebase/client"

export function FirebaseConfigCheck() {
  const [hasError, setHasError] = React.useState(false)

  React.useEffect(() => {
    if (typeof window !== "undefined" && !auth) {
      setHasError(true)
    }
  }, [])

  if (!hasError) return null

  return (
    <div className="fixed bottom-4 right-4 max-w-md p-4 bg-destructive text-destructive-foreground rounded-lg shadow-lg z-50">
      <h3 className="font-semibold mb-2">Firebase Configuration Error</h3>
      <p className="text-sm mb-2">
        Firebase is not properly configured. Please check your environment variables.
      </p>
      <p className="text-xs opacity-90">
        Make sure you have a <code className="bg-black/20 px-1 rounded">.env.local</code> file with all required Firebase configuration variables.
      </p>
    </div>
  )
}
