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
      "Automate repetitive decisions, handoffs, and operational workflows with practical AI systems built around your business. IAMM focuses on the daily work that slows teams down, then designs automation that can support intake, routing, follow-ups, reporting, and task coordination without adding unnecessary complexity.",
    benefits: ["Reduce manual work", "Improve consistency", "Accelerate response times"],
    useCases: ["Lead qualification", "Document processing", "Customer support routing"],
  },
  {
    icon: "BP",
    title: "Business Process Automation",
    description:
      "Turn manual, disconnected processes into reliable workflows that move information and tasks without constant supervision. From approvals and onboarding to internal requests and service delivery, IAMM helps structure processes so work moves clearly between people, systems, and decisions.",
    benefits: ["Lower operating friction", "Fewer missed steps", "Better team visibility"],
    useCases: ["Approvals", "Onboarding", "Internal operations"],
  },
  {
    icon: "IN",
    title: "AI Integration",
    description:
      "Connect AI capabilities with the tools your team already uses, from CRMs and forms to dashboards and internal systems. IAMM helps reduce duplicate entry, improve data flow, and make existing platforms more useful by adding intelligent triggers, summaries, enrichment, and workflow actions.",
    benefits: ["Keep current tools", "Avoid duplicate entry", "Make data more useful"],
    useCases: ["CRM enrichment", "Knowledge assistants", "Workflow triggers"],
  },
  {
    icon: "CA",
    title: "Custom AI Solutions",
    description:
      "Design focused AI products and internal tools for use cases that cannot be solved well with off-the-shelf software. IAMM can help shape custom dashboards, copilots, decision-support systems, and workflow tools around the specific way your business operates.",
    benefits: ["Fit your exact workflow", "Control the experience", "Scale with your roadmap"],
    useCases: ["AI copilots", "Decision support", "Operational dashboards"],
  },
  {
    icon: "WO",
    title: "Workflow Optimization",
    description:
      "Analyze how work moves through your business and redesign bottlenecks before automation is introduced. IAMM maps current processes, identifies repeated friction, clarifies ownership, and recommends practical improvements so automation supports a better operating model instead of covering up broken steps.",
    benefits: ["Clearer ownership", "Shorter cycle times", "Cleaner systems"],
    useCases: ["Sales operations", "Service delivery", "Back-office processes"],
  },
  {
    icon: "DT",
    title: "Digital Transformation",
    description:
      "Modernize business operations with practical technology plans, phased implementation, and measurable improvements. IAMM helps businesses move from scattered tools and manual work toward cleaner digital systems that improve customer experience, reporting visibility, and operational scale.",
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
