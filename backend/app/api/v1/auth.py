from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_password_hash, verify_password, create_access_token
from app.api.deps import get_current_user
from app.models.user import User
from app.models.role import Role
from app.schemas.user import UserCreate, UserResponse, Token

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user_in.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    role = db.query(Role).filter(Role.name == user_in.role_name).first()
    if not role:
        raise HTTPException(status_code=400, detail=f"Role '{user_in.role_name}' does not exist.")

    hashed_pwd = get_password_hash(user_in.password)
    new_user = User(
        email=user_in.email,
        name=user_in.name,
        hashed_password=hashed_pwd,
        role_id=role.id
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    new_user.role_name = role.name
    return new_user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    access_token = create_access_token(data={"sub": user.email})

    user_info = UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        role_name=user.role.name
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_info
    }

@router.get("/me", response_model=UserResponse)
def get_user_profile(current_user: User = Depends(get_current_user)):
    """
    Pass the Bearer token in the header.
    Returns the currently logged-in user's profile info.
    """

    current_user.role_name = current_user.role.name
    return current_user
