from sqlalchemy import Column, Integer, String, Numeric, Enum, Date
import enum
from app.core.database import Base

class DriverStatus(str, enum.Enum):
    AVAILABLE = "Available"
    ON_TRIP = "On Trip"
    OFF_DUTY = "Off Duty"
    SUSPENDED = "Suspended"

class Driver(Base):
    __tablename__ = "drivers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    license_number = Column(String(100), unique=True, index=True, nullable=False)
    license_category = Column(String(50), nullable=False)
    license_expiry_date = Column(Date, nullable=False)
    contact_number = Column(String(50), nullable=False)
    safety_score = Column(Numeric(5, 2), default=100.00, nullable=False)

    status = Column(
        Enum(DriverStatus, values_callable=lambda obj: [e.value for e in obj]),
        default=DriverStatus.AVAILABLE,
        nullable=False
    )
