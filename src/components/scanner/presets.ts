export interface PayloadPreset {
  label: string;
  text: string;
}

export const PAYLOAD_PRESETS: PayloadPreset[] = [
  {
    label: "Credit Card & Email",
    text: `Dear John Smith,

Thank you for your recent purchase. Your order #8472 has been confirmed.

Billing details on file:
  Card: 4532-1234-5678-9012 (Visa)
  Email: john.smith@example.com
  Phone: +1 (555) 867-5309
  SSN: 123-45-6789

Your package will be shipped to:
  742 Evergreen Terrace, Springfield, IL 62701

Please contact us at support@acme.com or call 1-800-555-0100.

Best regards,
Acme Corp`,
  },
  {
    label: "Medical Record",
    text: `Patient: Sarah Johnson
DOB: 1985-03-22
SSN: 987-65-4321
Insurance ID: BCB-2021-887634

Visit Date: 2024-11-15
Physician: Dr. Michael Torres, MD
License: TX-98765

Diagnosis: Type 2 Diabetes (ICD-10: E11.9)
Medication: Metformin 500mg twice daily
Contact: sarah.johnson@healthmail.com
Emergency: 214-555-7890`,
  },
  {
    label: "Employee PII",
    text: `EMPLOYEE RECORD — CONFIDENTIAL

Name: Robert Chen
Employee ID: EMP-20241105
Email: r.chen@company.internal
Mobile: +44 7911 123456
Date of Birth: 1990-07-14
NI Number: AB123456C
Salary: £95,000 GBP
Bank: Barclays — Sort: 20-00-00 Acc: 12345678
Home Address: 10 Downing Street, London, SW1A 2AA`,
  },
  {
    label: "Clean Text",
    text: `Meeting Notes — Q4 Planning Session

Agenda:
1. Review quarterly OKRs and key results
2. Identify blockers for the engineering roadmap
3. Align on cross-functional priorities for next sprint
4. Budget allocation for new infrastructure tools

Action Items:
- Schedule follow-up with the product team
- Draft the technical spec for the new API gateway
- Set up load testing environment by end of week

All deliverables should be reviewed in the next standup.`,
  },
];

export const CHAR_LIMIT = 50_000;
