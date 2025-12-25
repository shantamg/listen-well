# Feature Demos Design

Design for interactive feature demos linked from the documentation site.

## Overview

Create focused, feature-specific demos that complement the main journey demo. Each demo showcases a single mechanism, linked directly from relevant documentation pages.

## File Structure

```
docs-site/static/demo/
├── styles/
│   └── shared.css          # Shared design tokens and components
├── index.html              # Existing journey demo (unchanged)
├── features/
│   ├── index.html          # Demo gallery page
│   ├── inner-work.html
│   ├── cooling-period.html
│   ├── consensual-bridge.html
│   ├── process-explanation.html
│   ├── waiting-states.html
│   ├── accuracy-loops.html
│   ├── attachments.html
│   ├── follow-up.html
│   └── guardrails.html
```

## Shared Styles

Extract styles from existing demo into `shared.css`:
- Color palette (dark theme)
- Typography
- Phone frame component
- Button styles
- Modal components
- Message bubbles
- Input fields
- Animations (typing indicator, transitions)

All demos import this shared file for consistency.

---

## Demo Designs

### 1. Process Explanation

**Purpose:** Show AI explaining all 5 stages before the Compact

**Flow:**
1. AI: "Before we begin, let me walk you through how BeHeard works..."
2. AI explains each stage with simple descriptions
3. Ends with: "Ready to sign the Curiosity Compact?"

**Demonstrates:** Transparency, setting expectations upfront

---

### 2. Inner Work Mode

**Purpose:** Show solo journey without a partner

**Flow:**
1. User selects "I want to work on myself"
2. AI asks about recurring conflict patterns
3. User describes a pattern
4. AI reflects back: "I notice you mentioned feeling unheard in multiple relationships. Would you like to explore that pattern?"
5. Offers reframe exercise

**Demonstrates:** Personal growth mode, pattern recognition, therapeutic insights

---

### 3. Cooling Period Options

**Purpose:** Show full emotional regulation toolkit

**Flow:**
1. Emotional barometer at level 8-9 triggers modal
2. Modal shows three options:
   - "Breathing exercise" → Guided 4-7-8 breathing animation
   - "Grounding exercise" → 5-4-3-2-1 senses prompt
   - "Journal it out" → Private text area to vent
3. After completing exercise, barometer resets
4. User continues conversation

**Demonstrates:** Emotional regulation tools, not just gatekeeping

---

### 4. Waiting States

**Purpose:** Show async-friendly partner waiting experience

**Flow:**
1. Display: "Jordan is in Stage 1 (The Witness)"
2. Show options while waiting:
   - "Review your reflection"
   - "Take a break"
   - "Practice patience" (mindfulness prompt)
3. Update: "Jordan has moved to Stage 2"

**Demonstrates:** Reduces pressure, async-friendly design

---

### 5. Consensual Bridge

**Purpose:** Show explicit consent for sharing

**Flow:**
1. User completes a reflection
2. AI: "Would you like to share this insight with Jordan?"
3. Options: "Share full reflection" / "Share summary only" / "Keep private"
4. If sharing, show preview of what partner will see
5. Partner receives notification

**Demonstrates:** Explicit consent, user control over vulnerability

---

### 6. Accuracy Loops

**Purpose:** Show iterative understanding refinement

**Flow:**
1. AI reflects: "It sounds like you felt dismissed when Jordan interrupted you."
2. Buttons: "That's right" / "Not quite"
3. If "Not quite" → AI: "Help me understand better - what did I miss?"
4. User refines
5. AI reflects again
6. Loop continues until accurate (show 2-3 iterations)

**Demonstrates:** AI earns understanding, doesn't assume

---

### 7. Attachments

**Purpose:** Show multimodal evidence support

**Flow:**
1. User mid-conversation, taps attachment button (paperclip)
2. Options: "Upload screenshot" / "Upload PDF" / "Take photo"
3. Preview of attached file in chat
4. AI: "I see you've shared a screenshot of your text conversation. Let me take a look..."
5. AI references specific content from attachment

**Demonstrates:** Supporting claims with context

---

### 8. Follow-up Check-in

**Purpose:** Show post-agreement accountability

**Flow:**
1. Notification: "It's been 3 days since your agreement with Jordan. How's it going?"
2. Options: "Going well" / "Need to revisit" / "Haven't tried yet"
3. Each path shows appropriate AI response and next steps

**Demonstrates:** Ongoing support, accountability

---

### 9. Guardrails

**Purpose:** Show AI maintaining boundaries

**Scenarios:**

**A - Seeking validation:**
- User: "Just tell me who's right here"
- AI: "I'm not here to judge who's right or wrong. I'm here to help you both feel understood. What would feeling understood look like for you?"

**B - Venting about partner:**
- User: "Jordan is such a narcissist"
- AI: "I hear a lot of frustration. Instead of labels, can you describe a specific moment when you felt hurt by Jordan's actions?"

**C - Attempting to skip stages:**
- User: "Just tell me what to say to fix this"
- AI: "I know you want resolution quickly. But lasting repair comes from understanding first. Let's make sure Jordan feels heard before we move to solutions."

User clicks through each scenario to see AI responses.

**Demonstrates:** Neutrality, redirecting without dismissing, process integrity

---

## Demo Gallery Page

Grid layout with cards for each demo:
- Feature name
- One-line description
- "Try Demo" button

Header links back to main journey demo.

---

## Documentation Linking

### Callout Format

```markdown
:::tip See it in action
[Try the interactive demo →](/demo/features/cooling-period.html)
:::
```

### Doc-to-Demo Mapping

| Doc File | Demo Link |
|----------|-----------|
| `overview/inner-work.md` | inner-work.html |
| `mechanisms/emotional-barometer.md` | cooling-period.html, waiting-states.html |
| `mechanisms/mirror-intervention.md` | process-explanation.html, accuracy-loops.html |
| `mechanisms/consensual-bridge.md` | consensual-bridge.html |
| `mechanisms/guardrails.md` | guardrails.html |
| `stages/stage-4-strategic-repair.md` | follow-up.html |
| `index.md` | Demo gallery link |

### Navbar Update

Add "Demo" item to Docusaurus navbar pointing to `/demo/features/`.

---

## Implementation Order

1. Extract shared styles from existing demo
2. Create demo gallery page
3. Build individual demos (in parallel if possible)
4. Add callout links to doc pages
5. Update navbar

---

[Back to Plans](./index.md)
