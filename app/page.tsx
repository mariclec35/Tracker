import Card from "@/components/Card";
import StatusBadge from "@/components/StatusBadge";
import {
  fetchLatestAmendment,
  fetchCertifications,
  fetchLinkedInStatus,
  fetchRecentDocuments,
  fetchResume
} from "@/lib/queries";
import { formatDate } from "@/lib/format";

export const revalidate = 0;

export default async function DashboardPage() {
  const [certifications, resume, linkedin, latestAmendment, recentDocuments] = await Promise.all([
    fetchCertifications(),
    fetchResume(),
    fetchLinkedInStatus(),
    fetchLatestAmendment(),
    fetchRecentDocuments(5)
  ]);

  const completedCount = certifications.filter((cert) => cert.status === "complete").length;
  const totalCount = certifications.length;
  const nextExam = certifications
    .filter((cert) => cert.status === "scheduled" && cert.exam_date)
    .sort((a, b) => new Date(a.exam_date ?? "").getTime() - new Date(b.exam_date ?? "").getTime())[0];

  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
  const approvedCerts = certifications.filter((cert) => cert.plan_type === "approved");
  const proposedCerts = certifications.filter((cert) => cert.plan_type === "proposed");
  const approvedComplete = approvedCerts.filter((cert) => cert.status === "complete").length;
  const proposedComplete = proposedCerts.filter((cert) => cert.status === "complete").length;

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-stone">Overview</p>
        <h2 className="text-3xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
          Dashboard
        </h2>
        <p className="subtle-text">A focused view of current progress across certifications, resume, and LinkedIn.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Card>
          <p className="text-xs uppercase tracking-[0.2em] text-stone">Certifications Complete</p>
          <p className="mt-4 text-3xl font-semibold">{completedCount}</p>
          <p className="subtle-text mt-2">of {totalCount} total</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.2em] text-stone">Next Exam</p>
          <p className="mt-4 text-lg font-semibold">{nextExam?.name ?? "Not scheduled"}</p>
          <p className="subtle-text mt-2">{formatDate(nextExam?.exam_date ?? null)}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.2em] text-stone">Resume Status</p>
          <div className="mt-4">
            <StatusBadge status={resume?.status ?? null} />
          </div>
          <p className="subtle-text mt-3">Updated {formatDate(resume?.last_updated ?? null)}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.2em] text-stone">LinkedIn Status</p>
          <div className="mt-4">
            <StatusBadge status={linkedin?.status ?? null} />
          </div>
          <p className="subtle-text mt-3">Reviewed {formatDate(linkedin?.last_reviewed ?? null)}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.2em] text-stone">Training Amendment</p>
          <div className="mt-4">
            <StatusBadge status={latestAmendment?.status ?? null} />
          </div>
          <p className="subtle-text mt-3">{latestAmendment?.title ?? "No amendments yet"}</p>
        </Card>
      </section>

      <section className="card-surface p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-stone">Certification Pathway</p>
            <h3 className="text-xl font-semibold mt-2">Progress</h3>
            <p className="subtle-text mt-1">
              {completedCount} complete, {totalCount - completedCount} remaining
            </p>
          </div>
          <div className="text-3xl font-semibold">{progressPercent}%</div>
        </div>
        <div className="mt-6 h-3 rounded-full bg-black/10 overflow-hidden">
          <div className="h-full bg-ink" style={{ width: `${progressPercent}%` }} />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <p className="text-xs uppercase tracking-[0.2em] text-stone">Approved Plan</p>
            <p className="mt-4 text-2xl font-semibold">
              {approvedComplete} of {approvedCerts.length}
            </p>
            <p className="subtle-text mt-2">Completed certifications</p>
          </Card>
          <Card>
            <p className="text-xs uppercase tracking-[0.2em] text-stone">Proposed Plan</p>
            <p className="mt-4 text-2xl font-semibold">
              {proposedComplete} of {proposedCerts.length}
            </p>
            <p className="subtle-text mt-2">Completed certifications</p>
          </Card>
        </div>
        <Card>
          <p className="text-xs uppercase tracking-[0.2em] text-stone">Recent Documents</p>
          <div className="mt-4 space-y-3 text-sm">
            {recentDocuments.length === 0 ? (
              <p className="text-stone">No documents uploaded yet.</p>
            ) : (
              recentDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{doc.file_name}</p>
                    <p className="subtle-text">{doc.file_type}</p>
                  </div>
                  <a className="underline" href={doc.file_url} target="_blank" rel="noreferrer">
                    View
                  </a>
                </div>
              ))
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}
