from pydantic import BaseModel, Field
from decimal import Decimal
from datetime import date
from typing import Optional

class FuelLogBase(BaseModel):
    vehicle_id: int
    liters: Decimal = Field(..., gt=0)
    cost: Decimal = Field(..., gt=0)
    date: date

class FuelLogCreate(FuelLogBase):
    pass

class FuelLogResponse(FuelLogBase):
    id: int
    class Config:
        from_attributes = True

class ExpenseBase(BaseModel):
    vehicle_id: int
    amount: Decimal = Field(..., gt=0)
    type: str = Field(..., min_length=2, max_length=100)
    date: date
    description: Optional[str] = None

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseResponse(ExpenseBase):
    id: int
    class Config:
        from_attributes = True
