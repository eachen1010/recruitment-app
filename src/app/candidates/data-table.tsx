"use client"
import * as React from "react";

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
  } from "@tanstack/react-table"

import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  frozenColumns?: string[]
  onRowClick?: (row: TData) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  frozenColumns = [],
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  // Reorder columns: frozen columns first, then others
  const orderedColumns = React.useMemo(() => {
    const frozen = columns.filter(col => frozenColumns.includes(col.id as string))
    const unfrozen = columns.filter(col => !frozenColumns.includes(col.id as string))
    return [...frozen, ...unfrozen]
  }, [columns, frozenColumns])

  // Refs to measure actual column widths
  const headerRefs = React.useRef<Record<string, HTMLTableCellElement | null>>({})
  const [frozenOffsets, setFrozenOffsets] = React.useState<Record<string, number>>({})

  // Function to calculate offsets based on measured widths
  const calculateOffsets = React.useCallback(() => {
    if (frozenColumns.length === 0) {
      setFrozenOffsets({})
      return
    }

    const offsets: Record<string, number> = {}
    let currentOffset = 0

    // Calculate offsets based on actual measured widths
    orderedColumns.forEach((col) => {
      if (frozenColumns.includes(col.id as string)) {
        const headerElement = headerRefs.current[col.id as string]
        if (headerElement && headerElement.offsetWidth > 0) {
          offsets[col.id as string] = currentOffset
          currentOffset += headerElement.offsetWidth
        } else {
          // Fallback if not yet measured - use a reasonable default
          offsets[col.id as string] = currentOffset
          currentOffset += 150
        }
      }
    })

    setFrozenOffsets(offsets)
  }, [frozenColumns, orderedColumns])

  // Measure column widths and calculate offsets
  React.useEffect(() => {
    calculateOffsets()
  }, [calculateOffsets])

  // Recalculate when refs are set (after DOM update)
  React.useEffect(() => {
    if (frozenColumns.length > 0) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        setTimeout(() => calculateOffsets(), 0)
      })
    }
  }, [frozenColumns, calculateOffsets])

  const table = useReactTable({
    data,
    columns: orderedColumns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  // Debug: log column count
  React.useEffect(() => {
    console.log('DataTable - Columns received:', columns.length)
    console.log('DataTable - Header groups:', table.getHeaderGroups().length)
    console.log('DataTable - Headers in first group:', table.getHeaderGroups()[0]?.headers.length)
  }, [columns, table])

  return (
    <div className="w-full min-w-0 max-w-full">
        <div className="flex items-center py-4">
            {/* <Input
            placeholder="Filter by name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
            /> */}
        </div>
        <div className="h-[calc(100vh-12rem)] w-full rounded-md border overflow-hidden">
          <ScrollArea className="h-full w-full">
            <div className="min-w-max">
              <table className={cn("caption-bottom text-sm")} style={{ minWidth: 'max-content' }}>
                <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header, index) => {
                        const isFrozen = frozenColumns.includes(header.column.id)
                        const leftOffset = frozenOffsets[header.column.id] ?? 0
                        // Check if this is the last frozen column
                        const isLastFrozen = isFrozen && (index === headerGroup.headers.length - 1 || !frozenColumns.includes(headerGroup.headers[index + 1]?.column.id))
                        return (
                        <TableHead 
                          key={header.id}
                          ref={(el) => {
                            if (isFrozen && header.column.id) {
                              headerRefs.current[header.column.id] = el
                            }
                          }}
                          className={cn(
                            "whitespace-nowrap",
                            isFrozen && "sticky shadow-sm"
                          )}
                          style={isFrozen ? { 
                            left: `${leftOffset}px`,
                            backgroundColor: '#f5f5f5',
                            zIndex: 30,
                            position: 'sticky',
                            boxShadow: '2px 0 4px -2px rgba(0, 0, 0, 0.1)',
                            borderRight: isLastFrozen 
                              ? '2px solid hsl(var(--border))' 
                              : '1px solid hsl(var(--border))'
                          } : undefined}
                        >
                            {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                                )}
                        </TableHead>
                        )
                    })}
                    </TableRow>
                ))}
                </TableHeader>
                <TableBody>
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                    <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className={cn(
                          "px-3 cursor-pointer hover:bg-muted/50 transition-colors",
                          onRowClick && "cursor-pointer"
                        )}
                        style={frozenColumns.length > 0 ? {
                          position: 'relative'
                        } : undefined}
                        onClick={() => onRowClick?.(row.original)}
                    >
                        {row.getVisibleCells().map((cell, cellIndex) => {
                          const isFrozen = frozenColumns.includes(cell.column.id)
                          const leftOffset = frozenOffsets[cell.column.id] ?? 0
                          // Check if this is the last frozen column
                          const isLastFrozen = isFrozen && (cellIndex === row.getVisibleCells().length - 1 || !frozenColumns.includes(row.getVisibleCells()[cellIndex + 1]?.column.id))
                          return (
                            <TableCell 
                              key={cell.id} 
                              className={cn(
                                "whitespace-nowrap",
                                isFrozen && "sticky shadow-sm"
                              )}
                              style={isFrozen ? { 
                                left: `${leftOffset}px`,
                                backgroundColor: '#f5f5f5',
                                zIndex: 30,
                                position: 'sticky',
                                boxShadow: '2px 0 4px -2px rgba(0, 0, 0, 0.1)',
                                borderRight: isLastFrozen 
                                  ? '2px solid hsl(var(--border))' 
                                  : '1px solid hsl(var(--border))'
                              } : undefined}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          )
                        })}
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                        No results.
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
              </table>
            </div>
            <ScrollBar orientation="horizontal" />
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </div>
    </div>
  )
}