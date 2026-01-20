"use client";

import { useState } from "react";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Item,
  } from "@/components/ui/item"

type AirtableFields = {
    Name?: string;
    "Last Name"?: string;
    Priority?: string;
    Email?: string;
};  

type AirtableRecord = {
    id: string;
    fields: AirtableFields;
};

type AirtableResponse = {
    records: AirtableRecord[];
}

export default function RecipientSelectSheet({peopledata}: {peopledata: AirtableResponse}) {
    const [recipients, setRecipients] = useState<AirtableRecord[]>([]);

    function toggleRecipient(person: AirtableRecord) {
        setRecipients((prev) =>
            prev.includes(person) ? prev.filter((e) => e !== person) : [...prev, person]
        );
        console.log(recipients);
    }
    
    return (
        <div>
            <Sheet>
        <SheetTrigger asChild>
        <Button variant="outline">Select Recipients and Confirm Send</Button>
        </SheetTrigger>
        <SheetContent>
        <SheetHeader>
            <SheetTitle>Email Recipients</SheetTitle>
            <SheetDescription>
            Select recipients to email.
            </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
            <div className="grid gap-3">
            <Label htmlFor="sheet-demo-name">Recipients</Label>
            <Item variant="outline" className="h-[10vh] overflow-auto">
                <div className="flex flex-wrap gap-2">
                    {recipients.map((person) => {
                        return (
                            <Button 
                            variant="outline"
                            key={person.id}
                            className="hover:bg-red-300"
                            onClick={() => toggleRecipient(person)}>
                            {person.fields.Name} {person.fields["Last Name"]}
                            </Button>
                        )
                    })}
                </div>
            </Item>
            </div>
            <div className="flex flex-col gap-2">
            <Label htmlFor="sheet-demo-username">Applicants</Label>
            <Item variant="outline" className="h-[60vh] overflow-auto">
                <div className="flex flex-wrap gap-2">
                    {peopledata.records.map((person) => {
                    return (
                        <Button 
                        variant="outline" 
                        key={person.id}
                        onClick={() => toggleRecipient(person)}>
                        {person.fields.Name} {person.fields["Last Name"]}
                        </Button>
                    )
                    })}
                </div>
            </Item>
            </div>
        </div>
        <SheetFooter>
            <Button type="submit">Send</Button>
            {/* <SheetClose asChild>
            <Button variant="outline">Close</Button>
            </SheetClose> */}
        </SheetFooter>
        </SheetContent>
    </Sheet>
    </div>
    )
}