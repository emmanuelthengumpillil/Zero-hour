"use client";

import React, { useState } from "react";
import { Monitor, Smartphone, Mail, Lock } from "lucide-react";
import { interpolateVariables } from "@/lib/security/sanitize";

interface LivePreviewProps {
  subject: string;
  headerText: string;
  bodyContent: string;
  ctaText?: string;
  ctaUrl?: string;
  previewName?: string;
  previewEmail?: string;
}

export function LivePreview({
  subject,
  headerText,
  bodyContent,
  ctaText,
  ctaUrl,
  previewName = "Sarah Jenkins",
  previewEmail = "sarah.jenkins@example.com",
}: LivePreviewProps) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  const variables = {
    name: previewName,
    email: previewEmail,
    company: "Zero Hour",
  };

  const renderedSubject = interpolateVariables(subject, variables);
  const renderedHeader = interpolateVariables(headerText, variables);
  const renderedBody = interpolateVariables(bodyContent, variables);

  return (
    <div className="flex flex-col h-full rounded-2xl border border-gray-800 bg-gray-950/70 p-6 space-y-4">
      {/* Device toggles & title */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-800">
        <div>
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Mail className="h-4 w-4 text-indigo-400" />
            Live Email Preview
          </h3>
          <p className="text-[11px] text-gray-500">Real-time render with dynamic tag interpolation</p>
        </div>

        <div className="flex items-center rounded-lg border border-gray-800 bg-gray-900 p-0.5">
          <button
            onClick={() => setDevice("desktop")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              device === "desktop"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Monitor className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => setDevice("mobile")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              device === "mobile"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>
      </div>

      {/* Simulated Email Client Frame */}
      <div className="flex-1 flex justify-center items-start overflow-y-auto py-2">
        <div
          className={`w-full transition-all duration-300 rounded-xl border border-gray-800 bg-white text-gray-900 shadow-2xl overflow-hidden ${
            device === "mobile" ? "max-w-[340px]" : "max-w-[560px]"
          }`}
        >
          {/* Email client top banner */}
          <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 text-xs space-y-1">
            <div className="flex justify-between items-center text-gray-500 text-[11px]">
              <span>From: <strong>Zero Hour &lt;onboarding@resend.dev&gt;</strong></span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-mono">
                <Lock className="h-2.5 w-2.5" /> TLS 1.3
              </span>
            </div>
            <div className="text-gray-500 text-[11px]">
              To: <strong>{previewName} &lt;{previewEmail}&gt;</strong>
            </div>
            <div className="font-bold text-gray-900 pt-1 text-xs">
              Subject: {renderedSubject || "(No Subject)"}
            </div>
          </div>

          {/* Email Body Content */}
          <div className="p-6 space-y-5">
            {/* Header banner */}
            <div className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-center text-white shadow-md">
              <h1 className="text-lg font-bold tracking-tight">
                {renderedHeader || "Welcome to Zero Hour"}
              </h1>
            </div>

            {/* Body */}
            <div className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line min-h-[140px]">
              {renderedBody || "Your email body will appear here..."}
            </div>

            {/* CTA Button */}
            {ctaText && (
              <div className="text-center pt-2">
                <a
                  href={ctaUrl || "#"}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.preventDefault()}
                  className="inline-block px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20"
                >
                  {ctaText}
                </a>
              </div>
            )}

            <div className="pt-6 border-t border-gray-200 text-center">
              <p className="text-[11px] text-gray-400">
                Zero Hour Automated System &bull; AES-256 Encrypted &bull; Built with Next.js & Resend
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
