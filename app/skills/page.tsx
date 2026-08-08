import type { Metadata } from "next";

import { TechnologyJournal } from "@/sections/technology-journal";

export const metadata: Metadata = {
  title: "Skills",
  description: "A field guide to the frontend, backend, and tooling behind Mark Keneth Bonquin's work.",
};

export default function SkillsPage() {
  return <TechnologyJournal />;
}
