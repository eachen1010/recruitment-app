"use client";

import { Button } from "@/components/ui/button";
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemFooter,
    ItemTitle,
  } from "@/components/ui/item"
import { Textarea } from "@/components/ui/textarea"
import { PencilLine } from "lucide-react"
import Link from "next/link";

export default function ViewEmail({ email }: { email: any }) {
  return (
    <Item variant="outline" className="flex my-4">
        <ItemContent>
        <div className="flex flex-row gap-4">
        <ItemTitle>{email?.title}</ItemTitle>
        <Link href={`?edit=true`}>
        <Button variant="ghost" id={String(email?.id)}><PencilLine/></Button>
        </Link>
        </div>
        <Textarea value={email?.content} readOnly/>
        <ItemFooter className="mt-3">Author: {email?.author}, Last Edited: {String(email?.createdAt)}</ItemFooter>
        </ItemContent>
    </Item>
  );
}
