import CertificationManager from "@/components/CertificationManager";
import { fetchCertifications } from "@/lib/queries";

export const revalidate = 0;

export default async function CertificationsPage() {
  const certifications = await fetchCertifications();

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-stone">Progress</p>
        <h2 className="text-3xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
          Certifications
        </h2>
        <p className="subtle-text">
          Approved certifications: Network+, Security+, Cloud+. Proposed amendments: CCNA, AWS Solutions Architect
          Associate, Azure Fundamentals.
        </p>
      </header>

      <CertificationManager initialCertifications={certifications} />
    </div>
  );
}
