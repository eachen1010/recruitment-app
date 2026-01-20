import { prisma } from '@/lib/db'
import ViewEmail from './email-view'
import EditEmail from './email-edit-form'
import RecipientSelectSheet from './recipient-select-sheet'

/* TODO: 
[x] fetch email template based on id
[x] be able to edit and save email template
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

      <RecipientSelectSheet peopledata={data}/>
    </div>
  
  )
}


