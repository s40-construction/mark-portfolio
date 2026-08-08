import type { Metadata } from "next";

import { EngineeringProcess } from "@/sections/engineering-process";

export const metadata: Metadata = {
  title: "Experience",
  description: "How Mark Keneth Bonquin approaches discovery, design, development, testing, and deployment.",
};

export default function ExperiencePage() {
  return <EngineeringProcess />;
}
