from sqlalchemy import Column, Integer, String, Float, Enum, Date
from sqlalchemy.orm import relationship
from ..core.database import Base
import enum
from datetime import date

class DriverStatus(str, enum.Enum):
    AVAILABLE = "Available"
    ON_TRIP = "On Trip"
    OFF_DUTY = "Off Duty"
    SUSPENDED = "Suspended"

class Driver(Base):
    __tablename__ = "drivers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    license_number = Column(String(30), unique=True, nullable=False)
    license_category = Column(String(20), nullable=False)
    license_expiry = Column(Date, nullable=False)
    contact_number = Column(String(20), nullable=False)
    safety_score = Column(Float, default=5.0)
    status = Column(Enum(DriverStatus), default=DriverStatus.AVAILABLE)

    trips = relationship("Trip", back_populates="driver")