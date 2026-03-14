import { getSupabaseServerClient } from "./supabaseServer";
import type {
  Amendment,
  Certification,
  CostItem,
  DocumentRecord,
  Experience,
  LinkedInStatus,
  Profile,
  ResumeRecord,
  Skill,
  TimelineItem,
  TrainingAmendment
} from "./types";

export async function fetchCertifications() {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from("certifications")
    .select("*")
    .order("plan_type", { ascending: true })
    .order("name", { ascending: true });
  return (data ?? []) as Certification[];
}

export async function fetchResume() {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from("resume").select("*").order("last_updated", { ascending: false }).limit(1);
  return (data?.[0] ?? null) as ResumeRecord | null;
}

export async function fetchProfile() {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from("profile").select("*").order("created_at", { ascending: false }).limit(1);
  return (data?.[0] ?? null) as Profile | null;
}

export async function fetchSkills() {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from("skills").select("*").order("sort_order", { ascending: true });
  return (data ?? []) as Skill[];
}

export async function fetchExperience() {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from("experience").select("*").order("sort_order", { ascending: true });
  return (data ?? []) as Experience[];
}

export async function fetchLinkedInStatus() {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from("linkedin_status")
    .select("*")
    .order("last_reviewed", { ascending: false })
    .limit(1);
  return (data?.[0] ?? null) as LinkedInStatus | null;
}

export async function fetchTrainingAmendments() {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from("training_amendments").select("*").order("created_at", { ascending: false });
  return (data ?? []) as TrainingAmendment[];
}

export async function fetchLatestTrainingAmendment() {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from("training_amendments").select("*").order("created_at", { ascending: false }).limit(1);
  return (data?.[0] ?? null) as TrainingAmendment | null;
}

export async function fetchAmendments() {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from("amendments").select("*").order("created_at", { ascending: false });
  return (data ?? []) as Amendment[];
}

export async function fetchLatestAmendment() {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from("amendments").select("*").order("created_at", { ascending: false }).limit(1);
  return (data?.[0] ?? null) as Amendment | null;
}

export async function fetchTimeline() {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from("timeline").select("*").order("sort_order", { ascending: true });
  return (data ?? []) as TimelineItem[];
}

export async function fetchCosts() {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from("costs").select("*").order("sort_order", { ascending: true });
  return (data ?? []) as CostItem[];
}

export async function fetchDocuments() {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from("documents").select("*").order("uploaded_at", { ascending: false });
  return (data ?? []) as DocumentRecord[];
}

export async function fetchResumeDocuments() {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from("documents")
    .select("*")
    .eq("file_type", "resume")
    .order("uploaded_at", { ascending: false });
  return (data ?? []) as DocumentRecord[];
}

export async function fetchRecentDocuments(limit = 5) {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from("documents")
    .select("*")
    .order("uploaded_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as DocumentRecord[];
}
