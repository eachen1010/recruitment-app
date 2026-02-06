"use server";

import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { toast } from "sonner"

export async function updateTemplate(id: number, title: String, content: String) {
  await prisma.emailTemplateDummy.update({
    where: { id },
    data: {
      title: String(title),
      content: String(content),
      createdAt: new Date().toISOString(),
    },
  });

  redirect(`/email/${id}`);
}