from pydantic import BaseModel, Field, field_validator
from decimal import Decimal
from app.models.vehicle import VehicleStatus
from typing import Optional

class VehicleBase(BaseModel):
    registration_number: str = Field(..., min_length=3, max_length=50, description="Unique registration license plate")
    model: str = Field(..., min_length=2, max_length=255, description="Vehicle make and model")
    type: str = Field(..., min_length=2, max_length=100, description="Type e.g. Box Truck, Cargo Van, Sedan")
    max_load_capacity: Decimal = Field(..., gt=0, description="Maximum cargo load capacity in kilograms")
    odometer: int = Field(..., ge=0, description="Current odometer reading in kilometers")
    acquisition_cost: Decimal = Field(..., gt=0, description="Asset procurement price")

    @field_validator("registration_number")
    @classmethod
    def clean_reg_number(cls, v: str) -> str:
        return v.strip().upper()

class VehicleCreate(VehicleBase):
    pass

class VehicleUpdate(BaseModel):
    model: Optional[str] = None
    type: Optional[str] = None
    max_load_capacity: Optional[Decimal] = None
    odometer: Optional[int] = None
    status: Optional[VehicleStatus] = None

class VehicleResponse(VehicleBase):
    id: int
    status: VehicleStatus

    class Config:
        from_attributes = True
