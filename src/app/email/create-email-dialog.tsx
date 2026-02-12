"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createTemplate } from "./actions"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function CreateEmailDialog() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      toast.error("Please enter a title for the email template")
      return
    }

    // Get author name from current user
    const author = user?.displayName || user?.email?.split("@")[0] || "System"

    setIsLoading(true)
    try {
      const result = await createTemplate(title.trim(), "", author)
      if (result.success) {
        setOpen(false)
        setTitle("")
        toast.loading("Loading new template...", { id: "loading-template" })
        // Navigate - toast will be dismissed when the new page loads
        router.push(`/email/${result.id}?edit=true`)
      }
    } catch (error: any) {
      console.error("Error creating template:", error)
      toast.error(error.message || "Failed to create email template")
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create New Email
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Email Template</DialogTitle>
            <DialogDescription>
              Enter a title for your new email template. You can edit the content after creating it.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Template Title</Label>
              <Input
                id="title"
                placeholder="e.g., Welcome Email, Interview Invitation"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false)
                setTitle("")
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Template"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
