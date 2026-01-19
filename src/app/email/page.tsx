import Link from "next/link";

import { Button } from "@/components/ui/button"


import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

/* TODO:
[] add new email templates
*/

const templates = [
    { id: "1", title: "Email Template 1", desc: "Maybe gpt wrapper a summary of the email"},
    { id: "2", title: "Email Template 2", desc: "Maybe gpt wrapper a summary of the email"},
];

export default async function EmailPage() {
    return (
        <div className="flex flex-col justify-center gap-4 w-[80vw]">
            {templates.map((template) => (
                <Item variant="outline" key={template.id}>
                    <ItemContent>
                    <ItemTitle>{template.title}</ItemTitle>
                    <ItemDescription>
                        {template.desc}
                    </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                        <Link
                        key={template.id}
                        href={`/email/${template.id}`}
                        >
                        <Button variant="outline" size="sm">
                            Select
                        </Button>
                        </Link>
                    </ItemActions>
                </Item>
            ))}
        </div>
    )
  }