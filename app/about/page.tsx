import type { Metadata } from "next";

import { InterviewSection } from "@/sections/interview-section";

export const metadata: Metadata = {
  title: "About",
  description: "A conversation with Mark Keneth Bonquin on systems, craft, and full stack development.",
};

export default function AboutPage() {
  return <InterviewSection />;
}
