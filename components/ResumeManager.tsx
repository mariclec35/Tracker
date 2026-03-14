"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StatusBadge from "./StatusBadge";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";
import { STORAGE_BUCKET } from "@/lib/config";
import type { ResumeRecord } from "@/lib/types";

type ResumeManagerProps = {
  initialResume: ResumeRecord | null;
};

export default function ResumeManager({ initialResume }: ResumeManagerProps) {
  const router = useRouter();
  const [status, setStatus] = useState<ResumeRecord["status"]>(initialResume?.status ?? "needs_update");
  const [file, setFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const currentFileUrl = initialResume?.file_url ?? null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);
    const supabase = getSupabaseBrowserClient();

    let fileUrl = currentFileUrl;

    if (!file && !fileUrl) {
      setMessage("Please upload a resume file first.");
      setIsSaving(false);
      return;
    }

    if (file) {
      const path = `resumes/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
        upsert: true
      });

      if (uploadError) {
        setMessage(uploadError.message);
        setIsSaving(false);
        return;
      }

      const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
      fileUrl = data.publicUrl;
    }

    const payload: {
      id?: string;
      file_url: string | null;
      status: ResumeRecord["status"];
      last_updated: string;
    } = {
      file_url: fileUrl,
      status,
      last_updated: new Date().toISOString()
    };

    if (initialResume?.id) {
      payload.id = initialResume.id;
    }

    const { data: resumeRecord, error } = await supabase
      .from("resume")
      .upsert(payload, { onConflict: "id" })
      .select()
      .single();

    if (error) {
      setMessage(error.message);
    } else {
      if (file && fileUrl) {
        await supabase.from("documents").insert({
          file_name: file.name,
          file_type: "resume",
          file_url: fileUrl,
          related_type: "resume",
          related_id: resumeRecord?.id ?? null,
          uploaded_at: new Date().toISOString()
        });
      }
      setMessage("Resume updated.");
      router.refresh();
      setFile(null);
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-stone">Current status</p>
          <div className="mt-2">
            <StatusBadge status={initialResume?.status ?? null} />
          </div>
        </div>
        {currentFileUrl ? (
          <a className="text-sm font-semibold underline" href={currentFileUrl} target="_blank" rel="noreferrer">
            Download Resume
          </a>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium">
          Status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as ResumeRecord["status"])}
            className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
          >
            <option value="current">current</option>
            <option value="needs_update">needs_update</option>
          </select>
        </label>

        <label className="block text-sm font-medium">
          Upload Resume (PDF)
          <input
            type="file"
            accept="application/pdf"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="mt-2 block w-full text-sm"
          />
        </label>

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-mist disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save Resume"}
        </button>

        {message ? <p className="text-sm text-stone">{message}</p> : null}
      </form>
    </div>
  );
}
