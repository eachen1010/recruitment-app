"use client"

import * as React from "react"
import { useAuth } from "@/contexts/auth-context"
import { Item, ItemContent, ItemTitle, ItemDescription, ItemFooter } from "@/components/ui/item"
import { Calendar, Clock, MapPin, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function WelcomeSection() {
  const { user, loading } = useAuth()
  const [userRole, setUserRole] = React.useState<"candidate" | "admin" | null>(null)

  React.useEffect(() => {
    if (user?.uid) {
      // Get role from localStorage
      const role = localStorage.getItem(`userRole_${user.uid}`) as "candidate" | "admin" | null
      setUserRole(role)
    }
  }, [user])

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Welcome...</h1>
        <Item variant="outline">
          <ItemContent>
            <ItemTitle>Loading...</ItemTitle>
          </ItemContent>
        </Item>
      </div>
    )
  }

  const displayName = user?.displayName || user?.email?.split("@")[0] || "User"

  // Dummy data for next scheduled meeting
  const nextMeeting = {
    title: "Team Standup Meeting",
    date: "March 15, 2024",
    time: "10:00 AM - 10:30 AM",
    location: "Conference Room A",
    attendees: ["John Doe", "Jane Smith", "You"],
  }

  // Progress bar steps for admin
  const progressSteps = [
    "Set up",
    "Resume Review",
    "Interviews",
    "Coffee Chat",
    "Decisions"
  ]

  // Current progress (can be made dynamic later)
  const currentStep = 2 // Example: currently at "Interviews" step (0-indexed, so step 2 = 3rd step)
  const progressPercentage = ((currentStep + 1) / progressSteps.length) * 100

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold">Welcome {displayName}!</h1>
        {userRole && (
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {userRole === "admin" ? "Admin" : "Candidate"}
          </Badge>
        )}
      </div>
      
      {/* Progress bar for admin accounts */}
      {userRole === "admin" && (
        <Item variant="outline">
          <ItemContent>
            <ItemTitle>Recruitment Progress</ItemTitle>
            <ItemDescription className="mt-4 space-y-4">
              {/* Step sections */}
              <div className="flex gap-1 h-2">
                {progressSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`flex-1 rounded-sm ${
                      index <= currentStep
                        ? "bg-primary"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              {/* Step labels */}
              <div className="flex justify-between items-start text-sm pt-2">
                {progressSteps.map((step, index) => (
                  <div
                    key={step}
                    className={`flex flex-col items-center flex-1 ${
                      index <= currentStep ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    <span className="text-xs text-center font-medium">{step}</span>
                  </div>
                ))}
              </div>
            </ItemDescription>
          </ItemContent>
        </Item>
      )}
      
      <Item variant="outline">
        <ItemContent>
          <ItemTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Next Scheduled Meeting
          </ItemTitle>
          <ItemDescription className="mt-2 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">{nextMeeting.title}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span>{nextMeeting.date} • {nextMeeting.time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4" />
              <span>{nextMeeting.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" />
              <span>{nextMeeting.attendees.join(", ")}</span>
            </div>
          </ItemDescription>
          <ItemFooter className="mt-3">
            <span className="text-xs text-muted-foreground">
              Meeting scheduled for next week
            </span>
          </ItemFooter>
        </ItemContent>
      </Item>
    </div>
  )
}
