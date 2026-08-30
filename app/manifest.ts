import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "IAMM - AI Automation & Business Workflow Solutions",
    short_name: "IAMM",
    description: "AI automation, workflow optimization, and digital solutions for modern businesses.",
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

