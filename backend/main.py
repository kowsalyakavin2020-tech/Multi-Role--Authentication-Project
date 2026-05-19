from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from auth import generate_otp, verify_otp, check_user, create_token, register_user

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MobileRequest(BaseModel):
    mobile: str

class OTPRequest(BaseModel):
    mobile: str
    otp: str

class RegisterRequest(BaseModel):
    name: str
    mobile: str
    location: str
    business_name: str
    business_type: str
    role: str

@app.post("/auth/send-otp")
def send_otp(request: MobileRequest):
    otp = generate_otp(request.mobile)
    return {"message": "OTP Sent", "otp": otp}

@app.post("/auth/verify-otp")
def verify_otp_route(request: OTPRequest):
    is_valid = verify_otp(request.mobile, request.otp)
    if not is_valid:
        return {"error": "Invalid OTP"}
    user = check_user(request.mobile)
    token = create_token({"mobile": request.mobile, "role": user["role"]})
    return {
        "token": token,
        "role": user["role"],
        "is_new_user": user["is_new_user"],
        "user_id": user.get("user_id", "")
    }

@app.post("/auth/register")
def register(request: RegisterRequest):
    user_id = register_user(request.dict())
    token = create_token({"mobile": request.mobile, "role": request.role})
    return {
        "token": token,
        "role": request.role,
        "user_id": user_id
    }