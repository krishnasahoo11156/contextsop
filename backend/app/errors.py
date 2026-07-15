from flask import Flask, jsonify
from pydantic import ValidationError
from werkzeug.exceptions import HTTPException


def register_error_handlers(app: Flask) -> None:
    @app.errorhandler(ValidationError)
    def validation_error(error: ValidationError):
        return jsonify(error={"code": "VALIDATION_ERROR", "details": error.errors()}), 400

    @app.errorhandler(HTTPException)
    def http_error(error: HTTPException):
        return jsonify(error={"code": error.name.upper().replace(" ", "_"), "message": error.description}), error.code

    @app.errorhandler(Exception)
    def unexpected_error(error: Exception):
        app.logger.exception("Unhandled application error")
        return jsonify(error={"code": "INTERNAL_ERROR", "message": "An unexpected error occurred."}), 500
