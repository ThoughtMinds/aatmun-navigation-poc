import time
import uuid

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.logging_config import logger, request_id_var


class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = str(uuid.uuid4())
        request_id_var.set(request_id)

        start_time = time.time()

        logger.info(
            {
                "event": "request_received",
                "method": request.method,
                "path": request.url.path,
            }
        )

        response = await call_next(request)
        duration = time.time() - start_time

        logger.info(
            {
                "event": "request_completed",
                "method": request.method,
                "path": request.url.path,
                "status_code": response.status_code,
                "duration": round(duration, 4),
            }
        )

        return response