from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.api.deps import RoleChecker
from app.models.maintenance import Maintenance, MaintenanceStatus
from app.models.vehicle import Vehicle, VehicleStatus
from app.models.expense import Expense
from app.schemas.maintenance import MaintenanceCreate, MaintenanceResponse, MaintenanceClose

router = APIRouter()

allow_fleet_manager = RoleChecker(["Fleet Manager"])
allow_all_staff = RoleChecker(["Fleet Manager", "Driver", "Safety Officer", "Financial Analyst"])

@router.post("/", response_model=MaintenanceResponse, status_code=status.HTTP_201_CREATED)
def create_maintenance_log(
    log_in: MaintenanceCreate,
    db: Session = Depends(get_db),
    current_user = Depends(allow_fleet_manager)
):
    """Creates an active service log and pushes the target vehicle status to 'In Shop'."""
    vehicle = db.query(Vehicle).filter(Vehicle.id == log_in.vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found.")

    if vehicle.status == VehicleStatus.ON_TRIP:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Vehicle is currently on a trip and cannot enter maintenance.")
    if vehicle.status == VehicleStatus.RETIRED:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Retired vehicles cannot enter maintenance.")

    vehicle.status = VehicleStatus.IN_SHOP

    new_log = Maintenance(**log_in.model_dump())
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log

@router.get("/", response_model=List[MaintenanceResponse])
def list_maintenance_logs(db: Session = Depends(get_db), current_user = Depends(allow_all_staff)):
    return db.query(Maintenance).all()

@router.patch("/{log_id}/close", response_model=MaintenanceResponse)
def close_maintenance_log(
    log_id: int,
    close_in: MaintenanceClose,
    db: Session = Depends(get_db),
    current_user = Depends(allow_fleet_manager)
):
    """Closes an active maintenance log, restores vehicle availability, and populates financial logs."""
    log = db.query(Maintenance).filter(Maintenance.id == log_id).first()
    if not log:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Maintenance record not found.")

    if log.status == MaintenanceStatus.CLOSED:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This maintenance log is already closed.")

    vehicle = db.query(Vehicle).filter(Vehicle.id == log.vehicle_id).first()

    log.status = MaintenanceStatus.CLOSED
    log.cost = close_in.cost
    log.end_date = close_in.end_date

    if vehicle and vehicle.status == VehicleStatus.IN_SHOP:
        vehicle.status = VehicleStatus.AVAILABLE

    maintenance_expense = Expense(
        vehicle_id=log.vehicle_id,
        amount=close_in.cost,
        type="Maintenance",
        date=close_in.end_date,
        description=f"Auto-logged from completed Maintenance Log #{log.id}: {log.issue_description}"
    )
    db.add(maintenance_expense)

    db.commit()
    db.refresh(log)
    return log
