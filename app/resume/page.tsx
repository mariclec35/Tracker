import Card from "@/components/Card";
import ResumeManager from "@/components/ResumeManager";
import StatusBadge from "@/components/StatusBadge";
import { fetchCertifications, fetchExperience, fetchProfile, fetchResume, fetchResumeDocuments, fetchSkills } from "@/lib/queries";
import { formatDate } from "@/lib/format";

export const revalidate = 0;

export default async function ResumePage() {
  const [resume, profile, skills, experience, certifications, resumeDocs] = await Promise.all([
    fetchResume(),
    fetchProfile(),
    fetchSkills(),
    fetchExperience(),
    fetchCertifications(),
    fetchResumeDocuments()
  ]);

  const completedCerts = certifications.filter((cert) => cert.status === "complete");
  const plannedCerts = certifications.filter((cert) => cert.status !== "complete");

  const skillsByCategory = skills.reduce<Record<string, string[]>>((acc, skill) => {
    const key = skill.category ?? "Other";
    acc[key] = acc[key] ?? [];
    acc[key].push(skill.skill);
    return acc;
  }, {});

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-stone">Readiness</p>
        <h2 className="text-3xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
          Resume
        </h2>
        <p className="subtle-text">Upload and track the current resume file.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card>
          <ResumeManager initialResume={resume} />
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.2em] text-stone">Last Updated</p>
          <p className="mt-4 text-lg font-semibold">{formatDate(resume?.last_updated ?? null)}</p>
          <div className="mt-3">
            <StatusBadge status={resume?.status ?? null} />
          </div>
        </Card>
      </div>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Profile</h3>
        <Card>
          {profile ? (
            <div className="space-y-4">
              <div>
                <p className="text-2xl font-semibold">{profile.full_name}</p>
                <p className="subtle-text">{profile.location ?? "Location not set"}</p>
              </div>
              <div className="grid gap-2 md:grid-cols-2 text-sm">
                <p>Email: {profile.email ?? "Not set"}</p>
                <p>Phone: {profile.phone ?? "Not set"}</p>
              </div>
              <p className="text-sm">{profile.summary ?? "Summary not available."}</p>
            </div>
          ) : (
            <p className="text-sm text-stone">Profile data not found.</p>
          )}
        </Card>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Certifications</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-stone">Completed</p>
            {completedCerts.length === 0 ? (
              <p className="text-sm text-stone">No completed certifications listed.</p>
            ) : (
              completedCerts.map((cert) => (
                <div key={cert.id} className="border-b border-black/5 pb-3 last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">{cert.name}</p>
                      <p className="subtle-text">{cert.vendor}</p>
                    </div>
                    <StatusBadge status={cert.status} />
                  </div>
                </div>
              ))
            )}
          </Card>
          <Card className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-stone">In Progress / Planned</p>
            {plannedCerts.length === 0 ? (
              <p className="text-sm text-stone">No planned certifications listed.</p>
            ) : (
              plannedCerts.map((cert) => (
                <div key={cert.id} className="border-b border-black/5 pb-3 last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">{cert.name}</p>
                      <p className="subtle-text">{cert.vendor}</p>
                    </div>
                    <StatusBadge status={cert.status} />
                  </div>
                </div>
              ))
            )}
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Technical Skills</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          {Object.keys(skillsByCategory).length === 0 ? (
            <Card>
              <p className="text-sm text-stone">No skills listed.</p>
            </Card>
          ) : (
            Object.entries(skillsByCategory).map(([category, items]) => (
              <Card key={category}>
                <p className="text-xs uppercase tracking-[0.2em] text-stone">{category}</p>
                <ul className="mt-3 space-y-1 text-sm">
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Card>
            ))
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Experience Timeline</h3>
        <Card className="space-y-4">
          {experience.length === 0 ? (
            <p className="text-sm text-stone">No experience entries listed.</p>
          ) : (
            experience.map((role) => (
              <div key={role.id} className="border-b border-black/5 pb-4 last:border-b-0 last:pb-0">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">{role.role}</p>
                    <p className="subtle-text">
                      {role.company ?? "Organization not set"}
                      {role.location ? ` · ${role.location}` : ""}
                    </p>
                  </div>
                  <p className="text-sm text-stone">
                    {role.start_date ?? "Start"} - {role.end_date ?? "Present"}
                  </p>
                </div>
                {role.details ? (
                  <ul className="mt-3 space-y-1 text-sm">
                    {role.details.split("\n").map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))
          )}
        </Card>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Resume Versions</h3>
        <Card className="space-y-3">
          {resumeDocs.length === 0 ? (
            <p className="text-sm text-stone">No resume versions uploaded yet.</p>
          ) : (
            resumeDocs.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between border-b border-black/5 pb-3 last:border-b-0 last:pb-0">
                <div>
                  <p className="text-sm font-semibold">{doc.file_name}</p>
                  <p className="subtle-text">Uploaded {formatDate(doc.uploaded_at)}</p>
                </div>
                <a className="underline text-sm" href={doc.file_url} target="_blank" rel="noreferrer">
                  View
                </a>
              </div>
            ))
          )}
        </Card>
      </section>
    </div>
  );
}
