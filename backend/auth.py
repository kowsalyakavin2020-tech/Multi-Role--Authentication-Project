import random
import os
from datetime import datetime, timedelta
from jose import jwt
from database import get_connection
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ADMIN_MOBILE = os.getenv("ADMIN_MOBILE")

otp_store = {}

def generate_otp(mobile):
    otp = str(random.randint(100000, 999999))
    otp_store[mobile] = otp
    print(f"OTP for {mobile}: {otp}")
    return otp

def verify_otp(mobile, otp):
    if mobile not in otp_store:
        return False
    if otp_store[mobile] != otp:
        return False
    del otp_store[mobile]
    return True

def create_token(data):
    expire = datetime.utcnow() + timedelta(hours=24)
    data.update({"exp": expire})
    return jwt.encode(data, SECRET_KEY, algorithm="HS256")

def check_user(mobile):
    if mobile == ADMIN_MOBILE:
        return {"role": "admin", "is_new_user": False, "user_id": "ADMIN"}
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE mobile = %s", (mobile,))
    user = cursor.fetchone()
    conn.close()
    if user:
        return {
            "role": user["role"],
            "is_new_user": False,
            "user_id": user["user_id"]
        }
    else:
        return {"role": None, "is_new_user": True, "user_id": None}

def register_user(data):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    role = data["role"]
    prefix = "SUP" if role == "supplier" else "VEN"
    cursor.execute(
        "SELECT COUNT(*) as count FROM users WHERE role = %s",
        (role,)
    )
    count = cursor.fetchone()["count"] + 1
    user_id = f"{prefix}{count:03d}"
    cursor.execute(
        """INSERT INTO users 
        (user_id, name, mobile, role, location, business_name, business_type) 
        VALUES (%s, %s, %s, %s, %s, %s, %s)""",
        (user_id, data["name"], data["mobile"],
         data["role"], data["location"],
         data["business_name"], data["business_type"])
    )
    conn.commit()
    conn.close()
    return user_id