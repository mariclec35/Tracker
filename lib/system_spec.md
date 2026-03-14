# IT Career Transition Dashboard — System Specification

## 1. System Overview

The IT Career Transition Dashboard is a lightweight web application designed to track progress during a transition into the information technology industry.

The system tracks certification progress, resume readiness, LinkedIn profile status, training plan amendments, and supporting documents.

The application must remain simple and avoid unnecessary complexity.

Primary user: Christopher Maricle

Stakeholders:

* Employment Counselor
* Training Provider

Recruiter access is not required in the first version.

---

## 2. Technology Stack

Frontend: Next.js (React)
Backend: Supabase
Database: PostgreSQL
File Storage: Supabase Storage
Authentication: Email login
Deployment: Vercel

---

## 3. Application Pages

The application must contain the following pages:

Dashboard
Certifications
Resume
LinkedIn
Training Amendments
Documents

Navigation should be a left sidebar layout.

---

## 4. Dashboard

The dashboard displays the following information:

* Total certifications completed
* Next scheduled exam
* Resume status
* LinkedIn status
* Training amendment status

Display these as simple dashboard cards.

---

## 5. Certification Tracking

Certifications are separated into two groups.

Approved Training Plan:

* Network+
* Security+
* Cloud+

Proposed Training Plan Amendment:

* CCNA
* AWS Solutions Architect Associate
* Azure Fundamentals

Each certification must store:

* name
* vendor
* status (complete, scheduled, planned)
* exam_date
* exam_score
* completion_date
* plan_type (approved or proposed)

---

## 6. Resume Tracking

The system must allow uploading and tracking the current resume.

Fields:

* file_url
* status (current or needs_update)
* last_updated

---

## 7. LinkedIn Tracking

Store the LinkedIn profile URL and review status.

Fields:

* profile_url
* status (current or needs_update)
* last_reviewed

---

## 8. Training Plan Amendments

Track proposed changes to the approved training pathway.

Fields:

* title
* description
* status (draft, under_review, submitted, approved)
* created_at

This page is only visible to the owner, employment counselor, and training provider.

---

## 9. Documents

The system must support file uploads for:

* certificates
* exam score reports
* resumes
* training proposal documents

Each document must store:

* file_name
* file_type
* file_url
* related_type
* related_id
* uploaded_at

---

## 10. Database Tables

users
certifications
resume
linkedin_status
training_amendments
documents

---

## 11. UI Design Guidelines

The UI must remain simple and minimal.

Use status badges for progress.

Color indicators:

Green: Complete
Blue: Scheduled
Gray: Planned
Orange: Under Review
Red: Needs Update

Avoid complex analytics or unnecessary features.

---

## 12. Constraints

The system must remain lightweight.

Do not implement:

* complex analytics
* workflow engines
* recruiter portals
* unnecessary automation

This system is a simple progress tracking dashboard.
