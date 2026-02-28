"""
Inspection and step models. Matches migration 0001; log field added in 0002.
"""
from django.db import models

RESULT_CHOICES = [
    ("PASS", "PASS"),
    ("FAIL", "FAIL"),
    ("UNSURE", "UNSURE"),
]


class Inspection(models.Model):
    vehicle_id = models.CharField(max_length=255, blank=True)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ["-started_at"]

    def __str__(self):
        return f"Inspection {self.id} ({self.started_at})"


class InspectionStep(models.Model):
    inspection = models.ForeignKey(
        Inspection, on_delete=models.CASCADE, related_name="steps"
    )
    step_index = models.PositiveIntegerField(
        help_text="Order of this step (0-based)."
    )
    step_name = models.CharField(max_length=255, blank=True)
    audio = models.FileField(
        upload_to="steps/audio/%Y/%m/%d/", blank=True, null=True
    )
    transcript = models.TextField(
        blank=True, help_text="From STT or sent by client."
    )
    result = models.CharField(
        max_length=10, blank=True, choices=RESULT_CHOICES
    )
    result_reason = models.TextField(
        blank=True, help_text="Optional LLM explanation."
    )
    log = models.JSONField(
        blank=True,
        null=True,
        help_text="Step log: transcript, image_descriptions, llm_raw.",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["inspection", "step_index"]
        unique_together = [("inspection", "step_index")]

    def __str__(self):
        return f"Step {self.step_index}: {self.step_name or 'Unnamed'}"


class StepImage(models.Model):
    step = models.ForeignKey(
        InspectionStep, on_delete=models.CASCADE, related_name="images"
    )
    image = models.ImageField(upload_to="steps/images/%Y/%m/%d/")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for step {self.step_id}"
