"use client";

import React, { useState } from "react";
import { useAuth } from "@/components/shared/AuthContext";
import { Contact } from "@/lib/types";
import {
  Users,
  Plus,
  Mail,
  UserCheck,
  CheckCircle2,
  Lock,
  Search,
  Building,
} from "lucide-react";

export default function EmployeePortalPage() {
  const { contacts, setContacts, emailLogs, user } = useAuth();

  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.company?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newContact: Contact = {
      id: `contact-${Date.now()}`,
      name,
      email,
      company: company || "Independent",
      status: "contact",
      addedAt: new Date().toISOString(),
    };

    setContacts((prev) => [newContact, ...prev]);
    setName("");
    setEmail("");
    setCompany("");
    setShowAddModal(false);
    setAddSuccess(true);
    setTimeout(() => setAddSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-teal-950/40 to-gray-900 border border-emerald-800/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              Level 3 RBAC
            </span>
            <h1 className="text-xl font-bold text-white">Employee Operations & Directory Portal</h1>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Scoped Access: You can add new customer prospects, view directory details, and inspect email delivery logs.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Contact</span>
        </button>
      </div>

      {/* Permissions notice */}
      <div className="flex items-center gap-2.5 p-3.5 rounded-xl border border-gray-800 bg-gray-900/60 text-xs text-gray-400">
        <Lock className="h-4 w-4 text-emerald-400 flex-shrink-0" />
        <span>
          As an <strong>Employee</strong>, you have access to create and view customer contact records and review delivery audit logs. Destructive operations and platform settings are restricted to Business Admins and Owners.
        </span>
      </div>

      {addSuccess && (
        <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>Contact successfully registered into the Zero Hour pipeline!</span>
        </div>
      )}

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-emerald-400" />
                Add New Contact
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white text-xs"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateContact} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Miller"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-gray-800 bg-gray-950 p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. jordan.m@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-800 bg-gray-950 p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Company / Organization</label>
                <input
                  type="text"
                  placeholder="e.g. Starlight Media"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full rounded-lg border border-gray-800 bg-gray-950 p-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-gray-700 text-gray-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Directory & Log Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contacts Directory (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-800 bg-gray-950/70 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-400" />
                Contact & Customer Directory
              </h2>
              <p className="text-xs text-gray-400">Total records: {contacts.length}</p>
            </div>

            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search records..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-gray-800 bg-gray-900 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 w-48"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-900/80 text-gray-400 border-b border-gray-800 font-mono">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-gray-300">
                {filteredContacts.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-900/50">
                    <td className="py-3 px-4 font-semibold text-white">{c.name}</td>
                    <td className="py-3 px-4 text-gray-400">{c.email}</td>
                    <td className="py-3 px-4 text-gray-400">{c.company || "—"}</td>
                    <td className="py-3 px-4">
                      {c.status === "customer" ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
                          Customer
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-800 text-gray-400 border border-gray-700">
                          Contact
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Read-Only Dispatch Audit Logs (1 col) */}
        <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-6 space-y-4">
          <div className="border-b border-gray-800 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Mail className="h-5 w-5 text-indigo-400" />
              Delivery Audit Logs
            </h2>
            <p className="text-xs text-gray-400">Read-only delivery verification</p>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1">
            {emailLogs.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-8">No delivery logs recorded yet.</p>
            ) : (
              emailLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl border border-gray-800 bg-gray-900/60 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white truncate max-w-[160px]">
                      {log.recipientName}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {log.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-[11px] truncate">{log.recipientEmail}</p>
                  <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono pt-1 border-t border-gray-800/80">
                    <span>{new Date(log.sentAt).toLocaleTimeString()}</span>
                    <span>AES-256 Protected</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
