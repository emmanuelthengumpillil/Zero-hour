"use client";

import React, { useState } from "react";
import { useAuth } from "../shared/AuthContext";
import { EmailTemplate, EmailLog } from "@/lib/types";
import { LivePreview } from "./LivePreview";
import { ConfirmModal } from "./ConfirmModal";
import {
  Mail,
  Send,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Tag,
  ShieldCheck,
  Wand2,
  FileText,
} from "lucide-react";

export function TemplateEditor() {
  const { templates, setTemplates, user, role, addEmailLog } = useAuth();

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    templates[0]?.id || "welcome-zero-hour"
  );

  const activeTemplate =
    templates.find((t) => t.id === selectedTemplateId) || templates[0];

  const [subject, setSubject] = useState(activeTemplate?.subject || "");
  const [headerText, setHeaderText] = useState(activeTemplate?.headerText || "");
  const [bodyContent, setBodyContent] = useState(activeTemplate?.bodyContent || "");
  const [ctaText, setCtaText] = useState(activeTemplate?.ctaText || "");
  const [ctaUrl, setCtaUrl] = useState(activeTemplate?.ctaUrl || "");

  // Test recipient
  const [recipientName, setRecipientName] = useState(user.name || "Alex Customer");
  const [recipientEmail, setRecipientEmail] = useState(user.email || "alex@example.com");

  // Modal & sending state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccessLog, setSendSuccessLog] = useState<EmailLog | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Python Analytics analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyticsResult, setAnalyticsResult] = useState<any>(null);

  // Switch template
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const tmpl = templates.find((t) => t.id === templateId);
    if (tmpl) {
      setSubject(tmpl.subject);
      setHeaderText(tmpl.headerText);
      setBodyContent(tmpl.bodyContent);
      setCtaText(tmpl.ctaText || "");
      setCtaUrl(tmpl.ctaUrl || "");
      setAnalyticsResult(null);
    }
  };

  // Insert tag at cursor position or append
  const insertTag = (tag: string) => {
    setBodyContent((prev) => prev + ` ${tag} `);
  };

  // Analyze with Python service
  const handleAnalyzeWithPython = async () => {
    setIsAnalyzing(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body: bodyContent }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setAnalyticsResult(json.data);
      }
    } catch (err: any) {
      console.error("Analytics failure:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Pre-send validation & modal trigger
  const handleInitiateSend = () => {
    setErrorMsg(null);
    if (!recipientEmail || !recipientEmail.includes("@")) {
      setErrorMsg("Please enter a valid recipient email address.");
      return;
    }
    if (!subject.trim()) {
      setErrorMsg("Subject line cannot be blank.");
      return;
    }
    if (!bodyContent.trim()) {
      setErrorMsg("Email body cannot be blank.");
      return;
    }

    if (role === "employee") {
      setErrorMsg("Employee role has read-only access. Switch to Business Admin to send campaigns.");
      return;
    }

    // Open confirmation modal
    setIsConfirmOpen(true);
  };

  // Confirmed send execution
  const handleConfirmSend = async () => {
    setIsSending(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail,
          recipientName,
          subject,
          headerText,
          bodyContent,
          ctaText: ctaText || undefined,
          ctaUrl: ctaUrl || undefined,
          templateId: selectedTemplateId,
        }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || "Failed to dispatch email");
      }

      const logRecord: EmailLog = json.data.log;
      addEmailLog(logRecord);
      setSendSuccessLog(logRecord);
      setIsConfirmOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to send email");
      setIsConfirmOpen(false);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Template Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gray-900/60 border border-gray-800">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Mail className="h-5 w-5 text-indigo-400" />
            Email Content Studio & Dispatcher
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Build and test custom email templates with live mobile/desktop preview, deliverability scoring, and safety confirmation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs text-gray-400 font-medium">Template:</label>
          <select
            value={selectedTemplateId}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="rounded-xl border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error or Success notification */}
      {errorMsg && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/30 bg-red-950/40 text-red-300 text-xs">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {sendSuccessLog && (
        <div className="flex items-center justify-between p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 text-emerald-300 text-xs animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <span>
              Email dispatched to <strong>{sendSuccessLog.recipientEmail}</strong>! Status:{" "}
              <span className="uppercase font-mono font-bold">{sendSuccessLog.status}</span>
            </span>
          </div>
          <span className="font-mono text-[11px] text-gray-400">ID: {sendSuccessLog.externalMessageId}</span>
        </div>
      )}

      {/* Editor & Preview Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT: Editor Form */}
        <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-6 space-y-5">
          <div className="border-b border-gray-800 pb-3">
            <h3 className="text-sm font-bold text-white">Template Configuration</h3>
            <p className="text-[11px] text-gray-500">Customize copy, variables, and links</p>
          </div>

          {/* Subject Line */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              Subject Line <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Welcome to Zero Hour, {{name}}!"
              className="w-full rounded-xl border border-gray-800 bg-gray-900 px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Header Banner Text */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              Email Header Title
            </label>
            <input
              type="text"
              value={headerText}
              onChange={(e) => setHeaderText(e.target.value)}
              placeholder="e.g. Welcome to the Platform"
              className="w-full rounded-xl border border-gray-800 bg-gray-900 px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Body Content with Variable Insertion */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-gray-300">
                Body Content <span className="text-rose-400">*</span>
              </label>
              {/* Variable tags quick inserters */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-gray-500 font-mono">Insert:</span>
                <button
                  type="button"
                  onClick={() => insertTag("{{name}}")}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-gray-800 hover:bg-gray-700 text-indigo-300 border border-gray-700"
                >
                  {"{{name}}"}
                </button>
                <button
                  type="button"
                  onClick={() => insertTag("{{email}}")}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-gray-800 hover:bg-gray-700 text-indigo-300 border border-gray-700"
                >
                  {"{{email}}"}
                </button>
                <button
                  type="button"
                  onClick={() => insertTag("{{company}}")}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-gray-800 hover:bg-gray-700 text-indigo-300 border border-gray-700"
                >
                  {"{{company}}"}
                </button>
              </div>
            </div>
            <textarea
              rows={7}
              value={bodyContent}
              onChange={(e) => setBodyContent(e.target.value)}
              className="w-full rounded-xl border border-gray-800 bg-gray-900 p-3.5 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans leading-relaxed"
            />
          </div>

          {/* CTA Button settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                CTA Button Text
              </label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="e.g. Access Portal"
                className="w-full rounded-xl border border-gray-800 bg-gray-900 px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                CTA Target URL
              </label>
              <input
                type="url"
                value={ctaUrl}
                onChange={(e) => setCtaUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl border border-gray-800 bg-gray-900 px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Test Recipient Section */}
          <div className="rounded-xl border border-gray-800/80 bg-gray-900/40 p-4 space-y-3">
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Test Recipient Target
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Recipient Name</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Recipient Email</label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-1.5 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons: Python AI Deliverability Scoring & Send Email */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleAnalyzeWithPython}
              disabled={isAnalyzing}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-purple-500/30 bg-purple-950/30 hover:bg-purple-900/40 text-purple-300 text-xs font-medium transition-colors disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span>{isAnalyzing ? "Analyzing Copy..." : "Analyze Spam & Deliverability (Python)"}</span>
            </button>

            <button
              type="button"
              onClick={handleInitiateSend}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 transition-all"
            >
              <Send className="h-4 w-4" />
              <span>Send Email (Ask Confirmation)</span>
            </button>
          </div>

          {/* Python Analytics Result Box */}
          {analyticsResult && (
            <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                  Deliverability Score:
                </span>
                <span className="text-base font-black text-purple-400 font-mono">
                  {analyticsResult.score}/100
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Risk Level:{" "}
                <span className="font-bold uppercase text-emerald-400">
                  {analyticsResult.risk_level}
                </span>{" "}
                &bull; Word Count: {analyticsResult.word_count}
              </p>
              {analyticsResult.recommendations?.length > 0 && (
                <div className="pt-1 text-[11px] text-purple-200/80 space-y-1">
                  {analyticsResult.recommendations.map((rec: string, i: number) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="text-purple-400">&bull;</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: Live Preview */}
        <div className="h-full">
          <LivePreview
            subject={subject}
            headerText={headerText}
            bodyContent={bodyContent}
            ctaText={ctaText}
            ctaUrl={ctaUrl}
            previewName={recipientName}
            previewEmail={recipientEmail}
          />
        </div>
      </div>

      {/* Confirmation Modal Component */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmSend}
        isSending={isSending}
        recipientEmail={recipientEmail}
        recipientName={recipientName}
        subject={subject}
        headerText={headerText}
        bodySnippet={bodyContent.slice(0, 150) + "..."}
      />
    </div>
  );
}
