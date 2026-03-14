"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StatusBadge from "./StatusBadge";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";
import type { TrainingAmendment } from "@/lib/types";

type TrainingAmendmentManagerProps = {
  initialAmendments: TrainingAmendment[];
  documentCounts: Record<string, number>;
};

type AmendmentDraft = {
  title: string;
  description: string;
  status: TrainingAmendment["status"];
};

export default function TrainingAmendmentManager({ initialAmendments, documentCounts }: TrainingAmendmentManagerProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<AmendmentDraft | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const startEdit = (amendment: TrainingAmendment) => {
    setEditingId(amendment.id);
    setDraft({
      title: amendment.title,
      description: amendment.description,
      status: amendment.status
    });
    setMessage(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft(null);
  };

  const handleUpdate = async (id: string) => {
    if (!draft) return;
    if (!draft.title.trim() || !draft.description.trim()) {
      setMessage("Title and description are required.");
      return;
    }
    setIsSaving(true);
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase
      .from("training_amendments")
      .update({
        title: draft.title,
        description: draft.description,
        status: draft.status
      })
      .eq("id", id);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Amendment updated.");
      cancelEdit();
      router.refresh();
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-4">
      {initialAmendments.length === 0 ? (
        <p className="text-sm text-stone">No amendments recorded yet.</p>
      ) : (
        initialAmendments.map((amendment) => {
          const isEditing = editingId === amendment.id;
          return (
            <div key={amendment.id} className="rounded-xl border border-black/10 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  {!isEditing ? (
                    <>
                      <p className="text-sm font-semibold">{amendment.title}</p>
                      <p className="subtle-text">{amendment.description}</p>
                    </>
                  ) : (
                    <>
                      <label className="block text-sm font-medium">
                        Title
                        <input
                          value={draft?.title ?? ""}
                          onChange={(event) => setDraft((prev) => (prev ? { ...prev, title: event.target.value } : prev))}
                          className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
                        />
                      </label>
                      <label className="block text-sm font-medium">
                        Description
                        <textarea
                          value={draft?.description ?? ""}
                          onChange={(event) =>
                            setDraft((prev) => (prev ? { ...prev, description: event.target.value } : prev))
                          }
                          className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
                          rows={3}
                        />
                      </label>
                    </>
                  )}
                  <p className="subtle-text">Created {new Date(amendment.created_at).toLocaleDateString()}</p>
                  <p className="subtle-text">
                    Related documents: {documentCounts[amendment.id] ?? 0} (use related_type
                    {" = "}training_amendment)
                  </p>
                </div>
                <div className="space-y-3 text-right">
                  {!isEditing ? (
                    <>
                      <StatusBadge status={amendment.status} />
                      <button
                        type="button"
                        onClick={() => startEdit(amendment)}
                        className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold"
                      >
                        Edit
                      </button>
                    </>
                  ) : (
                    <>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-stone">
                        Status
                        <select
                          value={draft?.status ?? "draft"}
                          onChange={(event) =>
                            setDraft((prev) =>
                              prev ? { ...prev, status: event.target.value as TrainingAmendment["status"] } : prev
                            )
                          }
                          className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
                        >
                          <option value="draft">draft</option>
                          <option value="under_review">under_review</option>
                          <option value="submitted">submitted</option>
                          <option value="approved">approved</option>
                        </select>
                      </label>
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => handleUpdate(amendment.id)}
                          disabled={isSaving}
                          className="rounded-lg bg-ink px-3 py-2 text-xs font-semibold text-mist disabled:opacity-60"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="rounded-lg border border-black/10 px-3 py-2 text-xs font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
      {message ? <p className="text-sm text-stone">{message}</p> : null}
    </div>
  );
}
