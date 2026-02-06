"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const HOURS = Array.from({ length: 24 }, (_, i) => i)
const QUARTERS = [0, 30] // 30-minute increments

// Generate slot ID: "Monday-09:00", "Monday-09:30", etc.
const getSlotId = (day: string, hour: number, quarter: number) => {
  const timeStr = `${hour.toString().padStart(2, '0')}:${quarter.toString().padStart(2, '0')}`
  return `${day}-${timeStr}`
}

export function WeeklySchedule() {
  const [currentWeek, setCurrentWeek] = React.useState(new Date())
  // Store available slots as a Set of slot IDs
  const [availableSlots, setAvailableSlots] = React.useState<Set<string>>(new Set())
  // Drag state
  const [isDragging, setIsDragging] = React.useState(false)
  const [dragStartState, setDragStartState] = React.useState<boolean | null>(null)
  const [lastProcessedSlot, setLastProcessedSlot] = React.useState<string | null>(null)
  const mouseDownPosRef = React.useRef<{ x: number; y: number } | null>(null)
  const initialSlotRef = React.useRef<string | null>(null)
  const hasMovedRef = React.useRef<boolean>(false)
  const clickTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  // Get the start of the current week (Sunday)
  const getWeekStart = (date: Date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day
    return new Date(d.setDate(diff))
  }

  const weekStart = getWeekStart(currentWeek)
  const weekDays = DAYS_OF_WEEK.map((_, index) => {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + index)
    return {
      name: DAYS_OF_WEEK[index],
      date: date,
      dateStr: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  })

  const handlePreviousWeek = () => {
    setCurrentWeek(new Date(currentWeek.setDate(currentWeek.getDate() - 7)))
  }

  const handleNextWeek = () => {
    setCurrentWeek(new Date(currentWeek.setDate(currentWeek.getDate() + 7)))
  }

  const handleToday = () => {
    setCurrentWeek(new Date())
  }

  const handleSlotMouseDown = (day: string, hour: number, quarter: number, e: React.MouseEvent) => {
    const slotId = getSlotId(day, hour, quarter)
    const isAvailable = availableSlots.has(slotId)
    
    // Reset movement tracking
    hasMovedRef.current = false
    
    // Track mouse position to detect if it's a drag or click
    mouseDownPosRef.current = { x: e.clientX, y: e.clientY }
    initialSlotRef.current = slotId
    setDragStartState(!isAvailable)
    setLastProcessedSlot(slotId)
  }

  const handleSlotMouseMove = (e: React.MouseEvent) => {
    if (!mouseDownPosRef.current || !initialSlotRef.current) return
    
    // Check if mouse moved enough to be considered a drag (5px threshold)
    const deltaX = Math.abs(e.clientX - mouseDownPosRef.current.x)
    const deltaY = Math.abs(e.clientY - mouseDownPosRef.current.y)
    
    if (deltaX > 5 || deltaY > 5) {
      hasMovedRef.current = true
      
      // This is a drag, start dragging
      if (!isDragging) {
        setIsDragging(true)
        // Clear any pending click timeout
        if (clickTimeoutRef.current) {
          clearTimeout(clickTimeoutRef.current)
          clickTimeoutRef.current = null
        }
        // Toggle the initial slot when drag starts
        const initialSlotId = initialSlotRef.current
        const initialIsAvailable = availableSlots.has(initialSlotId)
        
        setAvailableSlots(prev => {
          const newSet = new Set(prev)
          if (initialIsAvailable) {
            newSet.delete(initialSlotId)
          } else {
            newSet.add(initialSlotId)
          }
          return newSet
        })
      }
    }
  }

  const handleSlotMouseEnter = (day: string, hour: number, quarter: number) => {
    if (!isDragging || dragStartState === null) return
    
    const slotId = getSlotId(day, hour, quarter)
    // Avoid processing the same slot multiple times
    if (slotId === lastProcessedSlot) return
    
    setLastProcessedSlot(slotId)
    
    setAvailableSlots(prev => {
      const newSet = new Set(prev)
      // dragStartState = true means we want to mark as available (add to set)
      // dragStartState = false means we want to mark as unavailable (remove from set)
      if (dragStartState) {
        newSet.add(slotId)
      } else {
        newSet.delete(slotId)
      }
      return newSet
    })
  }

  const handleSlotClick = (day: string, hour: number, quarter: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Only handle click if we didn't drag
    if (hasMovedRef.current || isDragging) {
      return
    }
    
    const slotId = getSlotId(day, hour, quarter)
    setAvailableSlots(prev => {
      const newSet = new Set(prev)
      if (newSet.has(slotId)) {
        newSet.delete(slotId)
      } else {
        newSet.add(slotId)
      }
      return newSet
    })
    
    // Clear any pending timeout
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current)
      clickTimeoutRef.current = null
    }
  }

  const handleMouseUp = (e?: React.MouseEvent) => {
    // If we were just clicking (not dragging), handle it via timeout to ensure click fires first
    if (mouseDownPosRef.current && !hasMovedRef.current && !isDragging && initialSlotRef.current) {
      // Use a small timeout to let onClick fire first, then handle if onClick didn't
      clickTimeoutRef.current = setTimeout(() => {
        if (!hasMovedRef.current && !isDragging && initialSlotRef.current) {
          const slotId = initialSlotRef.current
          setAvailableSlots(prev => {
            const newSet = new Set(prev)
            if (newSet.has(slotId)) {
              newSet.delete(slotId)
            } else {
              newSet.add(slotId)
            }
            return newSet
          })
        }
        clickTimeoutRef.current = null
      }, 10)
    }
    
    // Reset drag state after a short delay to allow click to process
    setTimeout(() => {
      setIsDragging(false)
      setDragStartState(null)
      setLastProcessedSlot(null)
      mouseDownPosRef.current = null
      initialSlotRef.current = null
      hasMovedRef.current = false
    }, 50)
  }

  const handleMouseLeave = () => {
    // Stop dragging if mouse leaves the calendar area
    if (isDragging || mouseDownPosRef.current) {
      setIsDragging(false)
      setDragStartState(null)
      setLastProcessedSlot(null)
      mouseDownPosRef.current = null
      initialSlotRef.current = null
      hasMovedRef.current = false
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current)
        clickTimeoutRef.current = null
      }
    }
  }

  // Add global mouse up listener to handle drag end outside the component
  React.useEffect(() => {
    if (isDragging || mouseDownPosRef.current) {
      const handleGlobalMouseUp = () => {
        handleMouseUp()
      }
      window.addEventListener('mouseup', handleGlobalMouseUp)
      return () => window.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [isDragging])

  const handleSave = () => {
    // Convert Set to Array and organize by day for better readability
    const slotsArray = Array.from(availableSlots).sort()
    const organizedByDay: Record<string, string[]> = {}
    
    slotsArray.forEach(slotId => {
      const [day, time] = slotId.split('-')
      if (!organizedByDay[day]) {
        organizedByDay[day] = []
      }
      organizedByDay[day].push(time)
    })

    const availabilityData = {
      totalSlots: availableSlots.size,
      slots: slotsArray,
      organizedByDay: organizedByDay,
      rawSet: Array.from(availableSlots)
    }

    console.log('📅 Availability Data (Saved):', JSON.stringify(availabilityData, null, 2))
  }

  const isSlotAvailable = (day: string, hour: number, quarter: number) => {
    const slotId = getSlotId(day, hour, quarter)
    return availableSlots.has(slotId)
  }

  const getTimeRange = (date: Date) => {
    const start = new Date(weekStart)
    const end = new Date(weekStart)
    end.setDate(end.getDate() + 6)
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  }

  // Format time for display
  const formatTime = (hour: number, quarter: number) => {
    const totalMinutes = hour * 60 + quarter
    const displayHour = Math.floor(totalMinutes / 60)
    const displayMinute = totalMinutes % 60
    const period = displayHour >= 12 ? 'PM' : 'AM'
    const hour12 = displayHour === 0 ? 12 : displayHour > 12 ? displayHour - 12 : displayHour
    return `${hour12}:${displayMinute.toString().padStart(2, '0')} ${period}`
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="ml-4 font-medium">{getTimeRange(weekStart)}</span>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Save
        </Button>
      </div>

      {/* Availability Grid */}
      <div 
        className="flex-1 overflow-auto border rounded-lg select-none"
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleSlotMouseMove}
      >
        <div className="min-w-full">
          {/* Header Row */}
          <div className="flex sticky top-0 bg-background z-10 border-b">
            <div className="w-24 shrink-0 border-r p-2 min-w-[96px]"></div>
            {weekDays.map((day) => (
              <div
                key={day.name}
                className="flex-1 border-r last:border-r-0 p-2 text-center min-w-0"
              >
                <div className="font-semibold">{day.name}</div>
                <div className="text-xs text-muted-foreground">{day.dateStr}</div>
              </div>
            ))}
          </div>

          {/* Time Slots with 30-minute increments */}
          <div className="flex">
            {/* Time Column */}
            <div className="w-24 shrink-0 border-r min-w-[96px]">
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="h-12 border-b"
                >
                  <div className="p-1 text-xs text-muted-foreground">
                    {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                  </div>
                </div>
              ))}
            </div>

            {/* Day Columns */}
            <div className="flex flex-1 min-w-0">
              {weekDays.map((day) => (
                <div key={day.name} className="flex-1 border-r last:border-r-0 min-w-0">
                  {HOURS.map((hour) => (
                    <div key={hour} className="h-12 border-b flex flex-col">
                      {QUARTERS.map((quarter) => {
                        const isAvailable = isSlotAvailable(day.name, hour, quarter)
                        return (
                          <div
                            key={`${hour}-${quarter}`}
                            className={cn(
                              "flex-1 border-b last:border-b-0 cursor-pointer transition-colors",
                              isAvailable 
                                ? "bg-green-100 hover:bg-green-200" 
                                : "bg-background hover:bg-muted/30"
                            )}
                            onMouseDown={(e) => handleSlotMouseDown(day.name, hour, quarter, e)}
                            onMouseEnter={() => {
                              if (isDragging) {
                                handleSlotMouseEnter(day.name, hour, quarter)
                              }
                            }}
                            onClick={(e) => handleSlotClick(day.name, hour, quarter, e)}
                            title={`${day.name} ${formatTime(hour, quarter)}`}
                          />
                        )
                      })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
