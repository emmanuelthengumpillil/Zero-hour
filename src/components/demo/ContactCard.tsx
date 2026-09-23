"use client";

import React from "react";
import { Contact } from "@/lib/types";
import { GripVertical, Mail, Building2, CheckCircle2, User } from "lucide-react";

interface ContactCardProps {
  contact: Contact;
  onDragStart?: (e: React.DragEvent, contact: Contact) => void;
  isCurrentUser?: boolean;
}

export function ContactCard({ contact, onDragStart, isCurrentUser = false }: ContactCardProps) {
  const isCustomer = contact.status === "customer";

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("application/json", JSON.stringify(contact));
    e.dataTransfer.effectAllowed = "move";
    if (onDragStart) onDragStart(e, contact);
  };

  return (
    <div
      draggable={!isCustomer}
      onDragStart={handleDragStart}
      className={`group relative flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
        isCustomer
          ? "border-emerald-500/40 bg-emerald-950/20 shadow-md shadow-emerald-950/30"
          : "border-gray-800 bg-gray-900/80 hover:border-indigo-500/50 hover:bg-gray-800/90 hover:shadow-lg hover:shadow-indigo-500/10 cursor-grab active:cursor-grabbing"
      } ${isCurrentUser ? "ring-2 ring-indigo-500/50" : ""}`}
    >
      <div className="flex items-center gap-3">
        {/* Drag Handle / Customer Icon */}
        {!isCustomer ? (
          <div className="text-gray-500 group-hover:text-indigo-400 transition-colors cursor-grab">
            <GripVertical className="h-5 w-5" />
          </div>
        ) : (
          <div className="text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        )}

        {/* Avatar */}
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-sm text-white ${
            isCustomer
              ? "bg-gradient-to-tr from-emerald-600 to-teal-500"
              : isCurrentUser
              ? "bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-md shadow-indigo-500/30"
              : "bg-gray-800 text-gray-300"
          }`}
        >
          {contact.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm text-white">{contact.name}</h4>
            {isCurrentUser && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                You
              </span>
            )}
            {isCustomer && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Active Customer
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3 text-gray-500" />
              {contact.email}
            </span>
            {contact.company && (
              <span className="flex items-center gap-1">
                <Building2 className="h-3 w-3 text-gray-500" />
                {contact.company}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Drag cue */}
      {!isCustomer && (
        <span className="text-[11px] font-mono text-gray-500 group-hover:text-indigo-400 transition-colors hidden sm:inline">
          Drag to convert &rarr;
        </span>
      )}
    </div>
  );
}
