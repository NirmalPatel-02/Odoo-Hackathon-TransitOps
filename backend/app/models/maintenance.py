from sqlalchemy import Column, Integer, String, Numeric, Enum, Date, Text, ForeignKey
from sqlalchemy.orm import relationship
import enum
from app.core.database import Base

class MaintenanceStatus(str, enum.Enum):
    OPEN = "Open"
    CLOSED = "Closed"

class Maintenance(Base):
    __tablename__ = "maintenance_logs"

    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id", ondelete="CASCADE"), nullable=False)
    issue_description = Column(Text, nullable=False)
    cost = Column(Numeric(10, 2), default=0.00, nullable=False)

    status = Column(
        Enum(MaintenanceStatus, values_callable=lambda obj: [e.value for e in obj]),
        default=MaintenanceStatus.OPEN,
        nullable=False
    )
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)

    vehicle = relationship("Vehicle", back_populates="maintenance_logs")
