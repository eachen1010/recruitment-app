"use client"

import { useMemo, useState, useEffect } from "react"
import { generateDynamicColumns, AirtableRecord } from "./columns"
import { DataTable } from "./data-table"
import { CandidateDetailModal } from "./candidate-detail-modal"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Pin } from "lucide-react"

interface CandidatesTableProps {
  candidates: AirtableRecord[]
}

export function CandidatesTable({ candidates }: CandidatesTableProps) {
  const [frozenColumns, setFrozenColumns] = useState<string[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<AirtableRecord | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Generate columns dynamically based on the fields in the data
  const columns = useMemo(() => {
    return generateDynamicColumns(candidates)
  }, [candidates])

  // Auto-pin columns with "name" in their ID on initial render
  useEffect(() => {
    if (!isInitialized && columns.length > 0) {
      const nameColumns = columns
        .filter(col => {
          const columnId = (col.id as string).toLowerCase()
          return columnId.includes('name')
        })
        .map(col => col.id as string)
      
      if (nameColumns.length > 0) {
        setFrozenColumns(nameColumns)
      }
      setIsInitialized(true)
    }
  }, [columns, isInitialized])

  // Get all available column IDs for the dropdown
  const availableColumns = useMemo(() => {
    return columns.map(col => {
      // Extract header name - format it similar to how it's displayed
      let headerName = col.id as string
      if (typeof col.header === 'string') {
        headerName = col.header
      } else if (col.header) {
        // For function headers, use the column ID and format it
        headerName = (col.id as string)
          .split(/(?=[A-Z])|[\s_-]/)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
      }
      
      // Truncate to 15 characters for display
      const displayName = headerName.length > 15 ? headerName.substring(0, 15) + '...' : headerName
      
      return {
        id: col.id as string,
        header: displayName,
        fullHeader: headerName
      }
    })
  }, [columns])

  const handleToggleFrozen = (columnId: string) => {
    setFrozenColumns(prev => 
      prev.includes(columnId)
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    )
  }

  const handleRowClick = (candidate: AirtableRecord) => {
    setSelectedCandidate(candidate)
    setIsModalOpen(true)
  }

  // Create a map of column IDs to their display names
  const columnNames = useMemo(() => {
    const names: Record<string, string> = {}
    availableColumns.forEach(col => {
      names[col.id] = col.fullHeader
    })
    return names
  }, [availableColumns])

  return (
    <div className="space-y-4 w-full min-w-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Pin className="mr-2 h-4 w-4" />
                Pin Columns ({frozenColumns.length})
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 max-h-[300px] overflow-y-auto">
              <DropdownMenuLabel>Select Columns to Freeze</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {availableColumns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={frozenColumns.includes(column.id)}
                  onCheckedChange={() => handleToggleFrozen(column.id)}
                  title={column.fullHeader}
                >
                  {column.header}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <DataTable 
        columns={columns} 
        data={candidates} 
        frozenColumns={frozenColumns}
        onRowClick={handleRowClick}
      />
      <CandidateDetailModal
        candidate={selectedCandidate}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        columnNames={columnNames}
      />
    </div>
  )
}
