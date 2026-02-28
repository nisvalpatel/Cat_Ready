from django.contrib import admin
from .models import Inspection, InspectionStep, StepImage


class StepImageInline(admin.TabularInline):
    model = StepImage
    extra = 0


class InspectionStepInline(admin.TabularInline):
    model = InspectionStep
    extra = 0
    show_change_link = True


@admin.register(Inspection)
class InspectionAdmin(admin.ModelAdmin):
    list_display = ["id", "vehicle_id", "started_at", "completed_at"]
    inlines = [InspectionStepInline]


@admin.register(InspectionStep)
class InspectionStepAdmin(admin.ModelAdmin):
    list_display = ["id", "inspection", "step_index", "step_name", "result", "created_at"]
    inlines = [StepImageInline]


@admin.register(StepImage)
class StepImageAdmin(admin.ModelAdmin):
    list_display = ["id", "step", "created_at"]
