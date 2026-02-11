"use client"

import * as React from "react"
import { Settings, LogOut, Building2, ChevronUp } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

export function AccountCenter() {
  const [open, setOpen] = React.useState(false)
  const { state, isMobile } = useSidebar()
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const isCollapsed = state === "collapsed" && !isMobile

  // Get user display info
  const displayName = user?.displayName || user?.email?.split("@")[0] || "User"
  const email = user?.email || ""
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U"

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success("Signed out successfully")
      router.push("/login")
    } catch (error) {
      console.error("Sign out error:", error)
      toast.error("Failed to sign out")
    }
  }

  // Don't render if still loading or no user
  if (loading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton className="w-full justify-start gap-3 p-3 h-auto">
            <div className="flex items-center gap-3 w-full">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted border-2 border-sidebar-border animate-pulse">
                <span className="text-sm font-semibold text-muted-foreground">...</span>
              </div>
              <div className="flex flex-col items-start gap-0.5 flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-medium truncate w-full">Loading...</span>
              </div>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  if (!user) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              tooltip={isCollapsed ? "Account Center" : undefined}
              className={cn(
                "w-full justify-start gap-3 p-3 h-auto",
                "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              )}
            >
              <div className="flex items-center gap-3 w-full">
                {/* Profile Picture */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted border-2 border-sidebar-border">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={displayName}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-muted-foreground">
                      {initials}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-start gap-0.5 flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                  <span className="text-sm font-medium truncate w-full">
                    {displayName}
                  </span>
                  <span className="text-xs text-muted-foreground truncate w-full">
                    {email}
                  </span>
                </div>
                <ChevronUp 
                  className={cn(
                    "h-4 w-4 shrink-0 transition-transform group-data-[collapsible=icon]:hidden",
                    open && "rotate-180"
                  )} 
                />
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="end"
            sideOffset={8}
            className="w-56"
          >
            <DropdownMenuLabel>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">{displayName}</span>
                <span className="text-xs text-muted-foreground">
                  {email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Building2 className="mr-2 h-4 w-4" />
              <span>Switch Workspaces</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
