#!/usr/bin/env bash
uvicorn api_server:app --host 0.0.0.0 --port $PORT