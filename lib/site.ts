export const siteConfig = {
  name: "IAMM",
  url: "https://iammllc.com",
  description:
    "Managed IT, cybersecurity, cloud cost optimization, and AI automation. IT that runs smoothly, stays secure, and scales with you.",
  nav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Plans", href: "/plans" },
    { label: "About", href: "/about" },
    { label: "Assessment", href: "/assessment" },
    { label: "Contact", href: "/contact" },
  ],
};

export const services = [
  {
    icon: "monitor" as const,
    id: "managed-it-services",
    title: "Managed IT Services",
    description: "Keep your everyday technology running smoothly with practical IT support, proactive maintenance, and clear ownership of your systems. IAMM helps manage devices, business applications, user access, and IT planning so your team can stay focused as your business grows.",
    benefits: ["Less IT disruption", "Reliable day-to-day support", "Technology that grows with you"],
    useCases: ["Device and software management", "Employee onboarding and offboarding", "IT maintenance and planning"],
  },
  {
    icon: "shield" as const,
    id: "cybersecurity",
    title: "Cybersecurity",
    description: "Strengthen your defenses with security built around your people, devices, and data. IAMM helps identify gaps, improve access controls, protect endpoints, and prepare recovery plans so your business can reduce risk and respond more confidently to threats.",
    benefits: ["Reduced security risk", "Stronger access controls", "Better recovery readiness"],
    useCases: ["Security assessments", "Endpoint and account protection", "Backup and recovery planning"],
  },
  {
    icon: "cloud" as const,
    id: "cloud-cost-optimization",
    title: "Cloud Cost Optimization",
    description: "Understand where your cloud budget goes and find opportunities to reduce waste without losing sight of performance. IAMM reviews resource usage, service choices, and billing to help right-size your environment and build clearer cost controls.",
    benefits: ["Clearer spending visibility", "Less unused capacity", "Costs aligned with business needs"],
    useCases: ["Cloud billing and usage reviews", "Resource right-sizing", "Budget alerts and cost reporting"],
  },
  {
    icon: "workflow" as const,
    id: "ai-workflow-automation",
    title: "AI & Workflow Automation",
    description: "Simplify repetitive work with connected workflows and practical AI. IAMM combines process optimization, system integrations, and custom AI tools to support lead handling, document processing, reporting, and internal operations, with human review where it matters.",
    benefits: ["Less manual work", "More consistent processes", "Better-connected tools"],
    useCases: ["CRM integrations and follow-ups", "Document processing and approvals", "AI assistants and reporting"],
  },
];
export const processSteps = [
  "Discover",
  "Assess",
  "Implement",
  "Monitor",
  "Scale",
] as const;
