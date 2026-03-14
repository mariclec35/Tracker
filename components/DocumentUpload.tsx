"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";
import { STORAGE_BUCKET } from "@/lib/config";
import type { DocumentRecord } from "@/lib/types";

type DocumentUploadProps = {
  existingDocuments: DocumentRecord[];
};

export default function DocumentUpload({ existingDocuments }: DocumentUploadProps) {
  const router = useRouter();
  const [fileType, setFileType] = useState<DocumentRecord["file_type"]>("certificate");
  const [relatedType, setRelatedType] = useState("");
  const [relatedId, setRelatedId] = useState("");
  const [filter, setFilter] = useState<"all" | DocumentRecord["file_type"]>("all");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const filteredDocuments =
    filter === "all" ? existingDocuments : existingDocuments.filter((doc) => doc.file_type === filter);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      setMessage("Select a file first.");
      return;
    }

    setIsSaving(true);
    setMessage(null);
    const supabase = getSupabaseBrowserClient();

    const folderMap: Record<DocumentRecord["file_type"], string> = {
      certificate: "certificates",
      exam_score: "exam-scores",
      resume: "resumes",
      proposal: "proposals"
    };
    const path = `${folderMap[fileType]}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
      upsert: true
    });

    if (uploadError) {
      setMessage(uploadError.message);
      setIsSaving(false);
      return;
    }

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);

    const { error } = await supabase.from("documents").insert({
      file_name: file.name,
      file_type: fileType,
      file_url: data.publicUrl,
      related_type: relatedType || null,
      related_id: relatedId || null,
      uploaded_at: new Date().toISOString()
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Document uploaded.");
      setFile(null);
      router.refresh();
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium">
          File Type
          <select
            value={fileType}
            onChange={(event) => setFileType(event.target.value as DocumentRecord["file_type"])}
            className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
          >
            <option value="certificate">certificate</option>
            <option value="exam_score">exam_score</option>
            <option value="resume">resume</option>
            <option value="proposal">proposal</option>
          </select>
        </label>

        <label className="block text-sm font-medium">
          Related Type (optional)
          <input
            value={relatedType}
            onChange={(event) => setRelatedType(event.target.value)}
            className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
            placeholder="certifications, amendment"
          />
        </label>

        <label className="block text-sm font-medium">
          Related ID (optional)
          <input
            value={relatedId}
            onChange={(event) => setRelatedId(event.target.value)}
            className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
            placeholder="UUID"
          />
        </label>

        <label className="block text-sm font-medium">
          Upload File (PDF or image)
          <input
            type="file"
            accept="application/pdf,image/*"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="mt-2 block w-full text-sm"
          />
        </label>

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-mist disabled:opacity-60"
        >
          {isSaving ? "Uploading..." : "Upload Document"}
        </button>
        {message ? <p className="text-sm text-stone">{message}</p> : null}
      </form>

      <div className="space-y-3">
        <p className="text-sm font-semibold">Documents</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "All", value: "all" },
            { label: "Certificates", value: "certificate" },
            { label: "Exam Scores", value: "exam_score" },
            { label: "Resumes", value: "resume" },
            { label: "Proposals", value: "proposal" }
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setFilter(tab.value as typeof filter)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                filter === tab.value ? "bg-ink text-mist border-ink" : "border-black/10 text-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filteredDocuments.length === 0 ? (
          <p className="text-sm text-stone">No documents found for this filter.</p>
        ) : (
          <div className="space-y-3">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="rounded-xl border border-black/10 p-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">{doc.file_name}</p>
                    <p className="subtle-text">{doc.file_type}</p>
                  </div>
                  <a className="underline" href={doc.file_url} target="_blank" rel="noreferrer">
                    View
                  </a>
                </div>
                <p className="subtle-text mt-2">Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}</p>
                <p className="subtle-text">
                  Related: {doc.related_type ? `${doc.related_type} · ${doc.related_id ?? "unlinked"}` : "unlinked"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
