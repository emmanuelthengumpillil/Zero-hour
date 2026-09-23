"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Contact, EmailLog } from "@/lib/types";
import { useAuth } from "../shared/AuthContext";
import { ContactCard } from "./ContactCard";
import {
  Users,
  UserCheck,
  Send,
  Sparkles,
  RefreshCw,
  MailCheck,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

export function DragDropBoard() {
  const { user, contacts, setContacts, templates, addEmailLog, emailLogs, role } = useAuth();
  const [isOverCustomers, setIsOverCustomers] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [lastDispatched, setLastDispatched] = useState<EmailLog | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Contacts list including current user if not already present
  const allContacts = React.useMemo(() => {
    const hasUser = contacts.some((c) => c.email === user.email);
    if (!hasUser) {
      const userCard: Contact = {
        id: "current-user-card",
        name: user.name,
        email: user.email,
        company: user.businessName || "Zero Hour Member",
        status: "contact",
        addedAt: new Date().toISOString(),
      };
      return [userCard, ...contacts];
    }
    return contacts;
  }, [contacts, user]);

  const contactsBox = allContacts.filter((c) => c.status === "contact");
  const customersBox = allContacts.filter((c) => c.status === "customer");

  // Welcome email template
  const welcomeTemplate =
    templates.find((t) => t.id === "welcome-zero-hour") || templates[0];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsOverCustomers(true);
  };

  const handleDragLeave = () => {
    setIsOverCustomers(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsOverCustomers(false);
    setErrorMsg(null);

    const rawData = e.dataTransfer.getData("application/json");
    if (!rawData) return;

    let droppedContact: Contact;
    try {
      droppedContact = JSON.parse(rawData);
    } catch {
      return;
    }

    if (droppedContact.status === "customer") return;

    // Check RBAC permission for sending emails
    if (role === "employee") {
      setErrorMsg("Employee role has read-only demo access. Switch to Business Admin or Software Owner to trigger emails.");
      return;
    }

    setIsSending(true);

    try {
      // 1. Move to customers box
      setContacts((prev) => {
        const existing = prev.find((c) => c.id === droppedContact.id);
        if (existing) {
          return prev.map((c) =>
            c.id === droppedContact.id
              ? { ...c, status: "customer", convertedAt: new Date().toISOString() }
              : c
          );
        } else {
          return [
            ...prev,
            { ...droppedContact, status: "customer", convertedAt: new Date().toISOString() },
          ];
        }
      });

      // 2. Dispatch Welcome Email via /api/email/send
      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail: droppedContact.email,
          recipientName: droppedContact.name,
          subject: welcomeTemplate.subject,
          headerText: welcomeTemplate.headerText,
          bodyContent: welcomeTemplate.bodyContent,
          ctaText: welcomeTemplate.ctaText,
          ctaUrl: welcomeTemplate.ctaUrl,
          templateId: welcomeTemplate.id,
        }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || "Failed to dispatch email");
      }

      const logRecord: EmailLog = json.data.log;
      addEmailLog(logRecord);
      setLastDispatched(logRecord);

      // 3. Celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#6366f1", "#a855f7", "#10b981"],
        });
      } catch {
        // Safe fail
      }
    } catch (err: any) {
      console.error("Drop trigger error:", err);
      setErrorMsg(err.message || "Failed to trigger email");
    } finally {
      setIsSending(false);
    }
  };

  const handleReset = () => {
    setContacts((prev) =>
      prev.map((c) => ({
        ...c,
        status: "contact",
        convertedAt: undefined,
      }))
    );
    setLastDispatched(null);
    setErrorMsg(null);
  };

  return (
    <div className="space-y-8">
      {/* Header controls & instructions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gray-900/60 border border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Zero Hour Interactive Drag-and-Drop Pipeline
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Drag any card from <strong className="text-indigo-400">Contacts</strong> into{" "}
            <strong className="text-emerald-400">Customers</strong> to automatically trigger an encrypted
            welcome email flow.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/builder"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-500/40 bg-indigo-600/10 hover:bg-indigo-600/20 text-xs font-medium text-indigo-300 transition-colors"
          >
            <span>Customize Welcome Email</span>
            <ExternalLink className="h-3 w-3" />
          </Link>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-700 bg-gray-800 hover:bg-gray-700 text-xs font-medium text-gray-300 transition-colors"
            title="Reset contacts back to initial state"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Error alert if any */}
      {errorMsg && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/30 bg-red-950/40 text-red-300 text-xs">
          <ShieldAlert className="h-5 w-5 text-red-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 2-Box Board Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BOX 1: CONTACTS */}
        <div className="flex flex-col rounded-2xl border border-gray-800 bg-gray-950/70 p-6 min-h-[420px]">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">1. Contacts</h3>
                <p className="text-[11px] text-gray-500">Unconverted prospects & leads</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-gray-800 text-gray-300 border border-gray-700">
              {contactsBox.length} Available
            </span>
          </div>

          {/* Cards container */}
          <div className="space-y-3 flex-1 overflow-y-auto max-h-[480px] pr-1">
            {contactsBox.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-800 rounded-xl text-gray-500">
                <Users className="h-8 w-8 mb-2 opacity-40" />
                <p className="text-xs font-medium">All contacts have been converted to Customers!</p>
                <button
                  onClick={handleReset}
                  className="mt-3 text-xs text-indigo-400 hover:underline"
                >
                  Click here to reset the pipeline
                </button>
              </div>
            ) : (
              contactsBox.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  isCurrentUser={contact.email === user.email}
                />
              ))
            )}
          </div>
        </div>

        {/* BOX 2: CUSTOMERS (DROP TARGET) */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col rounded-2xl border-2 transition-all duration-300 p-6 min-h-[420px] ${
            isOverCustomers
              ? "border-emerald-500 bg-emerald-950/30 scale-[1.01] shadow-2xl shadow-emerald-500/20"
              : "border-gray-800 bg-gray-950/70"
          }`}
        >
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <UserCheck className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">2. Customers</h3>
                <p className="text-[11px] text-gray-500">Drop here to convert & dispatch email</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
              {customersBox.length} Converted
            </span>
          </div>

          {/* Drop target area */}
          <div className="space-y-3 flex-1 overflow-y-auto max-h-[480px] pr-1">
            {customersBox.length === 0 ? (
              <div
                className={`h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-xl transition-colors ${
                  isOverCustomers
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                    : "border-gray-800 text-gray-500"
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 mb-3 animate-bounce">
                  <ArrowRight className="h-6 w-6 rotate-90 lg:rotate-0" />
                </div>
                <p className="text-sm font-semibold text-white">Drop your card here</p>
                <p className="text-xs text-gray-400 max-w-xs mt-1">
                  Drag your name card from the left box into this area to instantly trigger the Welcome to Zero Hour email!
                </p>
              </div>
            ) : (
              customersBox.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  isCurrentUser={contact.email === user.email}
                />
              ))
            )}
          </div>

          {/* Active Sending State Overlay */}
          {isSending && (
            <div className="mt-4 flex items-center justify-center gap-3 p-3 rounded-xl bg-indigo-950/80 border border-indigo-700 text-indigo-300 text-xs animate-pulse">
              <Send className="h-4 w-4 animate-spin text-indigo-400" />
              <span>Encrypting payload (AES-256) & dispatching welcome email via Resend...</span>
            </div>
          )}
        </div>
      </div>

      {/* Real-time Email Dispatch Telemetry Card */}
      {lastDispatched && (
        <div className="p-5 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-white">
                    Email Successfully Dispatched!
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-900/60 text-emerald-300 border border-emerald-700">
                    {lastDispatched.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  Sent to <strong className="text-white">{lastDispatched.recipientName}</strong> (
                  {lastDispatched.recipientEmail}) &bull; Subject: &ldquo;{lastDispatched.subject}&rdquo;
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Payload: AES-256 Encrypted</span>
              </div>
              <span className="text-gray-600">|</span>
              <span className="text-[11px] text-gray-500">ID: {lastDispatched.externalMessageId}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
