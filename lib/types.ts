export type Certification = {
  id: string;
  name: string;
  vendor: string;
  status: "complete" | "scheduled" | "planned";
  exam_date: string | null;
  exam_score: number | null;
  completion_date: string | null;
  plan_type: "approved" | "proposed";
};

export type ResumeRecord = {
  id: string;
  file_url: string | null;
  status: "current" | "needs_update";
  last_updated: string | null;
};

export type Profile = {
  id: string;
  full_name: string;
  location: string | null;
  phone: string | null;
  email: string | null;
  summary: string | null;
  created_at: string;
};

export type Skill = {
  id: string;
  category: string | null;
  skill: string;
  sort_order: number | null;
};

export type Experience = {
  id: string;
  role: string;
  company: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  details: string | null;
  category: string | null;
  sort_order: number | null;
};

export type LinkedInStatus = {
  id: string;
  profile_url: string | null;
  status: "current" | "needs_update";
  last_reviewed: string | null;
};

export type TrainingAmendment = {
  id: string;
  title: string;
  description: string;
  status: "draft" | "under_review" | "submitted" | "approved";
  created_at: string;
};

export type Amendment = {
  id: string;
  title: string;
  status: "draft" | "under_review" | "submitted" | "approved";
  applicant_name: string | null;
  location: string | null;
  training_focus: string | null;
  document_status: string | null;
  summary: string | null;
  labor_market_summary: string | null;
  regional_employers: string | null;
  salary_ranges: string | null;
  employment_targets: string | null;
  cost_disclaimer: string | null;
  created_at: string;
};

export type TimelineItem = {
  id: string;
  phase: string | null;
  certification: string;
  date_label: string | null;
  format: string | null;
  status: string | null;
  sort_order: number | null;
};

export type CostItem = {
  id: string;
  phase: string | null;
  item: string;
  provider: string | null;
  format: string | null;
  date_label: string | null;
  notes: string | null;
  amount: number | null;
  sort_order: number | null;
};

export type DocumentRecord = {
  id: string;
  file_name: string;
  file_type: "certificate" | "exam_score" | "resume" | "proposal";
  file_url: string;
  related_type: string | null;
  related_id: string | null;
  uploaded_at: string;
};
