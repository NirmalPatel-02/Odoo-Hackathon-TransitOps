from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base

class Maintenance(Base):
    __tablename__ = "maintenance_logs"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String(255), nullable=False)
    cost = Column(Float, default=0.0)
    start_date = Column(DateTime, server_default=func.now())
    end_date = Column(DateTime, nullable=True)
    status = Column(String(50), default="In Progress")  # in progress / completed

    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False)

    vehicle = relationship("Vehicle", back_populates="maintenance_logs")