"""
Speech-to-text: transcribe audio to text (OpenAI Whisper).
"""
import os

from django.conf import settings


def transcribe(audio_path: str) -> str:
    """
    Transcribe audio file to text using OpenAI Whisper.
    Returns empty string if no API key or on error.
    """
    if not getattr(settings, "OPENAI_API_KEY", None):
        return ""
    try:
        from openai import OpenAI

        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        with open(audio_path, "rb") as f:
            response = client.audio.transcriptions.create(
                model=getattr(settings, "OPENAI_STT_MODEL", "whisper-1"),
                file=f,
            )
        return (response.text or "").strip()
    except Exception:
        return ""
