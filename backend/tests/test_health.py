from app import create_app


def test_health_check():
    app = create_app()
    response = app.test_client().get("/api/v1/health")
    assert response.status_code == 200
    assert response.json["status"] == "ok"
