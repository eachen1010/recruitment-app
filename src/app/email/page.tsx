import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { CreateEmailDialog } from "./create-email-dialog"
import { Plus } from "lucide-react"

export default async function EmailPage() {
    const templates = await prisma.emailTemplateDummy.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Email Templates</h1>
                <CreateEmailDialog />
            </div>
            
            {templates.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <p className="text-lg mb-2">No email templates yet</p>
                    <p className="text-sm">Create your first email template to get started</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {templates.map((template) => (
                        <Item variant="outline" key={template.id}>
                            <ItemContent>
                                <ItemTitle>{template.title || "Untitled Template"}</ItemTitle>
                                <ItemDescription>
                                    {template.content 
                                        ? `${template.content.replace(/<[^>]*>/g, "").substring(0, 100)}...`
                                        : "No content yet"}
                                </ItemDescription>
                                {template.author && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Author: {template.author}
                                    </p>
                                )}
                                {template.createdAt && (
                                    <p className="text-xs text-muted-foreground">
                                        Created: {new Date(template.createdAt).toLocaleDateString()}
                                    </p>
                                )}
                            </ItemContent>
                            <ItemActions>
                                <Link href={`/email/${template.id}`}>
                                    <Button variant="outline" size="sm">
                                        Open
                                    </Button>
                                </Link>
                            </ItemActions>
                        </Item>
                    ))}
                </div>
            )}
        </div>
    )
  }