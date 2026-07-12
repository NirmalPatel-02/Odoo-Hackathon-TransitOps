from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class VehicleBase(BaseModel):
    registration_number: str = Field(..., min_length=5, max_length=20, description="Unique vehicle registration number")
    name: str = Field(..., min_length=2, max_length=100)
    type: str = Field(..., description="e.g., Truck, Van, Car")
    max_load_capacity: float = Field(..., gt=0)
    odometer: int = Field(default=0, ge=0)
    acquisition_cost: float = Field(..., gt=0)

class VehicleCreate(VehicleBase):
    status: str = Field(default="Available", pattern="^(Available|On Trip|In Shop|Retired)$")

class VehicleUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    odometer: Optional[int] = None
    status: Optional[str] = Field(None, pattern="^(Available|On Trip|In Shop|Retired)$")

class VehicleResponse(VehicleBase):
    id: int
    status: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True   # Important for SQLAlchemy ORM