import { columns, Candidate } from "./columns"
import { DataTable } from "./data-table"

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

export async function getCandidateData(): Promise<Candidate[]> {
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

  return data["records"].map(
    (item) => (
      {
        id: item.id,
        name: item.fields.Name,
        lastname: item.fields["Last Name"],
        priority: item.fields.Priority,
        email: item.fields.Email
      }));
}


export default async function Page() {
  const data = await getCandidateData();
  console.log(data);

  return (
    <>
      <div className="flex flex-col gap-4 justify-center">
        <ul>Welcome back User!</ul>
        <div className="mx-auto py-10 justify-center">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </>
  )
}
