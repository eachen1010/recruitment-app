const AIRTABLE_URL =
  "https://api.airtable.com/v0/appprUL7tR0m0OptO/General%20Member%20Application?view=Grid%20View";

type AirtableFields = {
  Name?: string;
  "Last Name"?: string;
  Priority?: string;
  Email?: string;
};

type Fields = Record<string, any> & { _id: string }

type AirtableRecord = {
  id: string;
} & Record<string, any>;

type AirtableResponse = {
  records: AirtableRecord[];
  offset: string;
}

export async function getCandidateData(): Promise<AirtableRecord[]> {
  let offset: string | undefined = undefined;
  let allRecords: AirtableRecord[] = [];

  do {
    const url = new URL(AIRTABLE_URL);

    if (offset) {
      url.searchParams.set("offset", offset);
    }

    // if (maxRecords) {
    //     url.searchParams.set("maxRecords", String(maxRecords))
    // }

    const res = await fetch(url.toString(), {
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
    const reformatted = data.records.map((record) => ({
        id: record.id,
        ...record.fields,
    }))
    
    if (allRecords) {
        allRecords = allRecords.concat(reformatted);
    }
    offset = data.offset;
  } while (offset);
  console.log(allRecords);
  return allRecords;
}