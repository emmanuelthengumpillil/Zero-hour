"use client";

import React from "react";
import { AlertTriangle, Mail, Send, X, ShieldCheck } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSending: boolean;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  headerText: string;
  bodySnippet: string;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isSending,
  recipientEmail,
  recipientName,
  subject,
  headerText,
  bodySnippet,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Confirm Email Dispatch</h3>
              <p className="text-xs text-gray-400">Please review target recipient and payload before sending</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSending}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dispatch Summary Box */}
        <div className="space-y-3 rounded-xl border border-gray-800 bg-gray-950/70 p-4 text-xs font-mono">
          <div className="flex justify-between items-center pb-2 border-b border-gray-800">
            <span className="text-gray-500">Recipient:</span>
            <span className="text-white font-semibold">
              {recipientName} &lt;{recipientEmail}&gt;
            </span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-gray-800">
            <span className="text-gray-500">Subject:</span>
            <span className="text-indigo-300 truncate max-w-[280px]">{subject}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-gray-800">
            <span className="text-gray-500">Header:</span>
            <span className="text-gray-300 truncate max-w-[280px]">{headerText}</span>
          </div>

          <div className="pt-1">
            <span className="text-gray-500 block mb-1">Body Preview:</span>
            <p className="text-gray-400 line-clamp-3 font-sans text-xs bg-gray-900/60 p-2.5 rounded-lg border border-gray-800">
              {bodySnippet}
            </p>
          </div>
        </div>

        {/* Security & Resilience Notice */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-300 text-xs">
          <ShieldCheck className="h-4 w-4 text-indigo-400 flex-shrink-0" />
          <span>Payload protected by AES-256-GCM encryption &bull; Resend Circuit Breaker active</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={isSending}
            className="px-4 py-2 rounded-xl border border-gray-700 bg-gray-800 hover:bg-gray-700 text-xs font-medium text-gray-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isSending}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50"
          >
            {isSending ? (
              <>
                <Send className="h-3.5 w-3.5 animate-spin" />
                <span>Sending Email...</span>
              </>
            ) : (
              <>
                <Mail className="h-3.5 w-3.5" />
                <span>Confirm & Send Now</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
