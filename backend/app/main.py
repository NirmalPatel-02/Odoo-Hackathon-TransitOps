from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine
from app.api.v1 import auth , vehicles

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TransitOps API",
    version="1.0.0",
    description="Odoo Hackathon Enterprise Transport Architecture"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(vehicles.router, prefix="/api/v1/vehicles", tags=["Vehicle Registry"])

@app.get("/")
def health_check():
    return {"status": "healthy", "system": "TransitOps Platform"}
