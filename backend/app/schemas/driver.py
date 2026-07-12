from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime, date

class DriverBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    license_number: str = Field(..., min_length=5, max_length=30)
    license_category: str
    license_expiry: date
    contact_number: str
    safety_score: float = Field(default=5.0, ge=0, le=10)


class DriverCreate(DriverBase):
    status: str = Field(default="Available", pattern="^(Available|On Trip|Off Duty|Suspended)$")


class DriverUpdate(BaseModel):
    name: Optional[str] = None
    contact_number: Optional[str] = None
    license_expiry: Optional[date] = None
    safety_score: Optional[float] = None
    status: Optional[str] = None


class DriverResponse(DriverBase):
    id: int
    status: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True