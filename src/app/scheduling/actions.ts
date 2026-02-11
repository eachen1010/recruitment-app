"use server"

import { prisma } from "@/lib/db"

export async function upsertAvailability(
  email: string,
  name: string,
  availability: string,
  role?: string
) {
  try {
    // Check if availability exists for this email
    const existing = await prisma.leads.findFirst({
      where: { email },
    })

    if (existing) {
      // Update existing record using composite primary key
      await prisma.leads.update({
        where: { 
          lid_email: {
            lid: existing.lid,
            email: existing.email
          }
        },
        data: {
          name,
          role: role || null,
          availability,
        },
      })
    } else {
      // Create new record
      await prisma.leads.create({
        data: {
          email,
          name,
          role: role || null,
          availability,
        },
      })
    }

    return { success: true }
  } catch (error) {
    console.error("Error upserting availability:", error)
    throw new Error("Failed to save availability")
  }
}
