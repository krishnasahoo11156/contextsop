import os
from unittest.mock import MagicMock, patch

import pytest

from app import create_app


@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    os.environ["SUPABASE_URL"] = "https://mock.supabase.co"
    os.environ["SUPABASE_ANON_KEY"] = "mock-key"
    with app.test_client() as client:
        yield client


def test_generate_sop_unauthorized_missing_header(client):
    response = client.post("/api/v1/sop/generate", json={"transcript": "a" * 50})
    assert response.status_code == 401
    assert response.json["error"] == "Unauthorized"


def test_generate_sop_unauthorized_invalid_token(client):
    with patch("requests.get") as mock_get:
        mock_response = MagicMock()
        mock_response.status_code = 401
        mock_get.return_value = mock_response

        response = client.post(
            "/api/v1/sop/generate",
            json={"transcript": "a" * 50},
            headers={"Authorization": "Bearer invalid-token"},
        )
        assert response.status_code == 401
        assert response.json["error"] == "Unauthorized"


def test_generate_sop_authorized_success(client):
    with patch("requests.get") as mock_get:
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "id": "user-uuid",
            "email": "user@example.com",
            "app_metadata": {"org_id": "org-uuid"},
        }
        mock_get.return_value = mock_response

        response = client.post(
            "/api/v1/sop/generate",
            json={"transcript": "a" * 50},
            headers={"Authorization": "Bearer valid-token"},
        )
        assert response.status_code == 202
        assert response.json["status"] == "accepted"
        assert response.json["org_id"] == "org-uuid"
        assert response.json["user_id"] == "user-uuid"


def test_generate_sop_forbidden_missing_org(client):
    with patch("requests.get") as mock_get:
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "id": "user-uuid",
            "email": "user@example.com",
            "app_metadata": {},  # missing org_id
        }
        mock_get.return_value = mock_response

        response = client.post(
            "/api/v1/sop/generate",
            json={"transcript": "a" * 50},
            headers={"Authorization": "Bearer valid-token"},
        )
        assert response.status_code == 403
        assert response.json["error"] == "Forbidden"
