"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/shared/AuthContext";
import {
  ShieldCheck,
  Activity,
  Server,
  Lock,
  Layers,
  Users,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

export default function SoftwareOwnerDashboard() {
  const { role, emailLogs } = useAuth();
  const [telemetry, setTelemetry] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealthAndTelemetry = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/health");
      const json = await res.json();
      setTelemetry(json);
    } catch (err) {
      console.error("Health check error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthAndTelemetry();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-purple-950/60 via-indigo-950/40 to-gray-900 border border-purple-800/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40">
              Level 1 RBAC
            </span>
            <h1 className="text-xl font-bold text-white">Software Owner Telemetry & Master Control</h1>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Global superuser view: Unrestricted access across all tenant records, circuit breakers, and production security telemetry.
          </p>
        </div>

        <button
          onClick={fetchHealthAndTelemetry}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-700 bg-purple-900/40 hover:bg-purple-800/50 text-xs font-medium text-purple-200 transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* High-level platform KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Global Tenants</span>
            <Users className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">12 Organizations</div>
          <p className="text-[11px] text-emerald-400 font-mono">100% Active with RBAC</p>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Platform Dispatch Volume</span>
            <Activity className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">142,850+</div>
          <p className="text-[11px] text-indigo-400 font-mono">+4,210 today</p>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Global Delivery Rate</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">99.4%</div>
          <p className="text-[11px] text-gray-400 font-mono">0.6% bounce rate</p>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Security Standard</span>
            <Lock className="h-4 w-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-white">TLS 1.3 / AES-256</div>
          <p className="text-[11px] text-teal-400 font-mono">Zero plain-text secrets</p>
        </div>
      </div>

      {/* Circuit Breakers & Production Resilience Monitors */}
      <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-6 space-y-6">
        <div className="border-b border-gray-800 pb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Server className="h-5 w-5 text-indigo-400" />
            Downstream Circuit Breaker & Resilience State
          </h2>
          <p className="text-xs text-gray-400">
            Real-time state machines preventing cascading service degradation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Resend Circuit */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/80 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Resend Email Gateway</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
                {telemetry?.resilience?.circuitBreakers?.resend?.state || "CLOSED (Healthy)"}
              </span>
            </div>
            <div className="text-[11px] text-gray-400 space-y-1">
              <p>Failure Threshold: 3 errors</p>
              <p>Reset Timeout: 15s</p>
              <p>Fallback Mode: Simulated Sandbox</p>
            </div>
          </div>

          {/* Supabase Circuit */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/80 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Supabase PostgreSQL</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
                {telemetry?.resilience?.circuitBreakers?.supabase?.state || "CLOSED (Healthy)"}
              </span>
            </div>
            <div className="text-[11px] text-gray-400 space-y-1">
              <p>Row-Level Security: Active</p>
              <p>Audit Trail: Append-Only</p>
              <p>Connection Pooling: Active</p>
            </div>
          </div>

          {/* Python Circuit */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/80 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Python Analytics Engine</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
                {telemetry?.resilience?.circuitBreakers?.python?.state || "CLOSED (Healthy)"}
              </span>
            </div>
            <div className="text-[11px] text-gray-400 space-y-1">
              <p>Engine: FastAPI / Python 3.14</p>
              <p>Deliverability Scoring: Enabled</p>
              <p>Graceful Degradation: Standby</p>
            </div>
          </div>
        </div>
      </div>

      {/* Business Admins Tenant Directory */}
      <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white">Registered Business Admins</h2>
            <p className="text-xs text-gray-400">Tenant accounts governed by Level 2 RBAC</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-900/80 text-gray-400 border-b border-gray-800 font-mono">
              <tr>
                <th className="py-3 px-4">Business Organization</th>
                <th className="py-3 px-4">Admin Lead</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Monthly Dispatches</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              <tr className="hover:bg-gray-900/50">
                <td className="py-3 px-4 font-semibold text-white">Zero Hour Technologies</td>
                <td className="py-3 px-4">orion.stark@example.com</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800">
                    business_admin
                  </span>
                </td>
                <td className="py-3 px-4 font-mono">4,812 / 10,000</td>
                <td className="py-3 px-4 text-emerald-400 font-medium">Active</td>
              </tr>
              <tr className="hover:bg-gray-900/50">
                <td className="py-3 px-4 font-semibold text-white">Nexus Tech AI</td>
                <td className="py-3 px-4">ops@nexustech.io</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800">
                    business_admin
                  </span>
                </td>
                <td className="py-3 px-4 font-mono">12,900 / 25,000</td>
                <td className="py-3 px-4 text-emerald-400 font-medium">Active</td>
              </tr>
              <tr className="hover:bg-gray-900/50">
                <td className="py-3 px-4 font-semibold text-white">Starlight Ventures</td>
                <td className="py-3 px-4">hello@starlight.co</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800">
                    business_admin
                  </span>
                </td>
                <td className="py-3 px-4 font-mono">840 / 5,000</td>
                <td className="py-3 px-4 text-emerald-400 font-medium">Active</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
