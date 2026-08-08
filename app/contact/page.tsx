import type { Metadata } from "next";

import { ContactSection } from "@/sections/contact-section";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Mark Keneth Bonquin for full stack development opportunities.",
};

export default function ContactPage() {
  return <ContactSection />;
}
