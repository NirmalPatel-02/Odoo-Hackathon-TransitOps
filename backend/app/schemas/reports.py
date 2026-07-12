from pydantic import BaseModel
from decimal import Decimal
from typing import List

class VehicleAnalyticsReport(BaseModel):
    vehicle_id: int
    registration_number: str
    fuel_efficiency: Decimal
    fleet_utilization: Decimal
    total_fuel_cost: Decimal
    total_maintenance_cost: Decimal
    total_operational_cost: Decimal
    vehicle_roi: Decimal

class FleetSummaryReport(BaseModel):
    total_active_vehicles: int
    overall_fleet_utilization_pct: Decimal
    total_operational_expenses: Decimal
    vehicles_data: List[VehicleAnalyticsReport]
