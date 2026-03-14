import Card from "@/components/Card";
import StatusBadge from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";
import { fetchCertifications, fetchCosts, fetchDocuments, fetchLatestAmendment, fetchTimeline } from "@/lib/queries";

export const revalidate = 0;

export default async function TrainingAmendmentsPage() {
  const [amendment, certifications, timeline, costs, documents] = await Promise.all([
    fetchLatestAmendment(),
    fetchCertifications(),
    fetchTimeline(),
    fetchCosts(),
    fetchDocuments()
  ]);

  const phase1Certs = certifications.filter((cert) => cert.plan_type === "approved");
  const phase2Certs = certifications.filter((cert) => cert.plan_type === "proposed");

  const phase1Costs = costs.filter((cost) => cost.phase === "Phase 1");
  const phase2Costs = costs.filter((cost) => cost.phase === "Phase 2");
  const phase1Total = phase1Costs.reduce((sum, item) => sum + (item.amount ?? 0), 0);
  const phase2Total = phase2Costs.reduce((sum, item) => sum + (item.amount ?? 0), 0);
  const overallTotal = phase1Total + phase2Total;

  const employers = amendment?.regional_employers?.split("\n").filter(Boolean) ?? [];
  const salaryRanges = amendment?.salary_ranges?.split("\n").filter(Boolean) ?? [];
  const employmentTargets = amendment?.employment_targets?.split("\n").filter(Boolean) ?? [];

  const supportingDocs = documents.filter((doc) => {
    if (doc.related_type === "amendment" && amendment?.id) {
      return doc.related_id === amendment.id;
    }
    return doc.related_type === "amendment" || doc.related_type === "training_amendment";
  });

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-stone">Plan Updates</p>
        <h2 className="text-3xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
          Training Amendments
        </h2>
        <p className="subtle-text">
          Visible to the owner, employment counselor, and training provider.
        </p>
      </header>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Amendment Overview</h3>
        <Card>
          {amendment ? (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-stone">Current amendment</p>
                  <h4 className="text-2xl font-semibold">{amendment.title}</h4>
                </div>
                <StatusBadge status={amendment.status} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-stone">Applicant</p>
                  <p className="mt-2 text-sm">{amendment.applicant_name ?? "Not set"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-stone">Location</p>
                  <p className="mt-2 text-sm">{amendment.location ?? "Not set"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-stone">Training Focus</p>
                  <p className="mt-2 text-sm">{amendment.training_focus ?? "Not set"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-stone">Document Status</p>
                  <p className="mt-2 text-sm">{amendment.document_status ?? "Not set"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-stone">Created</p>
                  <p className="mt-2 text-sm">{formatDate(amendment.created_at)}</p>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-stone">Summary</p>
                <p className="mt-2 text-sm">{amendment.summary ?? "No summary available."}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-stone">No amendment record found.</p>
          )}
        </Card>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Certification Roadmap (Phase 1 and Phase 2)</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-stone">Phase 1</p>
              <h4 className="text-lg font-semibold mt-2">Completed Foundation</h4>
            </div>
            {phase1Certs.length === 0 ? (
              <p className="text-sm text-stone">No Phase 1 certifications recorded.</p>
            ) : (
              <div className="space-y-3">
                {phase1Certs.map((cert) => (
                  <div key={cert.id} className="rounded-xl border border-black/10 p-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold">{cert.name}</p>
                        <p className="subtle-text">{cert.vendor}</p>
                      </div>
                      <StatusBadge status={cert.status} />
                    </div>
                    <div className="mt-2 text-xs text-stone">
                      Exam date: {formatDate(cert.exam_date)} · Score: {cert.exam_score ?? "—"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
          <Card className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-stone">Phase 2</p>
              <h4 className="text-lg font-semibold mt-2">In Progress / Upcoming</h4>
            </div>
            {phase2Certs.length === 0 ? (
              <p className="text-sm text-stone">No Phase 2 certifications recorded.</p>
            ) : (
              <div className="space-y-3">
                {phase2Certs.map((cert) => (
                  <div key={cert.id} className="rounded-xl border border-black/10 p-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold">{cert.name}</p>
                        <p className="subtle-text">{cert.vendor}</p>
                      </div>
                      <StatusBadge status={cert.status} />
                    </div>
                    <div className="mt-2 text-xs text-stone">Exam date: {formatDate(cert.exam_date)}</div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Certification Timeline</h3>
        <Card className="space-y-3">
          {timeline.length === 0 ? (
            <p className="text-sm text-stone">No timeline entries recorded.</p>
          ) : (
            timeline.map((item) => (
              <div
                key={item.id}
                className="grid gap-2 border-b border-black/5 pb-3 last:border-b-0 last:pb-0 md:grid-cols-[160px_1fr_160px]"
              >
                <div className="text-sm text-stone">{item.date_label ?? "TBD"}</div>
                <div>
                  <p className="text-sm font-semibold">{item.certification}</p>
                  <p className="subtle-text">{item.format ?? "Format not set"}</p>
                </div>
                <div className="text-sm text-stone md:text-right">{item.status ?? "Status not set"}</div>
              </div>
            ))
          )}
        </Card>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Labor Market Demand Summary</h3>
        <Card className="space-y-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-stone">Summary</p>
            <p className="mt-2 text-sm">{amendment?.labor_market_summary ?? "No summary available."}</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-stone">Regional Employers</p>
              {employers.length === 0 ? (
                <p className="mt-2 text-sm text-stone">No employers listed.</p>
              ) : (
                <ul className="mt-2 space-y-1 text-sm">
                  {employers.map((employer) => (
                    <li key={employer}>{employer}</li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-stone">Salary Ranges (MN)</p>
              {salaryRanges.length === 0 ? (
                <p className="mt-2 text-sm text-stone">No salary ranges listed.</p>
              ) : (
                <ul className="mt-2 space-y-1 text-sm">
                  {salaryRanges.map((range) => (
                    <li key={range}>{range}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-stone">Employment Targets</p>
            {employmentTargets.length === 0 ? (
              <p className="mt-2 text-sm text-stone">No targets listed.</p>
            ) : (
              <ul className="mt-2 space-y-1 text-sm">
                {employmentTargets.map((target) => (
                  <li key={target}>{target}</li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Training Cost Breakdown</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-stone">Phase 1</p>
              <h4 className="text-lg font-semibold mt-2">Approved Plan</h4>
            </div>
            {phase1Costs.length === 0 ? (
              <p className="text-sm text-stone">No Phase 1 costs recorded.</p>
            ) : (
              <div className="space-y-3">
                {phase1Costs.map((cost) => (
                  <div key={cost.id} className="rounded-xl border border-black/10 p-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold">{cost.item}</p>
                        <p className="subtle-text">{cost.provider ?? "Provider not set"}</p>
                        <p className="subtle-text">{cost.format ?? "Format not set"}</p>
                        {cost.notes ? <p className="text-xs text-stone mt-2">{cost.notes}</p> : null}
                      </div>
                      <p className="text-sm font-semibold">{formatCurrency(cost.amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>Phase 1 Subtotal</span>
              <span>{formatCurrency(phase1Total)}</span>
            </div>
          </Card>
          <Card className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-stone">Phase 2</p>
              <h4 className="text-lg font-semibold mt-2">Amended Additions</h4>
            </div>
            {phase2Costs.length === 0 ? (
              <p className="text-sm text-stone">No Phase 2 costs recorded.</p>
            ) : (
              <div className="space-y-3">
                {phase2Costs.map((cost) => (
                  <div key={cost.id} className="rounded-xl border border-black/10 p-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold">{cost.item}</p>
                        <p className="subtle-text">{cost.provider ?? "Provider not set"}</p>
                        <p className="subtle-text">
                          {cost.format ?? "Format not set"}
                          {cost.date_label ? ` · ${cost.date_label}` : ""}
                        </p>
                        {cost.notes ? <p className="text-xs text-stone mt-2">{cost.notes}</p> : null}
                      </div>
                      <p className="text-sm font-semibold">{formatCurrency(cost.amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>Phase 2 Subtotal</span>
              <span>{formatCurrency(phase2Total)}</span>
            </div>
          </Card>
        </div>
        <Card className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-stone">Total Training Investment</p>
            <p className="text-2xl font-semibold mt-2">{formatCurrency(overallTotal)}</p>
          </div>
          <p className="text-sm text-stone">{amendment?.cost_disclaimer ?? "Costs are estimates only."}</p>
        </Card>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Supporting Documents</h3>
        <Card className="space-y-3">
          {supportingDocs.length === 0 ? (
            <p className="text-sm text-stone">No supporting documents linked yet.</p>
          ) : (
            supportingDocs.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between border-b border-black/5 pb-3 last:border-b-0 last:pb-0">
                <div>
                  <p className="text-sm font-semibold">{doc.file_name}</p>
                  <p className="subtle-text">{doc.file_type}</p>
                </div>
                <a className="underline text-sm" href={doc.file_url} target="_blank" rel="noreferrer">
                  View
                </a>
              </div>
            ))
          )}
          <p className="text-xs text-stone">
            Link files by setting `related_type` to `amendment` and `related_id` to the amendment ID.
          </p>
        </Card>
      </section>
    </div>
  );
}
