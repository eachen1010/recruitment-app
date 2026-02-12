"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function RoleSurveyPage() {
  const { user } = useAuth()
  const [selectedRole, setSelectedRole] = React.useState<"candidate" | "admin" | null>(null)
  const router = useRouter()

  const handleContinue = () => {
    if (!selectedRole || !user?.uid) return

    // Store role in localStorage
    localStorage.setItem(`userRole_${user.uid}`, selectedRole)
    // Mark that survey is completed
    localStorage.setItem(`roleSurveyCompleted_${user.uid}`, "true")
    
    toast.success("Welcome! Your account is now set up.")
    // Automatically redirect to dashboard
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className={cn(
        "w-full max-w-md space-y-6 p-8",
        "bg-background border border-border rounded-lg shadow-lg"
      )}>
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome! Let's get started</h1>
          <p className="text-muted-foreground">
            Please tell us a bit about yourself to personalize your experience.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-3">
            <Label className="text-base">I am a...</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={selectedRole === "candidate" ? "default" : "outline"}
                className={cn(
                  "w-full h-20 text-lg",
                  selectedRole === "candidate" && "bg-primary text-primary-foreground"
                )}
                onClick={() => setSelectedRole("candidate")}
              >
                Candidate
              </Button>
              <Button
                type="button"
                variant={selectedRole === "admin" ? "default" : "outline"}
                className={cn(
                  "w-full h-20 text-lg",
                  selectedRole === "admin" && "bg-primary text-primary-foreground"
                )}
                onClick={() => setSelectedRole("admin")}
              >
                Admin
              </Button>
            </div>
          </div>
          <Button
            type="button"
            className="w-full"
            onClick={handleContinue}
            disabled={!selectedRole}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
