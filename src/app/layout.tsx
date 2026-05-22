import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SecureGate | Premium Auth System",
  description: "Secure, fast, and modern authentication layer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="h-screen flex flex-col items-center md:justify-center px-2 md:px-4 py-4 bg-gray-50 overflow-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
