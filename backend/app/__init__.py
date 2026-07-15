from flask import Flask
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from .config import Settings
from .errors import register_error_handlers
from .routes.health import health_bp
from .routes.sop import sop_bp

limiter = Limiter(key_func=get_remote_address, default_limits=["120 per minute"])


def create_app() -> Flask:
    settings = Settings()
    app = Flask(__name__)
    app.config.update(SECRET_KEY=settings.flask_secret_key, MAX_CONTENT_LENGTH=2 * 1024 * 1024)
    CORS(app, resources={r"/api/*": {"origins": [settings.frontend_origin]}})
    limiter.init_app(app)
    app.register_blueprint(health_bp, url_prefix="/api/v1")
    app.register_blueprint(sop_bp, url_prefix="/api/v1/sop")
    register_error_handlers(app)
    return app
