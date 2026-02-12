"use server";

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function updateTemplate(id: number, title: String, content: String, author?: string) {
  const updateData: any = {
    title: String(title),
    content: String(content),
    createdAt: new Date().toISOString(),
  };
  
  // Only update author if provided
  if (author) {
    updateData.author = author;
  }

  await prisma.emailTemplateDummy.update({
    where: { id },
    data: updateData,
  });

  revalidatePath(`/email/${id}`)
  return { success: true, id }
}

export async function createTemplate(title: string, content: string = "", author: string = "System") {
  try {
    const template = await prisma.emailTemplateDummy.create({
      data: {
        title,
        content,
        author,
        createdAt: new Date().toISOString(),
      },
    });

    revalidatePath("/email")
    return { success: true, id: template.id }
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new Error("A template with this title already exists. Please choose a different title.");
    }
    throw error;
  }
}