"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthContext";
import { UserRole } from "@/lib/types";
import { getRoleBadgeColor, getRoleDisplayName } from "@/lib/auth/rbac";
import {
  Zap,
  LayoutDashboard,
  Mail,
  ShieldCheck,
  Users,
  LogOut,
  ChevronDown,
  Building,
  UserCheck,
  Lock,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { user, role, setRole, signInWithGoogle, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleRoleSelect = (newRole: UserRole) => {
    setRole(newRole);
    setDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <Zap className="h-5 w-5 fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                ZERO HOUR
              </span>
              <span className="text-[10px] -mt-1 font-mono tracking-widest text-indigo-400 uppercase">
                Enterprise Dispatch
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1 pl-4">
            <Link
              href="/demo"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                pathname === "/demo"
                  ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-900"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Demo (Drag & Drop)
            </Link>

            <Link
              href="/builder"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                pathname === "/builder"
                  ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-900"
              }`}
            >
              <Mail className="h-4 w-4" />
              Email Builder
            </Link>

            {/* Level 1: Owner Dash */}
            {role === "software_owner" && (
              <Link
                href="/dashboard/owner"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  pathname === "/dashboard/owner"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                    : "text-gray-400 hover:text-white hover:bg-gray-900"
                }`}
              >
                <ShieldCheck className="h-4 w-4 text-purple-400" />
                Owner Telemetry
              </Link>
            )}

            {/* Level 2: Business Admin Dash */}
            {(role === "software_owner" || role === "business_admin") && (
              <Link
                href="/dashboard/admin"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  pathname === "/dashboard/admin"
                    ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                    : "text-gray-400 hover:text-white hover:bg-gray-900"
                }`}
              >
                <Building className="h-4 w-4 text-indigo-400" />
                Admin Workspace
              </Link>
            )}

            {/* Level 3: Employee Portal */}
            <Link
              href="/dashboard/employee"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                pathname === "/dashboard/employee"
                  ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-900"
              }`}
            >
              <Users className="h-4 w-4 text-emerald-400" />
              Employee Portal
            </Link>
          </nav>
        </div>

        {/* Right Section: Security badge, Role Switcher & Auth */}
        <div className="flex items-center gap-3">
          {/* Security Status Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-gray-900 text-gray-400 border border-gray-800">
            <Lock className="h-3 w-3 text-emerald-400" />
            <span>TLS 1.3 &bull; AES-256</span>
          </div>

          {/* Interactive RBAC Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold tracking-wide transition-all ${getRoleBadgeColor(
                role
              )} shadow-sm`}
              title="Click to switch RBAC preview role"
            >
              <span>{getRoleDisplayName(role)}</span>
              <ChevronDown className="h-3 w-3 opacity-70" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-800 bg-gray-900 shadow-2xl p-2 z-50">
                <div className="px-2 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Select RBAC Role
                </div>

                <button
                  onClick={() => handleRoleSelect("software_owner")}
                  className={`w-full text-left flex items-start gap-2.5 p-2 rounded-lg text-xs transition-colors ${
                    role === "software_owner" ? "bg-purple-950/60 text-purple-300" : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <ShieldCheck className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Level 1: Software Owner</p>
                    <p className="text-[11px] text-gray-400">Full access to all tenants & telemetry</p>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSelect("business_admin")}
                  className={`w-full text-left flex items-start gap-2.5 p-2 rounded-lg text-xs transition-colors ${
                    role === "business_admin" ? "bg-indigo-950/60 text-indigo-300" : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <Building className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Level 2: Business Admin</p>
                    <p className="text-[11px] text-gray-400">Play demo, send emails, analytics</p>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSelect("employee")}
                  className={`w-full text-left flex items-start gap-2.5 p-2 rounded-lg text-xs transition-colors ${
                    role === "employee" ? "bg-emerald-950/60 text-emerald-300" : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <UserCheck className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Level 3: Employee</p>
                    <p className="text-[11px] text-gray-400">Add & view contacts, view logs</p>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* User Profile / OAuth Sign In */}
          <div className="flex items-center gap-2 pl-2 border-l border-gray-800">
            <button
              onClick={signInWithGoogle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-700 bg-gray-800 hover:bg-gray-700 text-xs font-medium text-white transition-colors"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.97 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Sign In with Google</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
