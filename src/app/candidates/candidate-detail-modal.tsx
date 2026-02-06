"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AirtableRecord } from "./columns"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface CandidateDetailModalProps {
  candidate: AirtableRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
  columnNames: Record<string, string>
}

export function CandidateDetailModal({
  candidate,
  open,
  onOpenChange,
  columnNames,
}: CandidateDetailModalProps) {
  if (!candidate) return null

  // Format field name for display
  const formatFieldName = (key: string): string => {
    return key
      .split(/(?=[A-Z])|[\s_-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  // Format field value for display
  const formatFieldValue = (value: any): string | React.ReactNode => {
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground italic">Not provided</span>
    }
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : 'None'
    }
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2)
    }
    return String(value)
  }

  const fields = candidate.fields || {}
  const fieldEntries = Object.entries(fields).filter(([_, value]) => {
    // Filter out empty values
    if (value === null || value === undefined) return false
    if (typeof value === 'string' && value.trim() === '') return false
    if (Array.isArray(value) && value.length === 0) return false
    if (typeof value === 'object' && Object.keys(value).length === 0) return false
    return true
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Candidate Details</DialogTitle>
          <DialogDescription>
            Complete information for this candidate
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {fieldEntries.map(([key, value], index) => {
            const fieldName = columnNames[key] || formatFieldName(key)
            const isPriority = key.toLowerCase() === 'priority'
            
            return (
              <div key={key}>
                <div className="flex flex-col space-y-2">
                  <h3 className="text-sm font-semibold text-foreground">
                    {fieldName}
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    {isPriority && typeof value === 'string' ? (
                      <Badge variant="secondary">{String(value)}</Badge>
                    ) : (
                      <div className="whitespace-pre-wrap break-words">
                        {formatFieldValue(value)}
                      </div>
                    )}
                  </div>
                </div>
                {index < fieldEntries.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
