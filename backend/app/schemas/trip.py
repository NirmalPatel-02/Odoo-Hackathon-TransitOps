from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class TripBase(BaseModel):
    source: str = Field(..., min_length=2, max_length=100)
    destination: str = Field(..., min_length=2, max_length=100)
    cargo_weight: float = Field(..., gt=0)
    planned_distance: float = Field(..., gt=0)

class TripCreate(TripBase):
    vehicle_id: int
    driver_id: int

class TripUpdate(BaseModel):
    status: Optional[str] = Field(None, pattern="^(Draft|Dispatched|Completed|Cancelled)$")
    actual_distance: Optional[float] = None
    end_odometer: Optional[int] = None

class TripResponse(TripBase):
    id: int
    vehicle_id: int
    driver_id: int
    status: str
    start_odometer: Optional[int] = None
    end_odometer: Optional[int] = None
    actual_distance: Optional[float] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    # Optional nested data for better response
    vehicle_registration: Optional[str] = None
    driver_name: Optional[str] = None

    class Config:
        from_attributes = True

class TripListResponse(BaseModel):
    id: int
    source: str
    destination: str
    status: str
    cargo_weight: float
    vehicle_id: int
    driver_id: int
    created_at: datetime

    class Config:
        from_attributes = True