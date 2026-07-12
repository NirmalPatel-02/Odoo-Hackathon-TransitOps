from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class MaintenanceBase(BaseModel):
    description: str = Field(..., min_length=5, max_length=255)
    cost: Optional[float] = 0.0

class MaintenanceCreate(MaintenanceBase):
    vehicle_id: int

class MaintenanceUpdate(BaseModel):
    description: Optional[str] = None
    cost: Optional[float] = None
    end_date: Optional[datetime] = None
    status: Optional[str] = Field(None, pattern="^(In Progress|Completed)$")

class MaintenanceResponse(MaintenanceBase):
    id: int
    vehicle_id: int
    start_date: datetime
    end_date: Optional[datetime] = None
    status: str
    vehicle_registration: Optional[str] = None

    class Config:
        from_attributes = True