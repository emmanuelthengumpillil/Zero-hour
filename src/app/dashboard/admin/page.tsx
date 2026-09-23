"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/shared/AuthContext";
import {
  Building,
  Users,
  UserCheck,
  Mail,
  Send,
  ArrowRight,
  Plus,
  ShieldCheck,
  TrendingUp,
  Clock,
  Sparkles,
} from "lucide-react";

export default function BusinessAdminDashboard() {
  const { user, contacts, emailLogs, templates } = useAuth();

  const totalContacts = contacts.length;
  const customersCount = contacts.filter((c) => c.status === "customer").length;
  const unconvertedCount = totalContacts - customersCount;
  const conversionRate = totalContacts > 0 ? Math.round((customersCount / totalContacts) * 100) : 0;

  // Mock staff list for this business
  const [employees, setEmployees] = useState([
    { id: "emp-1", name: "David Kim", email: "david.kim@zerohour.dev", role: "employee", added: "3 days ago" },
    { id: "emp-2", name: "Rachel Adams", email: "rachel.a@zerohour.dev", role: "employee", added: "1 week ago" },
  ]);

  const [newEmpName, setNewEmpName] = useState("");
  const [newEmpEmail, setNewEmpEmail] = useState("");
  const [showAddEmp, setShowAddEmp] = useState(false);

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName || !newEmpEmail) return;
    setEmployees((prev) => [
      ...prev,
      {
        id: `emp-${Date.now()}`,
        name: newEmpName,
        email: newEmpEmail,
        role: "employee",
        added: "Just now",
      },
    ]);
    setNewEmpName("");
    setNewEmpEmail("");
    setShowAddEmp(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-gray-900 border border-indigo-800/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              Level 2 RBAC
            </span>
            <h1 className="text-xl font-bold text-white">Business Owner & Admin Command Center</h1>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Workspace: <strong className="text-white">{user.businessName || "Zero Hour Technologies"}</strong> &bull;
            Manage team pipelines, play with demo flows, and dispatch verified campaigns.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/demo"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 transition-all"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Play with Demo</span>
          </Link>
          <Link
            href="/builder"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold transition-all"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Open Email Studio</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Pipeline Conversion Rate</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{conversionRate}%</div>
          <p className="text-[11px] text-gray-400 font-mono">
            {customersCount} Customers / {totalContacts} Contacts
          </p>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Dispatched Campaigns</span>
            <Send className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">{emailLogs.length}</div>
          <p className="text-[11px] text-indigo-400 font-mono">Resend & Sandbox Verified</p>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Active Templates</span>
            <Mail className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{templates.length}</div>
          <p className="text-[11px] text-purple-400 font-mono">Customizable variables</p>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Delegated Staff</span>
            <Users className="h-4 w-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-white">{employees.length} Employees</div>
          <p className="text-[11px] text-teal-400 font-mono">Level 3 Scoped Access</p>
        </div>
      </div>

      {/* Staff & Employee Delegation Section */}
      <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-400" />
              Delegated Employees (Level 3 RBAC)
            </h2>
            <p className="text-xs text-gray-400">
              Staff members authorized to add contacts and inspect delivery records within your business.
            </p>
          </div>

          <button
            onClick={() => setShowAddEmp(!showAddEmp)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-500/40 bg-indigo-600/20 hover:bg-indigo-600/30 text-xs font-medium text-indigo-300 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Employee</span>
          </button>
        </div>

        {/* Add Employee Form Drawer */}
        {showAddEmp && (
          <form
            onSubmit={handleAddEmployee}
            className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-950/20 space-y-3 animate-in fade-in"
          >
            <h4 className="text-xs font-bold text-white">Delegate New Employee</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Full Name"
                value={newEmpName}
                onChange={(e) => setNewEmpName(e.target.value)}
                className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-1.5 text-xs text-white"
                required
              />
              <input
                type="email"
                placeholder="Company Email"
                value={newEmpEmail}
                onChange={(e) => setNewEmpEmail(e.target.value)}
                className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-1.5 text-xs text-white"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddEmp(false)}
                className="px-3 py-1 rounded-lg border border-gray-700 text-xs text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white"
              >
                Add Member
              </button>
            </div>
          </form>
        )}

        {/* Employee Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-900/80 text-gray-400 border-b border-gray-800 font-mono">
              <tr>
                <th className="py-3 px-4">Employee Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role Access</th>
                <th className="py-3 px-4">Assigned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-900/50">
                  <td className="py-3 px-4 font-semibold text-white">{emp.name}</td>
                  <td className="py-3 px-4 text-gray-400">{emp.email}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">
                      employee (scoped)
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500 font-mono">{emp.added}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Dispatched Activity */}
      <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-400" />
            Recent Campaign Dispatches
          </h2>
          <span className="text-xs text-gray-500 font-mono">{emailLogs.length} total recorded</span>
        </div>

        <div className="space-y-2.5">
          {emailLogs.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-6">No emails dispatched yet.</p>
          ) : (
            emailLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-800 bg-gray-900/60 text-xs"
              >
                <div>
                  <p className="font-semibold text-white">{log.subject}</p>
                  <p className="text-[11px] text-gray-400">
                    To: {log.recipientName} ({log.recipientEmail})
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {log.status}
                  </span>
                  <span className="text-[11px] text-gray-500 font-mono hidden sm:inline">
                    {new Date(log.sentAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
