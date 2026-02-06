"use client"

import * as React from "react"
import { Settings, LogOut, Building2, ChevronUp } from "lucide-react"
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

export function AccountCenter() {
  const [open, setOpen] = React.useState(false)
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

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
                {/* Profile Picture Placeholder */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted border-2 border-sidebar-border">
                  <span className="text-sm font-semibold text-muted-foreground">
                    U
                  </span>
                </div>
                <div className="flex flex-col items-start gap-0.5 flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                  <span className="text-sm font-medium truncate w-full">
                    User Name
                  </span>
                  <span className="text-xs text-muted-foreground truncate w-full">
                    [Workspace name here]
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
                <span className="text-sm font-medium">User Name</span>
                <span className="text-xs text-muted-foreground">
                  [Workspace name here]
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
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
