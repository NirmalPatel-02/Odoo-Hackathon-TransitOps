from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    name: str = Field(..., min_length=2, description="User's full name")
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters.")
    role_name: str = Field(..., description="Role must be Fleet Manager, Driver, Safety Officer, or Financial Analyst.")

class UserResponse(UserBase):
    id: int
    name: str
    role_name: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
