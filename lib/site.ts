export const siteConfig = {
  name: "IAMM",
  url: "https://iamm.ai",
  description:
    "AI automation and digital solutions for businesses ready to improve operations, customer experience, and scale.",
  nav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Assessment", href: "/assessment" },
    { label: "Contact", href: "/contact" },
  ],
};

export const services = [
  {
    icon: "AI",
    title: "AI Automation",
    description:
      "Automate repetitive decisions, handoffs, and operational workflows with practical AI systems built around your business.",
    benefits: ["Reduce manual work", "Improve consistency", "Accelerate response times"],
    useCases: ["Lead qualification", "Document processing", "Customer support routing"],
  },
  {
    icon: "BP",
    title: "Business Process Automation",
    description:
      "Turn manual, disconnected processes into reliable workflows that move information and tasks without constant supervision.",
    benefits: ["Lower operating friction", "Fewer missed steps", "Better team visibility"],
    useCases: ["Approvals", "Onboarding", "Internal operations"],
  },
  {
    icon: "IN",
    title: "AI Integration",
    description:
      "Connect AI capabilities with the tools your team already uses, from CRMs and forms to dashboards and internal systems.",
    benefits: ["Keep current tools", "Avoid duplicate entry", "Make data more useful"],
    useCases: ["CRM enrichment", "Knowledge assistants", "Workflow triggers"],
  },
  {
    icon: "CA",
    title: "Custom AI Solutions",
    description:
      "Design focused AI products and internal tools for use cases that cannot be solved well with off-the-shelf software.",
    benefits: ["Fit your exact workflow", "Control the experience", "Scale with your roadmap"],
    useCases: ["AI copilots", "Decision support", "Operational dashboards"],
  },
  {
    icon: "WO",
    title: "Workflow Optimization",
    description:
      "Analyze how work moves through your business and redesign bottlenecks before automation is introduced.",
    benefits: ["Clearer ownership", "Shorter cycle times", "Cleaner systems"],
    useCases: ["Sales operations", "Service delivery", "Back-office processes"],
  },
  {
    icon: "DT",
    title: "Digital Transformation",
    description:
      "Modernize business operations with practical technology plans, phased implementation, and measurable improvements.",
    benefits: ["Practical roadmap", "Less operational drag", "Better customer experience"],
    useCases: ["Legacy process upgrades", "Digital service design", "Data visibility"],
  },
];

export const processSteps = [
  "Discover",
  "Analyze",
  "Automate",
  "Optimize",
  "Scale",
] as const;
