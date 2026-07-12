from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.api.deps import RoleChecker
from app.models.fuel_log import FuelLog
from app.models.expense import Expense
from app.models.vehicle import Vehicle
from app.schemas.fuel_expenses import FuelLogCreate, FuelLogResponse, ExpenseCreate, ExpenseResponse

router = APIRouter()

allow_financial_or_manager = RoleChecker(["Fleet Manager", "Financial Analyst"])

@router.post("/fuel", response_model=FuelLogResponse, status_code=status.HTTP_201_CREATED)
def record_fuel_log(log_in: FuelLogCreate, db: Session = Depends(get_db), current_user = Depends(allow_financial_or_manager)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == log_in.vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found.")

    new_log = FuelLog(**log_in.model_dump())
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log

@router.post("/expense", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
def record_expense(expense_in: ExpenseCreate, db: Session = Depends(get_db), current_user = Depends(allow_financial_or_manager)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == expense_in.vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found.")

    new_expense = Expense(**expense_in.model_dump())
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return new_expense
