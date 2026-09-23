import { NextResponse } from "next/server";
import { resendCircuit, supabaseCircuit, pythonCircuit } from "@/lib/resilience/circuitBreaker";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    system: "Zero Hour Platform",
    timestamp: new Date().toISOString(),
    security: {
      dataProtectionAtRest: "AES-256-GCM (Active)",
      transitEncryption: "TLS 1.3 (Enforced via HSTS)",
      xssSanitization: "Enabled",
      sqlInjectionProtection: "Parameterized queries & RLS",
    },
    resilience: {
      circuitBreakers: {
        resend: resendCircuit.getTelemetry(),
        supabase: supabaseCircuit.getTelemetry(),
        python: pythonCircuit.getTelemetry(),
      },
      rateLimiting: "Active (Token-bucket sliding window)",
      retryStrategy: "Exponential Backoff with Full Jitter",
    },
  });
}
