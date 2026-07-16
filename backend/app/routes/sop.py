from flask import Blueprint, g, jsonify, request
from pydantic import BaseModel, Field

from ..auth import require_auth
from ..services.redaction import redact_secrets

sop_bp = Blueprint("sop", __name__)


class GenerateRequest(BaseModel):
    transcript: str = Field(min_length=20, max_length=100_000)


@sop_bp.post("/generate")
@require_auth
def generate_sop():
    payload = GenerateRequest.model_validate(request.get_json(silent=True) or {})
    safe_transcript = redact_secrets(payload.transcript)
    # LLM generation belongs here. Return a job reference once an async worker is connected.
    return jsonify(
        status="accepted",
        transcript_length=len(safe_transcript),
        org_id=g.org_id,
        user_id=g.user_id,
        message="Generation pipeline is not connected yet.",
    ), 202
