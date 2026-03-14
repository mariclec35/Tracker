"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StatusBadge from "./StatusBadge";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";
import type { LinkedInStatus } from "@/lib/types";

type LinkedInManagerProps = {
  initialStatus: LinkedInStatus | null;
};

export default function LinkedInManager({ initialStatus }: LinkedInManagerProps) {
  const router = useRouter();
  const [profileUrl, setProfileUrl] = useState(initialStatus?.profile_url ?? "");
  const [status, setStatus] = useState<LinkedInStatus["status"]>(initialStatus?.status ?? "needs_update");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);
    if (profileUrl) {
      try {
        new URL(profileUrl);
      } catch {
        setMessage("Enter a valid LinkedIn URL.");
        setIsSaving(false);
        return;
      }
    }
    const supabase = getSupabaseBrowserClient();

    const payload: {
      id?: string;
      profile_url: string | null;
      status: LinkedInStatus["status"];
      last_reviewed: string;
    } = {
      profile_url: profileUrl || null,
      status,
      last_reviewed: new Date().toISOString()
    };

    if (initialStatus?.id) {
      payload.id = initialStatus.id;
    }

    const { error } = await supabase.from("linkedin_status").upsert(payload, { onConflict: "id" });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("LinkedIn status updated.");
      router.refresh();
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-stone">Current status</p>
          <div className="mt-2">
            <StatusBadge status={initialStatus?.status ?? null} />
          </div>
        </div>
        {initialStatus?.profile_url ? (
          <a className="text-sm font-semibold underline" href={initialStatus.profile_url} target="_blank" rel="noreferrer">
            Open Profile
          </a>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium">
          Profile URL
          <input
            type="url"
            value={profileUrl}
            onChange={(event) => setProfileUrl(event.target.value)}
            placeholder="https://www.linkedin.com/in/username"
            className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
        </label>

        <label className="block text-sm font-medium">
          Status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as LinkedInStatus["status"])}
            className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
          >
            <option value="current">current</option>
            <option value="needs_update">needs_update</option>
          </select>
        </label>

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-mist disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save LinkedIn Status"}
        </button>

        {message ? <p className="text-sm text-stone">{message}</p> : null}
      </form>
    </div>
  );
}
