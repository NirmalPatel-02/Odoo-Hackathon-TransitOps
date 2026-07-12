from pydantic import BaseModel, EmailStr, Field

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters.")
    role_name: str = Field(..., description="Role must be Fleet Manager, Driver, Safety Officer, or Financial Analyst.")

class UserResponse(UserBase):
    id: int
    role: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
