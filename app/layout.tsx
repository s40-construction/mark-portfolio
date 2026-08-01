import type { Metadata } from "next";
import { PortfolioBackground } from "@/components/background/portfolio-background";
import { EditorialNavigation } from "@/components/navigation/editorial-navigation";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { EditorialScrollSystem } from "@/components/scroll/editorial-scroll-system";
import { GlobalCinematicExperience } from "@/components/experience/global-cinematic-experience";
import { defaultMetadata } from "@/lib/metadata";
import "./globals.css";

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <PortfolioBackground />
        <EditorialNavigation />
        <SmoothScrollProvider>
          <EditorialScrollSystem />
          <div className="app-shell">{children}</div>
          <GlobalCinematicExperience />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
