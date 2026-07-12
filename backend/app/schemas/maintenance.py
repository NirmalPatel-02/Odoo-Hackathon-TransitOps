from pydantic import BaseModel, Field
from decimal import Decimal
from datetime import date
from typing import Optional
from app.models.maintenance import MaintenanceStatus

class MaintenanceBase(BaseModel):
    vehicle_id: int
    issue_description: str = Field(..., min_length=5)
    start_date: date

class MaintenanceCreate(MaintenanceBase):
    pass

class MaintenanceClose(BaseModel):
    cost: Decimal = Field(..., ge=0)
    end_date: date

class MaintenanceResponse(MaintenanceBase):
    id: int
    cost: Decimal
    status: MaintenanceStatus
    end_date: Optional[date] = None

    class Config:
        from_attributes = True
