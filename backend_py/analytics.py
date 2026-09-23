"""
Zero Hour - Analytics and Resilience Engine
Provides metrics computation, template spam/quality scoring, and circuit breaker telemetry.
"""

import re
from typing import Dict, List, Any
from datetime import datetime

SPAM_KEYWORDS = [
    "100% free", "act now", "apply now", "buy direct", "claim now",
    "exclusive deal", "free money", "get paid", "guaranteed", "instant",
    "limited time", "make money", "no fees", "no risk", "order now",
    "promise", "risk-free", "urgent", "winner", "congratulations"
]

class ZeroHourAnalytics:
    @staticmethod
    def evaluate_template_quality(subject: str, body: str) -> Dict[str, Any]:
        """
        Evaluates email content quality, spam likelihood, and structural health.
        Returns a score from 0-100 and recommendations.
        """
        score = 100
        issues = []
        recommendations = []
        combined_text = f"{subject} {body}".lower()

        # Check for ALL CAPS in subject
        if subject.isupper() and len(subject) > 5:
            score -= 25
            issues.append("Subject line is in ALL CAPS")
            recommendations.append("Use title case or sentence case for the subject line.")

        # Check for excessive exclamation marks
        exclamation_count = subject.count("!") + body.count("!")
        if exclamation_count > 3:
            deduction = min(20, exclamation_count * 4)
            score -= deduction
            issues.append(f"Excessive exclamation marks found ({exclamation_count})")
            recommendations.append("Reduce exclamation marks to maintain high deliverability.")

        # Check for spam trigger words
        found_triggers = [kw for kw in SPAM_KEYWORDS if kw in combined_text]
        if found_triggers:
            deduction = min(30, len(found_triggers) * 10)
            score -= deduction
            issues.append(f"Spam trigger words detected: {', '.join(found_triggers)}")
            recommendations.append("Replace promotional buzzwords with direct, professional phrasing.")

        # Check length
        word_count = len(body.split())
        if word_count < 10:
            score -= 15
            issues.append("Email body is unusually short (< 10 words)")
            recommendations.append("Provide sufficient context and a clear value proposition.")
        elif word_count > 800:
            score -= 10
            issues.append("Email body is quite long (> 800 words)")
            recommendations.append("Keep emails concise to boost reader engagement.")

        # Check for dynamic tags
        has_tags = bool(re.search(r"\{\{\s*\w+\s*\}\}", body))
        if has_tags:
            score = min(100, score + 5)
        else:
            recommendations.append("Consider using personalization tags like {{name}} to increase engagement.")

        final_score = max(0, min(100, score))
        risk_level = "low" if final_score >= 80 else ("medium" if final_score >= 50 else "high")

        return {
            "score": final_score,
            "risk_level": risk_level,
            "issues": issues,
            "recommendations": recommendations,
            "word_count": word_count,
            "personalization_detected": has_tags,
            "analyzed_at": datetime.utcnow().isoformat() + "Z"
        }

    @staticmethod
    def calculate_campaign_metrics(logs: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Calculates dispatch success rates, failure breakdowns, and delivery velocity.
        """
        total = len(logs)
        if total == 0:
            return {
                "total_sent": 0,
                "delivered": 0,
                "failed": 0,
                "queued": 0,
                "delivery_rate": 100.0,
                "failure_rate": 0.0,
                "status_breakdown": {}
            }

        counts = {}
        for log in logs:
            st = log.get("status", "unknown")
            counts[st] = counts.get(st, 0) + 1

        delivered = counts.get("delivered", 0) + counts.get("sent", 0) + counts.get("simulated", 0)
        failed = counts.get("failed", 0)
        queued = counts.get("queued", 0)

        delivery_rate = round((delivered / total) * 100, 1) if total > 0 else 0.0
        failure_rate = round((failed / total) * 100, 1) if total > 0 else 0.0

        return {
            "total_sent": total,
            "delivered": delivered,
            "failed": failed,
            "queued": queued,
            "delivery_rate": delivery_rate,
            "failure_rate": failure_rate,
            "status_breakdown": counts,
            "updated_at": datetime.utcnow().isoformat() + "Z"
        }

    @staticmethod
    def get_owner_global_overview() -> Dict[str, Any]:
        """
        Returns mock/aggregated telemetry for Software Owner (Level 1).
        """
        return {
            "system_status": "healthy",
            "tls_version": "TLS 1.3",
            "encryption_algorithm": "AES-256-GCM",
            "active_tenants": 12,
            "total_platform_emails": 142850,
            "platform_delivery_rate": 99.4,
            "circuit_breaker": {
                "resend_service": "CLOSED (Normal Operation)",
                "supabase_cluster": "CLOSED (Healthy)",
                "rate_limiter_active": True,
                "trips_last_24h": 0
            },
            "recent_admins": [
                {"name": "Acme Corp Admin", "email": "admin@acme.com", "emails_sent": 4210, "status": "active"},
                {"name": "Nexus Tech Lead", "email": "ops@nexustech.io", "emails_sent": 12900, "status": "active"},
                {"name": "Starlight Ventures", "email": "hello@starlight.co", "emails_sent": 840, "status": "active"}
            ]
        }

    @staticmethod
    def get_admin_workspace_overview(business_name: str = "Demo Business") -> Dict[str, Any]:
        """
        Returns workspace analytics for Business Admin (Level 2).
        """
        return {
            "business_name": business_name,
            "total_contacts": 128,
            "converted_customers": 45,
            "conversion_rate": 35.15,
            "emails_sent_this_month": 482,
            "monthly_quota": 5000,
            "quota_usage_percentage": 9.64,
            "employees_count": 4,
            "recent_activity": [
                {"action": "Contact dragged to Customers", "target": "john.doe@example.com", "time": "10 mins ago"},
                {"action": "Welcome Email Dispatched", "target": "sarah.lee@startup.io", "time": "1 hour ago"},
                {"action": "New Template Saved", "target": "Summer Re-engagement", "time": "3 hours ago"}
            ]
        }
