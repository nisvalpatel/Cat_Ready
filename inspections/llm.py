"""
LLM: map transcript + image notes to PASS / FAIL / UNSURE.
"""
import re

from django.conf import settings

VALID_RESULTS = ("PASS", "FAIL", "UNSURE")


def evaluate_step(step_name: str, transcript: str, image_descriptions: list[str]) -> tuple[str, str]:
    """
    Call LLM with step context; return (result, raw_response).
    result is one of PASS, FAIL, UNSURE; raw_response is the full LLM text.
    """
    if not getattr(settings, "OPENAI_API_KEY", None):
        return "UNSURE", "No API key configured."

    image_notes = " ".join(s for s in image_descriptions if s).strip() or "No images provided."
    prompt = f"""You are evaluating one step of a vehicle pre-start inspection.

Step: {step_name or 'Unnamed step'}
Operator said: {transcript or '(no speech)'}
Image notes: {image_notes}

Respond with exactly one word: PASS, FAIL, or UNSURE. You may add one short sentence reason after the word.
- PASS: inspection step confirmed OK.
- FAIL: clear issue or concern.
- UNSURE: unclear or need more info."""

    try:
        from openai import OpenAI

        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        response = client.chat.completions.create(
            model=getattr(settings, "OPENAI_LLM_MODEL", "gpt-4o-mini"),
            messages=[{"role": "user", "content": prompt}],
            max_tokens=150,
        )
        raw = (response.choices[0].message.content or "").strip()
        result = _parse_result(raw)
        return result, raw
    except Exception as e:
        return "UNSURE", str(e)


def _parse_result(raw: str) -> str:
    """Extract PASS, FAIL, or UNSURE from LLM response."""
    if not raw:
        return "UNSURE"
    upper = raw.upper()
    for token in VALID_RESULTS:
        if token in upper:
            return token
    return "UNSURE"
