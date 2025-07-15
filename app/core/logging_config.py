# app/core/logging_config.py

import contextvars
import logging
import sys

from pythonjsonlogger import jsonlogger

# Context variable to store request_id per request
request_id_var = contextvars.ContextVar("request_id", default="-")

# Create base logger
base_logger = logging.getLogger("uvicorn")
base_logger.setLevel(logging.INFO)
base_logger.propagate = False  # Avoid duplicate logs from parent/root logger

# Clean existing handlers if re-running (optional)
base_logger.handlers.clear()

# JSON formatter
log_formatter = jsonlogger.JsonFormatter(
    "%(asctime)s %(levelname)s %(message)s %(funcName)s %(lineno)d %(filename)s request_id"
)

# Stream handler with formatter
handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(log_formatter)


# Request ID filter
class RequestIdFilter(logging.Filter):
    def filter(self, record):
        record.request_id = request_id_var.get()
        return True


handler.addFilter(RequestIdFilter())

# Add handler to logger
base_logger.addHandler(handler)


# LoggerAdapter to auto-inject request_id
class RequestIdLoggerAdapter(logging.LoggerAdapter):
    def process(self, msg, kwargs):
        if "extra" not in kwargs:
            kwargs["extra"] = {}
        kwargs["extra"]["request_id"] = request_id_var.get()
        return msg, kwargs


# Final exported logger
logger = RequestIdLoggerAdapter(base_logger)
