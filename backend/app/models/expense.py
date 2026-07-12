from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    category = Column(String(50), nullable=False)   # Fuel, Toll, Maintenance, etc.
    description = Column(String(255))
    date = Column(DateTime, server_default=func.now())

    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=True)
    trip_id = Column(Integer, ForeignKey("trips.id"), nullable=True)

    vehicle = relationship("Vehicle")
    trip = relationship("Trip")