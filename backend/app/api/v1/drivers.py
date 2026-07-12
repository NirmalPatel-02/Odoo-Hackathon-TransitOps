from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.api.deps import RoleChecker
from app.models.driver import Driver
from app.schemas.driver import DriverCreate, DriverResponse, DriverUpdate

router = APIRouter()

allow_safety_or_manager = RoleChecker(["Fleet Manager", "Safety Officer"])
allow_all_staff = RoleChecker(["Fleet Manager", "Driver", "Safety Officer", "Financial Analyst"])

@router.post("/", response_model=DriverResponse, status_code=status.HTTP_201_CREATED)
def register_driver(driver_in: DriverCreate, db: Session = Depends(get_db), current_user = Depends(allow_safety_or_manager)):
    """Only Safety Officers or Fleet Managers can onboard drivers."""
    existing = db.query(Driver).filter(Driver.license_number == driver_in.license_number).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Driver license plate string '{driver_in.license_number}' is already registered."
        )

    new_driver = Driver(**driver_in.model_dump())
    db.add(new_driver)
    db.commit()
    db.refresh(new_driver)
    return new_driver

@router.get("/", response_model=List[DriverResponse])
def list_drivers(db: Session = Depends(get_db), current_user = Depends(allow_all_staff)):
    return db.query(Driver).all()

@router.get("/{driver_id}", response_model=DriverResponse)
def get_driver_details(driver_id: int, db: Session = Depends(get_db), current_user = Depends(allow_all_staff)):
    driver = db.query(Driver).filter(Driver.id == driver_id).first()
    if not driver:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Driver record not found.")
    return driver

@router.patch("/{driver_id}", response_model=DriverResponse)
def update_driver(driver_id: int, driver_update: DriverUpdate, db: Session = Depends(get_db), current_user = Depends(allow_safety_or_manager)):
    driver = db.query(Driver).filter(Driver.id == driver_id).first()
    if not driver:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Driver record not found.")

    update_data = driver_update.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(driver, field, val)

    db.commit()
    db.refresh(driver)
    return driver
