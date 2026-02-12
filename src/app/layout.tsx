import { ConditionalLayout } from "@/components/conditional-layout"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/contexts/auth-context"
import { FirebaseConfigCheck } from "@/components/firebase-config-check"
import { RoleSurveyCheck } from "@/components/role-survey-check"
import "./globals.css"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
        <body>
            <AuthProvider>
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
              <RoleSurveyCheck />
            </AuthProvider>
            <Toaster />
            <FirebaseConfigCheck />
        </body>
    </html>
  )
}