from pydantic import BaseModel, Field, field_validator
from datetime import date
from decimal import Decimal
from typing import Optional
from app.models.driver import DriverStatus

class DriverBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    license_number: str = Field(..., min_length=3, max_length=100)
    license_category: str = Field(..., min_length=1, max_length=50)
    license_expiry_date: date
    contact_number: str = Field(..., min_length=5, max_length=50)
    safety_score: Decimal = Field(Decimal("100.00"), ge=0, le=100)

    @field_validator("license_number")
    @classmethod
    def format_license(cls, v: str) -> str:
        return v.strip().upper()

class DriverCreate(DriverBase):
    pass

class DriverUpdate(BaseModel):
    name: Optional[str] = None
    license_category: Optional[str] = None
    license_expiry_date: Optional[date] = None
    contact_number: Optional[str] = None
    safety_score: Optional[Decimal] = None
    status: Optional[DriverStatus] = None

class DriverResponse(DriverBase):
    id: int
    status: DriverStatus

    class Config:
        from_attributes = True
