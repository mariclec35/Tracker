"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";

export default function TrainingAmendmentForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("draft");
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);
    const supabase = getSupabaseBrowserClient();

    const { error } = await supabase.from("training_amendments").insert({
      title,
      description,
      status,
      created_at: new Date().toISOString()
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Training amendment added.");
      setTitle("");
      setDescription("");
      setStatus("draft");
      router.refresh();
    }
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm font-medium">
        Title
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
          placeholder="Add CCNA path"
          required
        />
      </label>
      <label className="block text-sm font-medium">
        Description
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
          rows={4}
          placeholder="Explain the amendment and reason for change."
          required
        />
      </label>
      <label className="block text-sm font-medium">
        Status
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        >
          <option value="draft">draft</option>
          <option value="under_review">under_review</option>
          <option value="submitted">submitted</option>
          <option value="approved">approved</option>
        </select>
      </label>
      <button
        type="submit"
        disabled={isSaving}
        className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-mist disabled:opacity-60"
      >
        {isSaving ? "Saving..." : "Add Amendment"}
      </button>
      {message ? <p className="text-sm text-stone">{message}</p> : null}
    </form>
  );
}
