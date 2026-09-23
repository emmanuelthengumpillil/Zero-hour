"""
Zero Hour - FastAPI Microservice
Provides REST endpoints for email analytics, spam detection, and system telemetry.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from analytics import ZeroHourAnalytics

app = FastAPI(
    title="Zero Hour Analytics & Resilience Engine",
    description="Python backend service supporting Next.js with data analytics and spam/deliverability evaluation.",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TemplateScoreRequest(BaseModel):
    subject: str = Field(..., description="Subject line of the email")
    body: str = Field(..., description="Main HTML or plain-text content")

class CampaignMetricsRequest(BaseModel):
    logs: List[Dict[str, Any]] = Field(default_factory=list, description="Array of email log records")

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "zero-hour-python-engine",
        "tls_enforced": True,
        "circuit_breaker": "healthy"
    }

@app.post("/api/analytics/template-score")
def score_template(payload: TemplateScoreRequest):
    try:
        result = ZeroHourAnalytics.evaluate_template_quality(payload.subject, payload.body)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analytics/summary")
def compute_summary(payload: CampaignMetricsRequest):
    try:
        result = ZeroHourAnalytics.calculate_campaign_metrics(payload.logs)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analytics/owner-overview")
def get_owner_overview():
    return {"success": True, "data": ZeroHourAnalytics.get_owner_global_overview()}

@app.get("/api/analytics/admin-overview")
def get_admin_overview(business_name: Optional[str] = "Demo Business"):
    return {"success": True, "data": ZeroHourAnalytics.get_admin_workspace_overview(business_name)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
