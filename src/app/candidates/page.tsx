import { AirtableRecord } from "./columns"
import { CandidatesTable } from "./candidates-table"
import { Label } from "@/components/ui/label"
import { getCandidateData } from "@/lib/airtable";

async function formatCandidateData(): Promise<AirtableRecord[]> {
  const data = await getCandidateData();
  // The data from getCandidateData already has the structure { id, ...fields }
  // We need to restructure it to { id, fields: { ... } }
  const formatted = data.map((item) => {
    const { id, ...fields } = item;
    return {
      id,
      fields: fields as Record<string, any>
    };
  });

  // Filter out rows that are completely empty (all fields are null, undefined, empty string, or empty array)
  return formatted.filter((record) => {
    const fieldValues = Object.values(record.fields || {});
    // Check if any field has a non-empty value
    return fieldValues.some((value) => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'string' && value.trim() === '') return false;
      if (Array.isArray(value) && value.length === 0) return false;
      if (typeof value === 'object' && Object.keys(value).length === 0) return false;
      return true; // Field has a meaningful value
    });
  });
}

export default async function Page() {
  const candidates = await formatCandidateData();

  return (
    <>
      <div className="flex flex-col gap-4 h-full w-full overflow-x-hidden">
        <Label className="mt-4 ml-4 text-2xl">Candidate Dashboard</Label>
        <div className="flex-1 w-full px-4 min-w-0">
          <CandidatesTable candidates={candidates} />
        </div>
      </div>
    </>
  )
}
