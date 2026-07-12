from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.api.deps import RoleChecker
from app.models.vehicle import Vehicle, VehicleStatus
from app.schemas.vehicle import VehicleCreate, VehicleResponse, VehicleUpdate

router = APIRouter()

allow_fleet_manager = RoleChecker(["Fleet Manager"])
allow_all_staff = RoleChecker(["Fleet Manager", "Driver", "Safety Officer", "Financial Analyst"])

@router.post("/", response_model=VehicleResponse, status_code=status.HTTP_201_CREATED)
def register_vehicle(
    vehicle_in: VehicleCreate,
    db: Session = Depends(get_db),
    current_user = Depends(allow_fleet_manager)
):
    """Only Fleet Managers can register new fleet assets."""
    existing = db.query(Vehicle).filter(Vehicle.registration_number == vehicle_in.registration_number).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"A vehicle with registration plate '{vehicle_in.registration_number}' is already registered."
        )

    new_vehicle = Vehicle(**vehicle_in.model_dump())
    db.add(new_vehicle)
    db.commit()
    db.refresh(new_vehicle)
    return new_vehicle

@router.get("/", response_model=List[VehicleResponse])
def list_vehicles(
    db: Session = Depends(get_db),
    current_user = Depends(allow_all_staff)
):
    """All authenticated organization personnel can view the vehicle list."""
    return db.query(Vehicle).all()

@router.get("/{vehicle_id}", response_model=VehicleResponse)
def get_vehicle_details(
    vehicle_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(allow_all_staff)
):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle record not found.")
    return vehicle

@router.patch("/{vehicle_id}", response_model=VehicleResponse)
def update_vehicle(
    vehicle_id: int,
    vehicle_update: VehicleUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(allow_fleet_manager)
):
    """Allows updating odometer parameters or scheduling maintenance/retirement state transitions."""
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle record not found.")

    update_data = vehicle_update.model_dump(exclude_unset=True)

    if "odometer" in update_data and update_data["odometer"] < vehicle.odometer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Odometer readings cannot be updated backward from current values."
        )

    for field, val in update_data.items():
        setattr(vehicle, field, val)

    db.commit()
    db.refresh(vehicle)

    if vehicle.max_load_capacity <= 0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Database record integrity violation: Vehicle max load capacity must be greater than 0."
        )

    return vehicle
