import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "IAMM Solutions | Managed IT, Cybersecurity & AI Automation",
    short_name: "IAMM",
    description: "Managed IT, cybersecurity, cloud cost optimization, and AI automation for businesses in the US and UK.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#7dd3fc",
    icons: [
      {
        src: "/icon.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}

