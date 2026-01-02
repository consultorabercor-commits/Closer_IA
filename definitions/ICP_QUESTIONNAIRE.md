# ICP Questionnaire – Closers AI

This questionnaire trains the Day Agent (Closer AI) to find and qualify ideal customers.

---

## Section 1: Business Context

### 1.1 What industry does your business operate in?
- Technology / SaaS
- Professional Services (Consulting, Legal, Accounting)
- Healthcare / Medical
- Real Estate
- Marketing / Advertising
- E-commerce / Retail
- Finance / Insurance
- Education
- Manufacturing
- Other: ___________

### 1.2 What type of offer are you selling?
- Software / Platform
- Consulting Services
- Physical Product
- Digital Product / Course
- Managed Service
- Other: ___________

### 1.3 Is your business model B2B or B2C?
- B2B (Business to Business)
- B2C (Business to Consumer)

---

## Section 2: Ideal Customer Profile

### 2.1 What job titles or roles should the agent target?
Examples: CEO, Marketing Director, VP of Sales, Founder, HR Manager
- Primary role: ___________
- Secondary roles: ___________

### 2.2 What company size are you targeting?
- Solo / Freelancer (1 person)
- Small (2-10 employees)
- Medium (11-50 employees)
- Growth (51-200 employees)
- Enterprise (200+ employees)

### 2.3 What geographic locations?
- United States only
- North America
- Europe
- Latin America
- Global
- Specific regions: ___________

### 2.4 What keywords describe your ideal customer?
List 3-5 keywords that would appear in their profile or posts:
1. ___________
2. ___________
3. ___________
4. ___________
5. ___________

### 2.5 What pain points does your ideal customer have?
List the top 3 problems they want to solve:
1. ___________
2. ___________
3. ___________

---

## Section 3: Search Rules

### 3.1 Which platforms should the agent search?
- [ ] LinkedIn
- [ ] Instagram
- [ ] Both

### 3.2 Must-have signals (profiles MUST show these to qualify)
Examples: "hiring", "growth", specific job changes, certain hashtags
1. ___________
2. ___________
3. ___________

### 3.3 Must-NOT-have signals (disqualify if present)
Examples: "not hiring", competitor mentions, irrelevant industries
1. ___________
2. ___________
3. ___________

---

## Section 4: Contact Strategy

### 4.1 What tone should the agent use?
- Formal (professional, structured)
- Casual (friendly, conversational)
- Direct (straight to the point)

### 4.2 What is the goal of the first contact?
- Start a conversation (softer approach)
- Request a meeting (direct approach)

### 4.3 What type of call-to-action?
- Soft CTA ("Would love to hear your thoughts on...")
- Direct CTA ("Would you be open to a quick call this week?")

---

## Output Format

This questionnaire maps directly to the `JobInput` schema:

```json
{
  "business_context": {
    "industry": "<section 1.1>",
    "offer_type": "<section 1.2>",
    "b2b_or_b2c": "<section 1.3>"
  },
  "ideal_customer": {
    "role": "<section 2.1>",
    "company_size": "<section 2.2>",
    "location": "<section 2.3>",
    "keywords": ["<section 2.4>"],
    "pain_points": ["<section 2.5>"]
  },
  "search_rules": {
    "platforms": ["<section 3.1>"],
    "must_have_signals": ["<section 3.2>"],
    "must_not_have_signals": ["<section 3.3>"]
  },
  "contact_strategy": {
    "tone": "<section 4.1>",
    "goal": "<section 4.2>",
    "cta_type": "<section 4.3>"
  }
}
```
