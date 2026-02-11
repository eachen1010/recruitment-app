"use client";

import { Button } from "@/components/ui/button";
import {
    Item,
    ItemContent,
    ItemFooter,
    ItemTitle,
  } from "@/components/ui/item"
import { PencilLine } from "lucide-react"
import Link from "next/link";
import { RichTextViewer } from "@/components/rich-text-viewer";

export default function ViewEmail({ email }: { email: any }) {
  return (
    <Item variant="outline" className="flex my-4">
        <ItemContent>
        <div className="flex flex-row gap-4 items-center">
        <ItemTitle>{email?.title}</ItemTitle>
        <Link href={`?edit=true`}>
        <Button variant="ghost" id={String(email?.id)}><PencilLine/></Button>
        </Link>
        </div>
        <div className="mt-3">
          <RichTextViewer content={email?.content || ""} />
        </div>
        <ItemFooter className="mt-3">Author: {email?.author}, Last Edited: {String(email?.createdAt)}</ItemFooter>
        </ItemContent>
    </Item>
  );
}
