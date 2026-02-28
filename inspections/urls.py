from django.urls import path

from . import views

app_name = "inspections"

urlpatterns = [
    path("inspections/", views.InspectionListCreateView.as_view(), name="inspection-list"),
    path("inspections/<int:pk>/", views.InspectionDetailView.as_view(), name="inspection-detail"),
    path("inspections/<int:inspection_id>/steps/", views.StepCreateView.as_view(), name="step-create"),
]
