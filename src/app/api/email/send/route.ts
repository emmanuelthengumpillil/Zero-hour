import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendZeroHourEmail } from "@/lib/email/resendClient";

const sendEmailSchema = z.object({
  recipientEmail: z.string().email("Valid recipient email is required"),
  recipientName: z.string().min(1, "Recipient name is required").max(100),
  subject: z.string().min(1, "Subject line is required").max(200),
  headerText: z.string().max(200).optional(),
  bodyContent: z.string().min(1, "Body content cannot be empty").max(10000),
  ctaText: z.string().max(100).optional(),
  ctaUrl: z.string().url("CTA URL must be a valid URL").optional().or(z.literal("")),
  templateId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();

    // 1. Zod Input Validation
    const validation = sendEmailSchema.safeParse(json);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    // 2. Dispatch via resilient email client
    const result = await sendZeroHourEmail({
      ...validation.data,
      senderIp: clientIp,
    });

    return NextResponse.json({
      success: true,
      message: result.mode === "resend_live" ? "Email delivered via Resend" : "Email simulated via Sandbox mode",
      data: result,
    });
  } catch (error: any) {
    console.error("Email send API error:", error);

    // Differentiate between rate limit, circuit breaker, and internal errors
    const status = error.message?.includes("Rate limit")
      ? 429
      : error.message?.includes("Circuit")
      ? 503
      : 500;

    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred while sending the email",
      },
      { status }
    );
  }
}
