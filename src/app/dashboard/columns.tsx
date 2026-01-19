"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Candidate = {
  id: string | undefined
  name: string | undefined
  lastname: string| undefined
  email: string | undefined
  status: string | undefined
}

export const columns: ColumnDef<Candidate>[] = [
{
    accessorKey: "id",
    header: "ID",
    },
    {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "name",
    header: "First Name",
  },
  {
    accessorKey: "lastname",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  
]