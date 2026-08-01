import { HomeHero } from "@/sections/home-hero";
import { InterviewSection } from "@/sections/interview-section";
import { TechnologyJournal } from "@/sections/technology-journal";
import { DeveloperWorkspace } from "@/sections/developer-workspace";
import { EngineeringProcess } from "@/sections/engineering-process";
import { SelectedWorks } from "@/sections/selected-works";

export default function Home() {
  return (
    <>
      <HomeHero />
      <InterviewSection />
      <TechnologyJournal />
      <DeveloperWorkspace />
      <EngineeringProcess />
      <SelectedWorks />
    </>
  );
}
