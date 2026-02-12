"use client";

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateTemplate } from "../actions";
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button";
import { toast } from "sonner"
import {
    Item,
    ItemContent,
    ItemFooter,
  } from "@/components/ui/item"
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
} from "@/components/ui/field"
import Link from "next/link";
import { RichTextEditor } from "@/components/rich-text-editor";

export default function EditEmail({ email }: { email: any }) {
  const [title, setTitle] = useState(email?.title || "");
  const [contents, setContents] = useState(email?.content || "");
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    // Get author name from current user
    const author = user?.displayName || user?.email?.split("@")[0] || email?.author || "System"
    
    try {
      const result = await updateTemplate(email?.id, title, contents, author)
      if (result.success) {
        toast.success("Saved successfully")
        // Navigate to view mode after saving
        router.push(`/email/${result.id}`)
      }
    } catch (error: any) {
      console.error("Error updating template:", error)
      toast.error(error.message || "Failed to update email template")
      setIsSaving(false)
    }
  }

  return (
    <Item variant="outline" className="flex my-4">
      <ItemContent>
      <form onSubmit={handleSubmit}>
      <div className="flex flex-row gap-4">
      <Field>
        <FieldLabel htmlFor="template-title">
          Title
        </FieldLabel>
        <Input
          id="template-title"
          placeholder={email?.title}
          defaultValue={email?.title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Field>
      </div>
      <Field className="mt-3">
        <FieldLabel htmlFor="template-contents">
          Contents
        </FieldLabel>
        <RichTextEditor
          content={contents}
          onChange={setContents}
          placeholder="Start writing your email template..."
        />
      </Field>
      <div className="flex gap-2 mt-4">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
        <Link href={`?edit=false`}>
            <Button variant="ghost">
            Cancel
            </Button>
        </Link>
      </div>
      </form>
      <ItemFooter className="mt-3">Author: {email?.author}, Last Edited: {String(email?.createdAt)}</ItemFooter>
      </ItemContent>
    </Item>
  );
}