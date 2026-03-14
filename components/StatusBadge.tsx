import clsx from "clsx";

type StatusBadgeProps = {
  status: string | null;
};

const statusMap: Record<string, string> = {
  complete: "bg-pine/10 text-pine",
  scheduled: "bg-ocean/10 text-ocean",
  planned: "bg-stone/10 text-stone",
  under_review: "bg-ember/10 text-ember",
  needs_update: "bg-rose/10 text-rose",
  current: "bg-pine/10 text-pine",
  draft: "bg-stone/10 text-stone",
  submitted: "bg-ember/10 text-ember",
  approved: "bg-pine/10 text-pine"
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const label = status ? status.replace(/_/g, " ") : "not set";
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        status ? statusMap[status] ?? "bg-stone/10 text-stone" : "bg-stone/10 text-stone"
      )}
    >
      {label}
    </span>
  );
}
