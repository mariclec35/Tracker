import Card from "@/components/Card";
import LinkedInManager from "@/components/LinkedInManager";
import { fetchLinkedInStatus } from "@/lib/queries";
import { formatDate } from "@/lib/format";

export const revalidate = 0;

export default async function LinkedInPage() {
  const linkedin = await fetchLinkedInStatus();

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-stone">Professional Profile</p>
        <h2 className="text-3xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
          LinkedIn
        </h2>
        <p className="subtle-text">Track and update the LinkedIn profile status.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card>
          <LinkedInManager initialStatus={linkedin} />
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.2em] text-stone">Last Reviewed</p>
          <p className="mt-4 text-lg font-semibold">{formatDate(linkedin?.last_reviewed ?? null)}</p>
          <p className="subtle-text mt-2">Status: {linkedin?.status ?? "not set"}</p>
        </Card>
      </div>
    </div>
  );
}
