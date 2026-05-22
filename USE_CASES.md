# Use Cases

## 8.1 Developer Workflow

A developer has open simultaneously:
- VS Code with active development
- Terminal running Claude Code or Codex (waiting for approval)
- Another terminal running Gemini CLI
- GitHub PR review page
- Vercel dashboard with a deployment in progress
- Database admin panel
- Local dev server

**DeskKeeper detects:**
- Terminal waiting for AI agent approval input
- Build failed in a terminal
- Tests failed notification
- Vercel deployment completed
- Deployment failed silently
- PR review still pending
- Local server process stopped

**Example notifications:**
- "Codex is waiting for approval in PowerShell."
- "Vercel deployment failed."
- "npm build completed successfully."
- "PR review tab has been open for 45 minutes."

---

## 8.2 AI Creator Workflow

A creator has open:
- Runway or Kling for video generation
- Veed for editing
- ElevenLabs for voiceover
- Canva for thumbnails
- YouTube Studio upload page
- Script document
- Exports folder

**DeskKeeper detects:**
- Video render complete, download ready
- Export failed
- Voiceover generated, download available
- YouTube upload complete but still unpublished
- Caption drafted but not posted
- Thumbnail generated but not attached to video

**Example notifications:**
- "Video render completed. Download is ready."
- "YouTube upload is complete but still unpublished."
- "ElevenLabs voiceover is ready to download."

---

## 8.3 Business Workflow

A business user has open:
- Gmail compose window (draft open)
- CRM with open deal
- Proposal document
- Calendar (meeting just ended)
- LinkedIn message draft

**DeskKeeper detects:**
- Email draft has been open unsent for 30+ minutes
- Proposal edited but not sent
- Meeting ended but CRM page has no update
- LinkedIn message drafted but not sent

**Example notifications:**
- "Proposal email draft is still unsent."
- "CRM update may be pending after your meeting."

---

## 8.4 Form Filling Workflow

User is completing:
- Job application
- Client onboarding form
- Government portal
- Tax form
- Vendor registration
- Payment form

**DeskKeeper detects:**
- Required fields still empty
- Upload done but submit button not clicked
- Form inactive for a long time (session risk)
- Confirmation button visible but not clicked

**Example notification:**
- "Vendor form is still open with submit pending."

---

## 8.5 Upload / Download Workflow

User is uploading:
- Video file to cloud storage
- Document to client portal
- Resume to job board
- Invoice to accounting tool

**DeskKeeper detects:**
- Upload complete, final submit still pending
- Upload failed
- Download ready but not saved
- File exported but not moved to destination

**Example notification:**
- "Upload completed, but final submit button is still pending."

---

## 8.6 Email Draft Workflow

User has started:
- Client follow-up email
- Recruiter reply
- Proposal email
- Stakeholder update

**DeskKeeper detects:**
- Draft saved but not sent
- Attachment missing
- Email compose open for extended time

**Example notification:**
- "Gmail draft is still unsent."

---

## 8.7 Meeting Follow-Up Workflow

User just ended a meeting and has open:
- Meeting notes doc
- CRM contact page
- Follow-up email draft
- Task tracker

**DeskKeeper detects:**
- Notes started but not saved
- Follow-up email drafted but not sent
- Task created but not assigned
- CRM page open with no update activity

**Example notification:**
- "Meeting follow-up draft is still open."

---

## 8.8 Student / Learning Workflow

Student has open:
- Course video
- Assignment submission page
- Code editor
- Browser research tab
- Notes document

**DeskKeeper detects:**
- Assignment page open with pending submission
- Code changed but not submitted
- Quiz unfinished
- Notes open but unsaved for long time

**Example notification:**
- "Assignment page is open and submission appears pending."

---

## 8.9 Personal Admin Workflow

User has open:
- Travel booking checkout page
- Bill payment portal
- Appointment booking page
- Insurance form

**DeskKeeper detects:**
- Checkout not completed
- Booking confirmation still pending
- Payment form open but not submitted
- Required fields still empty

**Example notification:**
- "Travel booking page is still waiting for confirmation."
