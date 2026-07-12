from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
import csv
import io
from decimal import Decimal
from app.core.database import get_db
from app.api.deps import RoleChecker
from app.models.vehicle import Vehicle, VehicleStatus
from app.models.fuel_log import FuelLog
from app.models.expense import Expense
from app.models.trip import Trip
from app.schemas.reports import FleetSummaryReport, VehicleAnalyticsReport

router = APIRouter()
allow_analyst_or_manager = RoleChecker(["Fleet Manager", "Financial Analyst"])

def calculate_report_data(db: Session):
    vehicles = db.query(Vehicle).all()
    vehicles_data = []

    total_fleet_cost = Decimal("0.00")
    active_count = 0

    for v in vehicles:
        if v.status == VehicleStatus.ON_TRIP:
            active_count += 1

        fuel_cost = db.query(func.sum(FuelLog.cost)).filter(FuelLog.vehicle_id == v.id).scalar() or Decimal("0.00")
        fuel_liters = db.query(func.sum(FuelLog.liters)).filter(FuelLog.vehicle_id == v.id).scalar() or Decimal("0.00")

        maint_cost = db.query(func.sum(Expense.amount)).filter(
            Expense.vehicle_id == v.id,
            Expense.type.ilike("%Maintenance%")
        ).scalar() or Decimal("0.00")

        op_cost = fuel_cost + maint_cost
        total_fleet_cost += op_cost

        total_distance = db.query(func.sum(Trip.planned_distance)).filter(Trip.vehicle_id == v.id).scalar() or Decimal("0.00")
        fuel_efficiency = total_distance / fuel_liters if fuel_liters > 0 else Decimal("0.00")

        simulated_revenue = total_distance * Decimal("15.50")

        denominator = Decimal(str(v.acquisition_cost))
        vehicle_roi = (simulated_revenue - op_cost) / denominator if denominator > 0 else Decimal("0.00")

        vehicles_data.append(
            VehicleAnalyticsReport(
                vehicle_id=v.id,
                registration_number=v.registration_number,
                fuel_efficiency=round(fuel_efficiency, 2),
                fleet_utilization=Decimal("100.00") if v.status == VehicleStatus.ON_TRIP else Decimal("0.00"),
                total_fuel_cost=round(fuel_cost, 2),
                total_maintenance_cost=round(maint_cost, 2),
                total_operational_cost=round(op_cost, 2),
                vehicle_roi=round(vehicle_roi, 4)
            )
        )

    total_vehicles = len(vehicles)
    utilization = (Decimal(str(active_count)) / Decimal(str(total_vehicles)) * 100) if total_vehicles > 0 else Decimal("0.00")

    return FleetSummaryReport(
        total_active_vehicles=active_count,
        overall_fleet_utilization_pct=round(utilization, 2),
        total_operational_expenses=round(total_fleet_cost, 2),
        vehicles_data=vehicles_data
    )

@router.get("/summary", response_model=FleetSummaryReport)
def get_fleet_summary(db: Session = Depends(get_db), current_user = Depends(allow_analyst_or_manager)):
    """Generates complete aggregated operational metrics and analytics values."""
    return calculate_report_data(db)

@router.get("/export/csv")
def export_report_csv(db: Session = Depends(get_db), current_user = Depends(allow_analyst_or_manager)):
    """Generates an exportable CSV document file container for financial audit analysis data."""
    report = calculate_report_data(db)

    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow(["Vehicle ID", "Registration Number", "Fuel Efficiency (km/L)", "Total Fuel Cost", "Total Maintenance Cost", "Total Operational Cost", "Vehicle ROI"])

    for row in report.vehicles_data:
        writer.writerow([
            row.vehicle_id, row.registration_number, row.fuel_efficiency,
            row.total_fuel_cost, row.total_maintenance_cost, row.total_operational_cost, row.vehicle_roi
        ])

    output.seek(0)

    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=fleet_operational_report.csv"}
    )
