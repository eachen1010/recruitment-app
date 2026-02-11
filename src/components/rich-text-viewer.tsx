"use client"

import * as React from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import LinkExtension from "@tiptap/extension-link"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import Color from "@tiptap/extension-color"

interface RichTextViewerProps {
  content: string
}

export function RichTextViewer({ content }: RichTextViewerProps) {
  const editor = useEditor({
    immediatelyRender: false,
    editable: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      LinkExtension.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Color,
    ],
    content,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none",
      },
    },
  })

  if (!editor) {
    return (
      <div className="border rounded-md min-h-[200px] p-4 prose prose-sm max-w-none">
        <div className="text-muted-foreground">Loading content...</div>
      </div>
    )
  }

  return (
    <div className="border rounded-md min-h-[200px] p-4 prose prose-sm max-w-none">
      <EditorContent editor={editor} />
    </div>
  )
}
