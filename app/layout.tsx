import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

// ✅ Import fonts from next/font/google
import { Roboto } from "next/font/google";
import { Manrope } from "next/font/google";

// ✅ Configure fonts
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"], // 400 for body, 700 for emphasis
  variable: "--font-roboto",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SolveBot - AI Helpdesk Assistant",
  description: "Autonomous AI Help Bot for modern customer support",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${roboto.variable} ${manrope.variable}`}>
        <body className="font-sans flex min-h-screen ">
          {children}
          {/* Toaster */}
        </body>
      </html>
    </ClerkProvider>
  );
}
