import sys
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).parent.parent))

from backend_py.analytics import ZeroHourAnalytics

def run_tests():
    print("=== ZERO HOUR PYTHON ANALYTICS TEST SUITE ===\n")

    # 1. Template quality & spam check
    res = ZeroHourAnalytics.evaluate_template_quality(
        subject="Welcome to Zero Hour, {{name}}! ⚡",
        body="Hi {{name}},\n\nWe are thrilled to welcome you to Zero Hour! Your account has been converted into an active customer.\n\nWarm regards,\nThe Zero Hour Team",
    )
    assert res["score"] >= 80, f"Expected high score, got {res['score']}"
    assert res["risk_level"] == "low"
    assert res["personalization_detected"] is True
    print(f"[PASS] Template Scoring: Score={res['score']}/100, Risk={res['risk_level']}, Personalization={res['personalization_detected']}")

    # 2. Campaign metrics calculation
    mock_logs = [
        {"status": "delivered"},
        {"status": "delivered"},
        {"status": "simulated"},
        {"status": "failed"},
    ]
    metrics = ZeroHourAnalytics.calculate_campaign_metrics(mock_logs)
    assert metrics["total_sent"] == 4
    assert metrics["delivered"] == 3
    assert metrics["failed"] == 1
    assert metrics["delivery_rate"] == 75.0
    print(f"[PASS] Campaign Metrics: Sent={metrics['total_sent']}, Delivery Rate={metrics['delivery_rate']}%, Failure Rate={metrics['failure_rate']}%")

    # 3. Software Owner Overview (Level 1)
    owner_data = ZeroHourAnalytics.get_owner_global_overview()
    assert owner_data["system_status"] == "healthy"
    assert owner_data["encryption_algorithm"] == "AES-256-GCM"
    assert owner_data["tls_version"] == "TLS 1.3"
    print(f"[PASS] Owner Platform Telemetry: Status={owner_data['system_status']}, Tenants={owner_data['active_tenants']}, Enc={owner_data['encryption_algorithm']}")

    # 4. Business Admin Overview (Level 2)
    admin_data = ZeroHourAnalytics.get_admin_workspace_overview("Zero Hour Technologies")
    assert admin_data["total_contacts"] == 128
    assert admin_data["conversion_rate"] == 35.15
    print(f"[PASS] Admin Workspace Telemetry: Contacts={admin_data['total_contacts']}, Converted={admin_data['converted_customers']}")

    print("\n=== ALL PYTHON ANALYTICS TESTS PASSED (4/4) ===")

if __name__ == "__main__":
    run_tests()
