from sqlalchemy import Column, Integer, String, Numeric, Enum
import enum
from app.core.database import Base
from sqlalchemy.orm import relationship

class VehicleStatus(str, enum.Enum):
    AVAILABLE = "Available"
    ON_TRIP = "On Trip"
    IN_SHOP = "In Shop"
    RETIRED = "Retired"

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    registration_number = Column(String(50), unique=True, index=True, nullable=False)
    model = Column(String(255), nullable=False)
    type = Column(String(100), nullable=False)
    max_load_capacity = Column(Numeric(10, 2), nullable=False)
    odometer = Column(Integer, default=0, nullable=False)
    acquisition_cost = Column(Numeric(12, 2), nullable=False)

    status = Column(
        Enum(VehicleStatus, values_callable=lambda obj: [e.value for e in obj]),
        default=VehicleStatus.AVAILABLE,
        nullable=False
    )

    maintenance_logs = relationship(
        "Maintenance",
        back_populates="vehicle",
        cascade="all, delete-orphan"
    )