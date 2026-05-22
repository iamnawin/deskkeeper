# Onboarding Spec

## Purpose

First-run onboarding that introduces DeskKeeper, explains privacy, gets notification permission, and prompts the user to watch their first window.

## Steps

### Step 1: Welcome
- Headline: "Your desktop control tower."
- Subtext: "DeskKeeper watches the windows you choose and tells you what needs attention."
- Visual: Simple dashboard preview or icon
- CTA: "Get Started"

### Step 2: Privacy
- Headline: "Your data stays on your device."
- Points:
  - "DeskKeeper only watches windows you choose — nothing else."
  - "All detection runs locally. Nothing is uploaded by default."
  - "You can pause or stop monitoring anytime."
- CTA: "I understand — continue"

### Step 3: Notifications
- Headline: "Stay informed, not overwhelmed."
- Text: "DeskKeeper sends desktop notifications when something needs your attention. You can control what you're notified about in Settings."
- Action: Request OS notification permission
- CTA: "Allow Notifications" / "Skip for now"

### Step 4: Watch Your First Window
- Headline: "Choose what to watch."
- Show list of currently open windows
- User selects 1–3 windows
- CTA: "Start Watching"

### Step 5: Done
- Headline: "You're all set."
- Text: "DeskKeeper is now running. Check the dashboard to see your watched windows."
- CTA: "Go to Dashboard"

## State

Onboarding completion stored in settings: `onboardingCompleted: boolean`.

If `onboardingCompleted === false` on launch → show onboarding.  
If `onboardingCompleted === true` → go straight to dashboard.

## Skip Option

"Skip setup" link available on each step (except Step 4 — window selection is required to have any value).
