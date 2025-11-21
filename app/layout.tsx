import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";

// Load Fonts
const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrains = JetBrains_Mono({ 
  subsets: ["latin"], 
  variable: "--font-jetbrains",
  display: "swap", 
});

export const metadata: Metadata = {
  title: "DONNA AI | Patent Management Platform",
  description: "Automated Patent Docketing & AI Drafting for Indian Attorneys.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Apply font variables to body */}
      <body className={`${jakarta.variable} ${jetbrains.variable} font-sans antialiased bg-slate-50 dark:bg-[#020205] text-slate-900 dark:text-white`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}