from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional
from auth import generate_otp, verify_otp, check_user, create_token, register_user, verify_token
from database import get_connection
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# ─── Helper ────────────────────────────────────────────────
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload

# ─── Models ────────────────────────────────────────────────
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

class ProductModel(BaseModel):
    name: str
    category: str
    stock: int
    price: float
    status: Optional[str] = "Active"
    image: Optional[str] = ""

# ─── Auth Routes ───────────────────────────────────────────
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

# ─── Supplier Dashboard Stats ──────────────────────────────
@app.get("/supplier/dashboard/stats")
def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    mobile = current_user["mobile"]

    # Get supplier_id
    cursor.execute("SELECT user_id FROM users WHERE mobile = %s", (mobile,))
    supplier = cursor.fetchone()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    supplier_id = supplier["user_id"]

    # Total Products
    cursor.execute("SELECT COUNT(*) as total FROM products WHERE supplier_id = %s", (supplier_id,))
    total_products = cursor.fetchone()["total"]

    # Overall Stock
    cursor.execute("SELECT SUM(stock) as total_stock FROM products WHERE supplier_id = %s", (supplier_id,))
    overall_stock = cursor.fetchone()["total_stock"] or 0

    # Pending Vendor Requests
    cursor.execute("""
        SELECT COUNT(*) as pending FROM vendor_requests 
        WHERE supplier_id = %s AND status = 'Pending'
    """, (supplier_id,))
    pending_requests = cursor.fetchone()["pending"]

    # Recent Activity (last 5 products added)
    cursor.execute("""
        SELECT name, created_at FROM products 
        WHERE supplier_id = %s 
        ORDER BY created_at DESC LIMIT 5
    """, (supplier_id,))
    recent = cursor.fetchall()

    cursor.close()
    conn.close()

    return {
        "total_products": total_products,
        "overall_stock": overall_stock,
        "pending_requests": pending_requests,
        "recent_activity": recent
    }

# ─── Product Routes ────────────────────────────────────────
@app.get("/supplier/products")
def get_products(current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    mobile = current_user["mobile"]

    cursor.execute("SELECT user_id FROM users WHERE mobile = %s", (mobile,))
    supplier = cursor.fetchone()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    supplier_id = supplier["user_id"]

    cursor.execute("""
        SELECT * FROM products WHERE supplier_id = %s 
        ORDER BY created_at DESC
    """, (supplier_id,))
    products = cursor.fetchall()

    cursor.close()
    conn.close()
    return {"products": products}

@app.post("/supplier/products")
def add_product(product: ProductModel, current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    mobile = current_user["mobile"]

    cursor.execute("SELECT user_id FROM users WHERE mobile = %s", (mobile,))
    supplier = cursor.fetchone()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    supplier_id = supplier["user_id"]

    product_id = "PRD" + str(uuid.uuid4())[:5].upper()

    cursor.execute("""
        INSERT INTO products (product_id, supplier_id, name, category, stock, price, status, image)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        product_id, supplier_id, product.name, product.category,
        product.stock, product.price, product.status, product.image
    ))
    conn.commit()

    cursor.close()
    conn.close()
    return {"message": "Product added", "product_id": product_id}

@app.put("/supplier/products/{product_id}")
def update_product(product_id: str, product: ProductModel, current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE products 
        SET name=%s, category=%s, stock=%s, price=%s, status=%s, image=%s
        WHERE product_id=%s
    """, (
        product.name, product.category, product.stock,
        product.price, product.status, product.image, product_id
    ))
    conn.commit()

    cursor.close()
    conn.close()
    return {"message": "Product updated"}

@app.delete("/supplier/products/{product_id}")
def delete_product(product_id: str, current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM products WHERE product_id = %s", (product_id,))
    conn.commit()

    cursor.close()
    conn.close()
    return {"message": "Product deleted"}

# ─── Vendor Requests ───────────────────────────────────────
@app.get("/supplier/vendor-requests")
def get_vendor_requests(current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    mobile = current_user["mobile"]

    cursor.execute("SELECT user_id FROM users WHERE mobile = %s", (mobile,))
    supplier = cursor.fetchone()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    supplier_id = supplier["user_id"]

    cursor.execute("""
        SELECT vr.*, u.name as vendor_name, p.name as product_name
        FROM vendor_requests vr
        JOIN users u ON vr.vendor_id = u.user_id
        JOIN products p ON vr.product_id = p.product_id
        WHERE vr.supplier_id = %s
        ORDER BY vr.created_at DESC
    """, (supplier_id,))
    requests = cursor.fetchall()

    cursor.close()
    conn.close()
    return {"requests": requests}