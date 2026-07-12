from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.schemas.maintenance import MaintenanceCreate, MaintenanceResponse, MaintenanceUpdate
from app.models.maintenance import Maintenance
from app.models.vehicle import Vehicle, VehicleStatus

router = APIRouter()

@router.post("/", response_model=MaintenanceResponse, status_code=status.HTTP_201_CREATED)
def create_maintenance(maintenance: MaintenanceCreate, db: Session = Depends(get_db)):
    # Check if vehicle exists
    vehicle = db.query(Vehicle).filter(Vehicle.id == maintenance.vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    # Create maintenance record
    db_maintenance = Maintenance(
        description=maintenance.description,
        cost=maintenance.cost,
        vehicle_id=maintenance.vehicle_id,
        status="In Progress"
    )
    db.add(db_maintenance)
    
    # Update vehicle status to In Shop
    vehicle.status = VehicleStatus.IN_SHOP
    db.commit()
    db.refresh(db_maintenance)
    db.refresh(vehicle)
    
    return db_maintenance

@router.get("/", response_model=List[MaintenanceResponse])
def list_maintenance(db: Session = Depends(get_db)):
    maintenances = db.query(Maintenance).all()
    return maintenances

@router.get("/{maintenance_id}", response_model=MaintenanceResponse)
def get_maintenance(maintenance_id: int, db: Session = Depends(get_db)):
    maintenance = db.query(Maintenance).filter(Maintenance.id == maintenance_id).first()
    if not maintenance:
        raise HTTPException(status_code=404, detail="Maintenance record not found")
    return maintenance

@router.put("/{maintenance_id}/close", response_model=MaintenanceResponse)
def close_maintenance(maintenance_id: int, update: MaintenanceUpdate, db: Session = Depends(get_db)):
    maintenance = db.query(Maintenance).filter(Maintenance.id == maintenance_id).first()
    if not maintenance:
        raise HTTPException(status_code=404, detail="Maintenance record not found")
    
    # Update maintenance
    if update.end_date:
        maintenance.end_date = update.end_date
    maintenance.status = "Completed"
    
    # Update vehicle status back to Available (unless retired)
    vehicle = db.query(Vehicle).filter(Vehicle.id == maintenance.vehicle_id).first()
    if vehicle and vehicle.status != VehicleStatus.RETIRED:
        vehicle.status = VehicleStatus.AVAILABLE
    
    db.commit()
    db.refresh(maintenance)
    db.refresh(vehicle)
    
    return maintenance