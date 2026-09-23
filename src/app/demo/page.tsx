import { DragDropBoard } from "@/components/demo/DragDropBoard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Demo | Zero Hour",
  description: "Experience the drag-and-drop pipeline: convert contacts to customers and trigger encrypted welcome emails instantly.",
};

export default function DemoPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <DragDropBoard />
    </main>
  );
}
