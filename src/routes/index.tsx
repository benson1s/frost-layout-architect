import { createFileRoute } from "@tanstack/react-router";
import { MomentumApp } from "@/components/MomentumApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Momentum — Make room for real life" },
      { name: "description", content: "A focused social wellbeing experience for habits, activities, lessons, and meaningful connection." },
      { property: "og:title", content: "Momentum — Make room for real life" },
      { property: "og:description", content: "Build intentional habits, discover nearby activities, and connect without the endless feed." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MomentumApp,
});
