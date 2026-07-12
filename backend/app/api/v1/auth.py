from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_password_hash, verify_password, create_access_token
from app.models.user import User
from app.models.role import Role
from app.schemas.user import UserCreate, UserResponse, Token

router = APIRouter()

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def signup(user_in: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    role = db.query(Role).filter(Role.name == user_in.role_name).first()
    if not role:
        role = Role(name=user_in.role_name)
        db.add(role)
        db.commit()
        db.refresh(role)

    # 3. Securely hash user password payload
    new_user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        role_id=role.id
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return UserResponse(id=new_user.id, email=new_user.email, role=role.name)

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password string."
        )

    access_token = create_access_token(data={"sub": user.email})
    return Token(access_token=access_token, token_type="bearer", role=user.role.name)
