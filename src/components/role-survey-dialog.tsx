"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface RoleSurveyDialogProps {
  open: boolean
  onRoleSelect: (role: "candidate" | "admin") => void
}

export function RoleSurveyDialog({ open, onRoleSelect }: RoleSurveyDialogProps) {
  const [selectedRole, setSelectedRole] = React.useState<"candidate" | "admin" | null>(null)

  const handleContinue = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole)
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome! Let's get started</DialogTitle>
          <DialogDescription>
            Please tell us a bit about yourself to personalize your experience.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <Label>I am a...</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={selectedRole === "candidate" ? "default" : "outline"}
                className={cn(
                  "w-full",
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
                  "w-full",
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
      </DialogContent>
    </Dialog>
  )
}
