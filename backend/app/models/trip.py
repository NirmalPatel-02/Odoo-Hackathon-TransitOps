from sqlalchemy import Column, Integer, String, Numeric, Enum, ForeignKey
from sqlalchemy.orm import relationship
import enum
from app.core.database import Base

class TripStatus(str, enum.Enum):
    DRAFT = "Draft"
    DISPATCHED = "Dispatched"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"

class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    source = Column(String(255), nullable=False)
    destination = Column(String(255), nullable=False)
    cargo_weight = Column(Numeric(10, 2), nullable=False)
    planned_distance = Column(Numeric(10, 2), nullable=False)
    status = Column(
        Enum(TripStatus, values_callable=lambda obj: [e.value for e in obj]),
        default=TripStatus.DRAFT,
        nullable=False
    )

    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False)
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=False)

    vehicle = relationship("Vehicle")
    driver = relationship("Driver")
