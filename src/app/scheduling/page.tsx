import { Label } from "@/components/ui/label"
import { WeeklySchedule } from "./weekly-schedule"

export default function SchedulingPage() {
  return (
    <div className="flex flex-col gap-4 h-full w-full overflow-x-hidden">
      <Label className="mt-4 ml-4 text-2xl">Scheduling</Label>
      <div className="flex-1 w-full px-4 min-w-0">
        <WeeklySchedule />
      </div>
    </div>
  )
}
