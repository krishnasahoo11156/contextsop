import re

SECRET_PATTERNS = [
    re.compile(r"\bsk-[A-Za-z0-9_-]{20,}\b"),
    re.compile(r"(?i)(password|api[_-]?key|token)\s*[:=]\s*[^\s]+"),
]


def redact_secrets(text: str) -> str:
    for pattern in SECRET_PATTERNS:
        text = pattern.sub("[REDACTED]", text)
    return text
