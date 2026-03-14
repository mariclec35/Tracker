"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import StatusBadge from "./StatusBadge";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";
import type { Certification } from "@/lib/types";

type CertificationManagerProps = {
  initialCertifications: Certification[];
};

type CertificationDraft = {
  name: string;
  vendor: string;
  status: Certification["status"];
  exam_date: string;
  exam_score: string;
  completion_date: string;
  plan_type: Certification["plan_type"];
};

const statusOrder: Certification["status"][] = ["complete", "scheduled", "planned"];

function sortCertifications(list: Certification[]) {
  return [...list].sort((a, b) => {
    const statusDiff = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
    if (statusDiff !== 0) return statusDiff;

    if (a.status === "scheduled" && b.status === "scheduled") {
      const aDate = a.exam_date ? new Date(a.exam_date).getTime() : Number.POSITIVE_INFINITY;
      const bDate = b.exam_date ? new Date(b.exam_date).getTime() : Number.POSITIVE_INFINITY;
      return aDate - bDate;
    }

    return a.name.localeCompare(b.name);
  });
}

function createDraftFrom(cert: Certification): CertificationDraft {
  return {
    name: cert.name,
    vendor: cert.vendor,
    status: cert.status,
    exam_date: cert.exam_date ?? "",
    exam_score: cert.exam_score?.toString() ?? "",
    completion_date: cert.completion_date ?? "",
    plan_type: cert.plan_type
  };
}

function validateDraft(draft: CertificationDraft) {
  if (!draft.name.trim()) return "Name is required.";
  if (!draft.vendor.trim()) return "Vendor is required.";
  if (draft.status === "scheduled" && !draft.exam_date) return "Exam date is required for scheduled status.";
  if (draft.status === "complete" && !draft.completion_date) return "Completion date is required for complete status.";
  if (draft.exam_score && Number.isNaN(Number(draft.exam_score))) return "Exam score must be numeric.";
  return null;
}

export default function CertificationManager({ initialCertifications }: CertificationManagerProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<CertificationDraft | null>(null);
  const [newDraft, setNewDraft] = useState<CertificationDraft>({
    name: "",
    vendor: "",
    status: "planned",
    exam_date: "",
    exam_score: "",
    completion_date: "",
    plan_type: "approved"
  });

  const approved = useMemo(
    () => sortCertifications(initialCertifications.filter((cert) => cert.plan_type === "approved")),
    [initialCertifications]
  );
  const proposed = useMemo(
    () => sortCertifications(initialCertifications.filter((cert) => cert.plan_type === "proposed")),
    [initialCertifications]
  );

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    const error = validateDraft(newDraft);
    if (error) {
      setMessage(error);
      return;
    }
    setIsSaving(true);
    const supabase = getSupabaseBrowserClient();
    const payload = {
      name: newDraft.name,
      vendor: newDraft.vendor,
      status: newDraft.status,
      exam_date: newDraft.exam_date || null,
      exam_score: newDraft.exam_score ? Number(newDraft.exam_score) : null,
      completion_date: newDraft.completion_date || null,
      plan_type: newDraft.plan_type
    };

    const { error: insertError } = await supabase.from("certifications").insert(payload);
    if (insertError) {
      setMessage(insertError.message);
    } else {
      setMessage("Certification added.");
      setNewDraft({
        name: "",
        vendor: "",
        status: "planned",
        exam_date: "",
        exam_score: "",
        completion_date: "",
        plan_type: "approved"
      });
      router.refresh();
    }
    setIsSaving(false);
  };

  const startEdit = (cert: Certification) => {
    setEditingId(cert.id);
    setEditDraft(createDraftFrom(cert));
    setMessage(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft(null);
  };

  const handleUpdate = async () => {
    if (!editingId || !editDraft) return;
    const error = validateDraft(editDraft);
    if (error) {
      setMessage(error);
      return;
    }
    setIsSaving(true);
    const supabase = getSupabaseBrowserClient();
    const payload = {
      name: editDraft.name,
      vendor: editDraft.vendor,
      status: editDraft.status,
      exam_date: editDraft.exam_date || null,
      exam_score: editDraft.exam_score ? Number(editDraft.exam_score) : null,
      completion_date: editDraft.completion_date || null,
      plan_type: editDraft.plan_type
    };

    const { error: updateError } = await supabase.from("certifications").update(payload).eq("id", editingId);
    if (updateError) {
      setMessage(updateError.message);
    } else {
      setMessage("Certification updated.");
      cancelEdit();
      router.refresh();
    }
    setIsSaving(false);
  };

  const copyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setMessage("Certification ID copied.");
    } catch {
      setMessage("Copy failed. Please select and copy the ID manually.");
    }
  };

  const renderCard = (cert: Certification) => {
    const isEditing = editingId === cert.id;
    const draft = isEditing ? editDraft : null;

    return (
      <div key={cert.id} className="card-surface p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-semibold">{cert.name}</h4>
              <span className="rounded-full bg-black/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide">
                {cert.plan_type}
              </span>
            </div>
            <p className="subtle-text">{cert.vendor}</p>
          </div>
          <StatusBadge status={cert.status} />
        </div>

        {!isEditing ? (
          <div className="mt-4 space-y-2 text-sm">
            <p>Exam date: {cert.exam_date ?? "Not scheduled"}</p>
            <p>Exam score: {cert.exam_score ?? "Not recorded"}</p>
            <p>Completion: {cert.completion_date ?? "Not completed"}</p>
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
              <span className="text-stone">Related ID: {cert.id}</span>
              <button
                type="button"
                onClick={() => copyId(cert.id)}
                className="rounded-full border border-black/10 px-3 py-1 font-semibold"
              >
                Copy ID
              </button>
              <button
                type="button"
                onClick={() => startEdit(cert)}
                className="rounded-full border border-black/10 px-3 py-1 font-semibold"
              >
                Edit
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-3 text-sm">
            <label className="block">
              Name
              <input
                value={draft?.name ?? ""}
                onChange={(event) =>
                  setEditDraft((prev) => (prev ? { ...prev, name: event.target.value } : prev))
                }
                className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              Vendor
              <input
                value={draft?.vendor ?? ""}
                onChange={(event) =>
                  setEditDraft((prev) => (prev ? { ...prev, vendor: event.target.value } : prev))
                }
                className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
              />
            </label>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="block">
                Status
                <select
                  value={draft?.status ?? "planned"}
                  onChange={(event) =>
                    setEditDraft((prev) =>
                      prev ? { ...prev, status: event.target.value as Certification["status"] } : prev
                    )
                  }
                  className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
                >
                  <option value="complete">complete</option>
                  <option value="scheduled">scheduled</option>
                  <option value="planned">planned</option>
                </select>
              </label>
              <label className="block">
                Plan type
                <select
                  value={draft?.plan_type ?? "approved"}
                  onChange={(event) =>
                    setEditDraft((prev) =>
                      prev ? { ...prev, plan_type: event.target.value as Certification["plan_type"] } : prev
                    )
                  }
                  className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
                >
                  <option value="approved">approved</option>
                  <option value="proposed">proposed</option>
                </select>
              </label>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <label className="block">
                Exam date
                <input
                  type="date"
                  value={draft?.exam_date ?? ""}
                  onChange={(event) =>
                    setEditDraft((prev) => (prev ? { ...prev, exam_date: event.target.value } : prev))
                  }
                  className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                Exam score
                <input
                  type="number"
                  value={draft?.exam_score ?? ""}
                  onChange={(event) =>
                    setEditDraft((prev) => (prev ? { ...prev, exam_score: event.target.value } : prev))
                  }
                  className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                Completion date
                <input
                  type="date"
                  value={draft?.completion_date ?? ""}
                  onChange={(event) =>
                    setEditDraft((prev) => (prev ? { ...prev, completion_date: event.target.value } : prev))
                  }
                  className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
                />
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleUpdate}
                disabled={isSaving}
                className="rounded-lg bg-ink px-4 py-2 text-xs font-semibold text-mist disabled:opacity-60"
              >
                Save
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-lg border border-black/10 px-4 py-2 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-10">
      <div className="card-surface p-6">
        <h3 className="text-lg font-semibold">Add Certification</h3>
        <form onSubmit={handleCreate} className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="block text-sm font-medium">
            Name
            <input
              value={newDraft.name}
              onChange={(event) => setNewDraft((prev) => ({ ...prev, name: event.target.value }))}
              className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
              required
            />
          </label>
          <label className="block text-sm font-medium">
            Vendor
            <input
              value={newDraft.vendor}
              onChange={(event) => setNewDraft((prev) => ({ ...prev, vendor: event.target.value }))}
              className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
              required
            />
          </label>
          <label className="block text-sm font-medium">
            Status
            <select
              value={newDraft.status}
              onChange={(event) =>
                setNewDraft((prev) => ({ ...prev, status: event.target.value as Certification["status"] }))
              }
              className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
            >
              <option value="planned">planned</option>
              <option value="scheduled">scheduled</option>
              <option value="complete">complete</option>
            </select>
          </label>
          <label className="block text-sm font-medium">
            Plan type
            <select
              value={newDraft.plan_type}
              onChange={(event) =>
                setNewDraft((prev) => ({ ...prev, plan_type: event.target.value as Certification["plan_type"] }))
              }
              className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
            >
              <option value="approved">approved</option>
              <option value="proposed">proposed</option>
            </select>
          </label>
          <label className="block text-sm font-medium">
            Exam date
            <input
              type="date"
              value={newDraft.exam_date}
              onChange={(event) => setNewDraft((prev) => ({ ...prev, exam_date: event.target.value }))}
              className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm font-medium">
            Exam score
            <input
              type="number"
              value={newDraft.exam_score}
              onChange={(event) => setNewDraft((prev) => ({ ...prev, exam_score: event.target.value }))}
              className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm font-medium">
            Completion date
            <input
              type="date"
              value={newDraft.completion_date}
              onChange={(event) => setNewDraft((prev) => ({ ...prev, completion_date: event.target.value }))}
              className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
            />
          </label>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-mist disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Add Certification"}
            </button>
          </div>
        </form>
        {message ? <p className="mt-3 text-sm text-stone">{message}</p> : null}
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Approved Training Plan</h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {approved.length === 0 ? <p className="text-sm text-stone">No approved certifications yet.</p> : null}
          {approved.map(renderCard)}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Proposed Training Plan Amendment</h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {proposed.length === 0 ? <p className="text-sm text-stone">No proposed certifications yet.</p> : null}
          {proposed.map(renderCard)}
        </div>
      </div>
    </div>
  );
}
