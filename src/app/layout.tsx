import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/shared/AuthContext";
import { Navbar } from "@/components/shared/Navbar";

export const metadata: Metadata = {
  title: "Zero Hour - Real-Time Enterprise Email Engagement",
  description:
    "Production-ready Next.js, Python, Supabase, and Resend engagement platform with fine-grained RBAC and AES-256 data protection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-950 text-gray-100 min-h-screen flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
        <AuthProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <footer className="border-t border-gray-900 bg-gray-950/80 py-6 text-center text-xs text-gray-500 font-mono">
            Zero Hour Platform &bull; Built with Next.js, Resend, Supabase & Python &bull; Encrypted AES-256-GCM &bull; TLS 1.3
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
