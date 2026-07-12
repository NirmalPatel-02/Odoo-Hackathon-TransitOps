from pydantic import BaseModel, Field
from decimal import Decimal
from typing import Optional
from app.models.trip import TripStatus

class TripBase(BaseModel):
    source: str = Field(..., min_length=2, max_length=255)
    destination: str = Field(..., min_length=2, max_length=255)
    cargo_weight: Decimal = Field(..., gt=0, description="Weight in kilograms")
    planned_distance: Decimal = Field(..., gt=0, description="Distance in kilometers")
    vehicle_id: int
    driver_id: int

class TripCreate(TripBase):
    pass

class TripStatusUpdate(BaseModel):
    status: TripStatus

class TripResponse(TripBase):
    id: int
    status: TripStatus

    class Config:
        from_attributes = True
