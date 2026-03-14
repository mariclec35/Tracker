import Card from "@/components/Card";
import DocumentUpload from "@/components/DocumentUpload";
import { fetchDocuments } from "@/lib/queries";

export const revalidate = 0;

export default async function DocumentsPage() {
  const documents = await fetchDocuments();

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-stone">Archive</p>
        <h2 className="text-3xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
          Documents
        </h2>
        <p className="subtle-text">
          Upload supporting documents (certificates, exam scores, resume, or proposals).
        </p>
      </header>

      <Card>
        <DocumentUpload existingDocuments={documents} />
      </Card>
    </div>
  );
}
