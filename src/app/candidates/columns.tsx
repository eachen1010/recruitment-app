"use client"

import {
  type ColumnDef,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown } from "lucide-react"

export type AirtableRecord<F extends Record<string, any> = Record<string, any>> = {
  id: string
  fields: F
}

export function generateDynamicColumns(data: AirtableRecord[]): ColumnDef<AirtableRecord>[] {
  if (!data || data.length === 0) {
    return []
  }

  // Collect all unique field keys from all records
  const fieldKeys = new Set<string>()
  data.forEach(record => {
    if (record.fields) {
      Object.keys(record.fields).forEach(key => {
        // Ensure we capture all keys, including those with special characters
        if (key && typeof key === 'string') {
          fieldKeys.add(key)
        }
      })
    }
  })

  // Convert to array and sort for consistent ordering
  const sortedFieldKeys = Array.from(fieldKeys).sort()

  // Debug: log the field keys we found
  console.log('Field keys found:', sortedFieldKeys)
  console.log('Total columns to generate:', sortedFieldKeys.length)

  // Helper function to truncate text to 15 characters
  const truncateText = (text: string): string => {
    if (text.length <= 15) return text
    return text.substring(0, 15) + '...'
  }

  // Create columns for each field
  const dynamicColumns: ColumnDef<AirtableRecord>[] = sortedFieldKeys.map(key => {
    // Format header name (capitalize first letter, handle spaces)
    const headerName = key
      .split(/(?=[A-Z])|[\s_-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')

    // Truncate header name to 15 characters
    const truncatedHeaderName = truncateText(headerName)

    return {
      id: key,
      accessorFn: (row) => row.fields?.[key] ?? null,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 lg:px-3"
            title={headerName}
          >
            {truncatedHeaderName}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ getValue }) => {
        const value = getValue()
        
        // Handle different value types
        if (value === null || value === undefined) {
          return <span className="text-muted-foreground">—</span>
        }
        // If it's an array (like attachments or multiple select), join them and truncate
        if (Array.isArray(value)) {
          const joined = value.join(', ')
          return <span title={joined}>{truncateText(joined)}</span>
        }
        // If it's an object, stringify it and truncate
        if (typeof value === 'object') {
          const stringified = JSON.stringify(value)
          return <span title={stringified}>{truncateText(stringified)}</span>
        }
        // Special handling for Priority field (or any field that should be a badge)
        if (key.toLowerCase() === 'priority' && typeof value === 'string') {
          const truncated = truncateText(value)
          return <Badge variant="secondary" title={value}>{truncated}</Badge>
        }
        // Truncate string values to 15 characters
        const stringValue = String(value)
        return <span title={stringValue}>{truncateText(stringValue)}</span>
      },
      enableSorting: true,
    }
  })

  console.log('Generated columns:', dynamicColumns.length)
  return dynamicColumns
}
// export const columns = generateDynamicColumns(candidates);

// export const columns: ColumnDef<AirtableRecord>[] = [
//   {
//     id: "select",
//     header: ({ table }) => (
//       <Checkbox
//         checked={
//           table.getIsAllPageRowsSelected() ||
//           (table.getIsSomePageRowsSelected() && "indeterminate")
//         }
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//     {
//     accessorKey: "priority",
//     header: ({ column }) => {
//         return (
//           <Button
//             variant="ghost"
//             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           >
//             Priority
//             <ArrowUpDown />
//           </Button>
//         )
//       },
//       cell: ({ row }) => <div className="lowercase">{row.getValue("priority")}</div>,
//   }].concat[
//   {
//     accessorKey: "name",
//     header: "First Name",
//   },
//   {
//     accessorKey: "lastname",
//     header: "Last Name",
//   },
//   {
//     accessorKey: "email",
//     header: ({ column }) => {
//         return (
//           <Button
//             variant="ghost"
//             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           >
//             Email
//             <ArrowUpDown />
//           </Button>
//         )
//       },
//       cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
//   },
  
// ]
