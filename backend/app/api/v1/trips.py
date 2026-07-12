from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from app.core.database import get_db
from app.api.deps import RoleChecker
from app.models.trip import Trip, TripStatus
from app.models.vehicle import Vehicle, VehicleStatus
from app.models.driver import Driver, DriverStatus
from app.schemas.trip import TripCreate, TripResponse, TripStatusUpdate

router = APIRouter()

allow_dispatcher_or_manager = RoleChecker(["Fleet Manager", "Driver"])
allow_all_staff = RoleChecker(["Fleet Manager", "Driver", "Safety Officer", "Financial Analyst"])

@router.post("/", response_model=TripResponse, status_code=status.HTTP_201_CREATED)
def create_trip(trip_in: TripCreate, db: Session = Depends(get_db), current_user = Depends(allow_dispatcher_or_manager)):
    """Creates a trip log and enforces strict relational validity checks."""
    vehicle = db.query(Vehicle).filter(Vehicle.id == trip_in.vehicle_id).first()
    driver = db.query(Driver).filter(Driver.id == trip_in.driver_id).first()

    if not vehicle or not driver:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assigned Vehicle or Driver records not found.")

    if vehicle.status in [VehicleStatus.RETIRED, VehicleStatus.IN_SHOP]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Selected vehicle is out of service or in shop.")

    if driver.status == DriverStatus.SUSPENDED or driver.license_expiry_date < date.today():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Driver license is suspended or expired.")

    if vehicle.status == VehicleStatus.ON_TRIP:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Vehicle is already assigned to an active trip.")
    if driver.status == DriverStatus.ON_TRIP:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Driver is already assigned to an active trip.")

    if trip_in.cargo_weight > vehicle.max_load_capacity:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cargo weight exceeds the maximum vehicle capacity.")

    new_trip = Trip(**trip_in.model_dump())
    db.add(new_trip)
    db.commit()
    db.refresh(new_trip)
    return new_trip

@router.get("/", response_model=List[TripResponse])
def list_trips(db: Session = Depends(get_db), current_user = Depends(allow_all_staff)):
    return db.query(Trip).all()

@router.patch("/{trip_id}/status", response_model=TripResponse)
def update_trip_status(trip_id: int, status_update: TripStatusUpdate, db: Session = Depends(get_db), current_user = Depends(allow_dispatcher_or_manager)):
    """Manages state transitions and triggers automatic status cascading[cite: 2]."""
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip record not found.")

    new_status = status_update.status
    vehicle = db.query(Vehicle).filter(Vehicle.id == trip.vehicle_id).first()
    driver = db.query(Driver).filter(Driver.id == trip.driver_id).first()

    if new_status == TripStatus.DISPATCHED:
        if vehicle.status == VehicleStatus.ON_TRIP or driver.status == DriverStatus.ON_TRIP:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Resource conflict: Asset is already deployed.")
        vehicle.status = VehicleStatus.ON_TRIP
        driver.status = DriverStatus.ON_TRIP

    elif new_status == TripStatus.COMPLETED:
        vehicle.status = VehicleStatus.AVAILABLE
        driver.status = DriverStatus.AVAILABLE

    elif new_status == TripStatus.CANCELLED:
        if trip.status == TripStatus.DISPATCHED:
            vehicle.status = VehicleStatus.AVAILABLE
            driver.status = DriverStatus.AVAILABLE

    trip.status = new_status
    db.commit()
    db.refresh(trip)
    return trip
