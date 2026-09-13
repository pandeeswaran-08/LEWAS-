import { createFileRoute } from "@tanstack/react-router";
import { LewasLandingSection } from "@/components/LewasLandingSection";

export const Route = createFileRoute("/lewas")({
  head: () => ({
    meta: [
      { title: "LEWAS — Western Ghats Multi-Agent Landslide Early Warning System" },
      {
        name: "description",
        content:
          "AI-powered real-time landslide monitoring, prediction, and early warning for vulnerable regions of the Western Ghats: Wayanad, Idukki, Nilgiris, and Kodagu.",
      },
      {
        property: "og:title",
        content: "LEWAS — Western Ghats Multi-Agent Landslide Early Warning System",
      },
      {
        property: "og:description",
        content:
          "Autonomous 6-agent AI architecture integrating IMD weather stations, Sentinel-1 InSAR satellite radar, and 100-estimator machine learning for landslide risk mitigation.",
      },
      { property: "og:image", content: "/logo.png" },
    ],
  }),
  component: LewasPage,
});

function LewasPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <LewasLandingSection />
    </div>
  );
}
