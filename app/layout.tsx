

import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "BackHack.dev - Hackathon Betting Powered by AI",
  description: "BackHack.dev provides a prediction market for hackathon results, adding excitement with an AI-agent for odds and resolution. Now live on the Sui Testnet.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={"antialiased font-sans"}>
        <Providers>
          <div className="flex min-h-screen  flex-col bg-gray-950 text-base font-normal text-black w-full">

            <Header />
            <div className="flex-grow">
              {children}
            </div>
            <Footer />

          </div>
        </Providers>

      </body>
    </html>
  );
}
