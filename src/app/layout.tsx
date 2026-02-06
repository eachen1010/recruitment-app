import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import "./globals.css"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
        <body>
            <SidebarProvider>
            <AppSidebar />
            <main className="w-full p-[1vw] overflow-x-hidden min-w-0">
                <SidebarTrigger />
                {children}
            </main>
            </SidebarProvider>
        </body>
    </html>
  )
}