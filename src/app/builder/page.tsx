import { TemplateEditor } from "@/components/builder/TemplateEditor";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Email Content Studio | Zero Hour",
  description: "Build, customize, score, and dispatch emails with live preview and safety confirmation.",
};

export default function BuilderPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <TemplateEditor />
    </main>
  );
}
