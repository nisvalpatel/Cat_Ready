"""
Vision: describe images for inspection context (OpenAI vision).
"""
import base64
import os

from django.conf import settings


def describe_image(image_path: str) -> str:
    """
    Describe one image for inspection (condition, damage, etc.).
    Returns a short description or empty string on error.
    """
    if not getattr(settings, "OPENAI_API_KEY", None):
        return ""
    if not os.path.isfile(image_path):
        return ""
    try:
        from openai import OpenAI

        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        with open(image_path, "rb") as f:
            b64 = base64.standard_b64encode(f.read()).decode("utf-8")
        # Prefer common image types
        ext = os.path.splitext(image_path)[1].lower()
        mime = "image/jpeg"
        if ext in (".png",):
            mime = "image/png"
        elif ext in (".gif",):
            mime = "image/gif"
        elif ext in (".webp",):
            mime = "image/webp"

        response = client.chat.completions.create(
            model=getattr(settings, "OPENAI_VISION_MODEL", "gpt-4o"),
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Describe this image briefly for a vehicle pre-start inspection: note condition, any visible damage, wear, or concerns. One or two sentences.",
                        },
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:{mime};base64,{b64}"},
                        },
                    ],
                }
            ],
            max_tokens=300,
        )
        text = response.choices[0].message.content if response.choices else ""
        return (text or "").strip()
    except Exception:
        return ""
