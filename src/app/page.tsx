"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/components/shared/AuthContext";
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  Building,
  Users,
  Mail,
  Lock,
  Cpu,
  RefreshCw,
  Sparkles,
  CheckCircle,
} from "lucide-react";

export default function HomePage() {
  const { setRole } = useAuth();

  return (
    <div className="relative overflow-hidden py-12 lg:py-20">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/40 text-xs font-mono text-indigo-300">
            <Zap className="h-3.5 w-3.5 fill-current" />
            <span>Enterprise Email Pipeline &bull; Resend & Supabase & Python</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
            Welcome to <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Zero Hour</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
            A production-ready engagement platform. Drag contacts to customers to trigger real-time encrypted welcome emails, craft custom campaigns with live preview, and govern team access with fine-grained 3-tier RBAC.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/demo"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 transition-all hover:scale-105"
            >
              <span>Launch Interactive Demo</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/builder"
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-700 bg-gray-900/80 hover:bg-gray-800 text-gray-300 font-semibold text-sm transition-all"
            >
              <Mail className="h-4 w-4" />
              <span>Email Content Studio</span>
            </Link>
          </div>
        </div>

        {/* 3-Tier RBAC Role Showcase */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Fine-Grained Role-Based Access Control (RBAC)
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Select any role below to experience tailored permissions and interface capabilities:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Level 1 */}
            <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-6 flex flex-col justify-between space-y-4 hover:border-purple-500/60 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Level 1
                  </span>
                  <ShieldCheck className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="font-bold text-base text-white">Software Owner</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Full superuser control over all business tenant accounts, global audit logs, circuit breaker state telemetry, and platform-wide metrics.
                </p>
              </div>

              <Link
                href="/dashboard/owner"
                onClick={() => setRole("software_owner")}
                className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/50 border border-purple-700 text-xs font-semibold text-purple-200 transition-colors"
              >
                <span>Enter as Software Owner</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Level 2 */}
            <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-6 flex flex-col justify-between space-y-4 hover:border-indigo-500/60 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Level 2
                  </span>
                  <Building className="h-5 w-5 text-indigo-400" />
                </div>
                <h3 className="font-bold text-base text-white">Business Owner / Admin</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Plays with the drag-and-drop demo pipeline, builds email templates, dispatches campaigns with safety confirmations, and delegates employees.
                </p>
              </div>

              <Link
                href="/dashboard/admin"
                onClick={() => setRole("business_admin")}
                className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-indigo-900/40 hover:bg-indigo-800/50 border border-indigo-700 text-xs font-semibold text-indigo-200 transition-colors"
              >
                <span>Enter as Business Admin</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Level 3 */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 flex flex-col justify-between space-y-4 hover:border-emerald-500/60 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Level 3
                  </span>
                  <Users className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="font-bold text-base text-white">Employee</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Operational scoped access to add new contact prospects into the pipeline, view customer directory, and inspect email delivery logs.
                </p>
              </div>

              <Link
                href="/dashboard/employee"
                onClick={() => setRole("employee")}
                className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-emerald-900/40 hover:bg-emerald-800/50 border border-emerald-700 text-xs font-semibold text-emerald-200 transition-colors"
              >
                <span>Enter as Employee</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Production-Ready Engineering Architecture Pillars */}
        <div className="rounded-3xl border border-gray-800 bg-gray-950/80 p-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-xl font-bold text-white">Production-Ready Reliability & Security</h3>
            <p className="text-xs text-gray-400">
              Engineered according to strict enterprise resilience and zero-trust standards
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold">
                <Lock className="h-4 w-4" />
                <span>Data Protection</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Sensitive email payloads encrypted at rest using AES-256-GCM. TLS 1.3 enforced for in-transit communication with zero plain-text leaks.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-purple-400 text-sm font-semibold">
                <ShieldCheck className="h-4 w-4" />
                <span>Input Sanitization</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Zod schema validation across all API endpoints, strict XSS escaping on dynamic template inputs, and parameterized SQL queries.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                <RefreshCw className="h-4 w-4" />
                <span>Circuit Breakers</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Automated state machines (CLOSED, OPEN, HALF-OPEN) preventing cascading outages across Resend and Supabase service dependencies.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-teal-400 text-sm font-semibold">
                <Cpu className="h-4 w-4" />
                <span>Python Analytics</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Integrated Python 3.14 FastAPI service computing email deliverability scoring, spam keyword detection, and usage analytics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
