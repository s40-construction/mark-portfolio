import type { Metadata } from "next";

import { SelectedWorks } from "@/sections/selected-works";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected case studies from Mark Keneth Bonquin — full stack projects built to solve real problems.",
};

export default function ProjectsPage() {
  return <SelectedWorks />;
}
