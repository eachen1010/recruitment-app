import { prisma } from '@/lib/db'

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemFooter,
  ItemTitle,
} from "@/components/ui/item"
import { Button } from "@/components/ui/button"
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
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import ViewEmail from './email-view'
import EditEmail from './email-edit-form'

/* TODO: 
[x] fetch email template based on id
[] be able to edit and save email template
[] add back button
[x] open sheet when "send" is clicked
[] send email functionality
[] add toasts
*/

const AIRTABLE_URL =
  "https://api.airtable.com/v0/appprUL7tR0m0OptO/General%20Member%20Application?maxRecords=50&view=Grid%20View";

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


export async function getCandidateData(): Promise<AirtableResponse> {
  const res = await fetch(AIRTABLE_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Airtable fetch failed: ${res.status}`);
  }

  // parse the data
  const data = (await res.json()) as AirtableResponse;
  console.log(data);

  return data;
}
 
export default async function EmailTemplatePage({ 
  params, 
  searchParams }: {
  params: { id: string };
  searchParams: { edit?: string };
}) {
  const { id } = await params;
  const search = await searchParams;
  const isEdit = search.edit === "true"


  const template = await prisma.emailTemplateDummy.findUnique({
    where: {
      id: parseInt(id)
    }
  });
  
  const data = await getCandidateData();
  console.log(data.records);
  let recipients = [];

  function toggleRecipient(email: string) {
    setRecipients((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  }
  
  return (
    <div>
    {isEdit ? (
      <div className="h-full w-full justify-end gap-4">
        <EditEmail email={template}></EditEmail>
      </div>
    ) : (
      <div className="h-full w-full justify-end gap-4">
        <ViewEmail email={template}></ViewEmail>
      </div>
    )}

  <Sheet>
    <SheetTrigger asChild>
      <Button variant="outline">Set Recipients and Send</Button>
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
          <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="sheet-demo-username">Applicants</Label>
          <div className="flex flex-wrap gap-2">
            {data.records.map((person) => {
              return (
                <Button 
                variant="outline" 
                key={person.id}
                onClick={() => toggleRecipient(person.id)}>
                  {person.fields.Name} {person.fields["Last Name"]}
                </Button>
              )
            })}
          </div>
        </div>
      </div>
      <SheetFooter>
        <Button type="submit">Send</Button>
        <SheetClose asChild>
          <Button variant="outline">Close</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
  </div>
  )
}


