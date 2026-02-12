"use client"

import { usePathname } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/role-survey"

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <SidebarProvider className="h-screen">
      <AppSidebar />
      <main className="w-full p-[1vw] overflow-x-hidden min-w-0 h-full">
        {children}
      </main>
    </SidebarProvider>
  )
}
