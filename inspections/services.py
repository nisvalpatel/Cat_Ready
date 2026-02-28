"""
Orchestration: STT → vision → LLM for one inspection step.
"""
import os

from inspections import llm, stt, vision


def process_step(
    audio_path: str | None,
    image_paths: list[str],
    step_name: str = "",
) -> tuple[str, str, dict]:
    """
    Run STT on audio, describe images, then LLM evaluation.
    Returns (result, result_reason, log_dict).
    log_dict has keys: transcript, image_descriptions, llm_raw.
    """
    transcript = ""
    if audio_path and os.path.isfile(audio_path):
        transcript = stt.transcribe(audio_path)

    image_descriptions = []
    for path in (image_paths or []):
        if os.path.isfile(path):
            desc = vision.describe_image(path)
            image_descriptions.append(desc if desc else "(no description)")

    result, raw = llm.evaluate_step(step_name, transcript, image_descriptions)
    # Use first sentence of raw as reason when it's more than just the token
    result_reason = _short_reason(raw, result)

    log = {
        "transcript": transcript,
        "image_descriptions": image_descriptions,
        "llm_raw": raw,
    }
    return result, result_reason, log


def _short_reason(raw: str, result: str) -> str:
    """Optionally trim raw to one sentence for result_reason."""
    if not raw or result not in raw.upper():
        return raw
    # Drop the leading PASS/FAIL/UNSURE and take rest as reason
    upper = raw.upper()
    for token in ("PASS", "FAIL", "UNSURE"):
        if token in upper:
            idx = upper.index(token)
            after = raw[idx + len(token) :].strip(" .")
            return after if after else raw
    return raw
