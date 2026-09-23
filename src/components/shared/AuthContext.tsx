"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, UserRole, Contact, EmailTemplate, EmailLog } from "@/lib/types";
import { INITIAL_CONTACTS, INITIAL_TEMPLATES, INITIAL_LOGS } from "@/lib/storage/mockStorage";
import { createClient } from "@/lib/supabase/client";

interface AuthContextType {
  user: UserProfile;
  role: UserRole;
  setRole: (role: UserRole) => void;
  setUser: (user: UserProfile) => void;
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  templates: EmailTemplate[];
  setTemplates: React.Dispatch<React.SetStateAction<EmailTemplate[]>>;
  emailLogs: EmailLog[];
  addEmailLog: (log: EmailLog) => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const defaultUser: UserProfile = {
  id: "user-current-session",
  name: "Orion Stark",
  email: "orion.stark@example.com",
  role: "business_admin", // Default to Business Admin so user can play with demo immediately
  businessId: "biz-101",
  businessName: "Zero Hour Technologies",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [templates, setTemplates] = useState<EmailTemplate[]>(INITIAL_TEMPLATES);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>(INITIAL_LOGS);

  // Sync role changes
  const setRole = (newRole: UserRole) => {
    setUser((prev) => ({ ...prev, role: newRole }));
  };

  const addEmailLog = (log: EmailLog) => {
    setEmailLogs((prev) => [log, ...prev]);
  };

  const signInWithGoogle = async () => {
    try {
      const supabase = createClient();
      const redirectUrl = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        console.warn("Supabase Google Auth notice (using simulated sign-in if offline):", error.message);
        // Fallback simulation: log in with realistic Google OAuth identity
        setUser({
          id: "google-usr-9812",
          name: "Google Authenticated User",
          email: "google.user@gmail.com",
          role: "business_admin",
          businessName: "Innovate AI Labs",
          avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
        });
      }
    } catch (err) {
      console.error("Sign in failed:", err);
    }
  };

  const signOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Sign out local fallback:", err);
    }
    setUser(defaultUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user.role,
        setRole,
        setUser,
        contacts,
        setContacts,
        templates,
        setTemplates,
        emailLogs,
        addEmailLog,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
