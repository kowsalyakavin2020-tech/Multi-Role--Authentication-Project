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

class OrderModel(BaseModel):
    product_id: str
    supplier_id: str
    quantity: int
    message: Optional[str] = ""

# ─── Auth Routes ───────────────────────────────────────────
@app.post("/auth/send-otp")
def send_otp(request: MobileRequest):
    otp = generate_otp(request.mobile)
    return {
        "success": True,
        "message": "OTP Sent",
        "data": {"otp": otp}
    }

@app.post("/auth/verify-otp")
def verify_otp_route(request: OTPRequest):
    is_valid = verify_otp(request.mobile, request.otp)
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    user = check_user(request.mobile)
    token = create_token({"mobile": request.mobile, "role": user["role"]})
    return {
        "success": True,
        "message": "OTP Verified",
        "data": {
            "token": token,
            "role": user["role"],
            "is_new_user": user["is_new_user"],
            "user_id": user.get("user_id", "")
        }
    }

@app.post("/auth/register")
def register(request: RegisterRequest):
    user_id = register_user(request.dict())
    token = create_token({"mobile": request.mobile, "role": request.role})
    return {
        "success": True,
        "message": "Registration successful",
        "data": {
            "token": token,
            "role": request.role,
            "user_id": user_id
        }
    }

# ─── Supplier Dashboard Stats ──────────────────────────────
@app.get("/supplier/dashboard/stats")
def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    mobile = current_user["mobile"]
    cursor.execute("SELECT user_id FROM users WHERE mobile = %s", (mobile,))
    supplier = cursor.fetchone()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    supplier_id = supplier["user_id"]
    cursor.execute("SELECT COUNT(*) as total FROM products WHERE supplier_id = %s", (supplier_id,))
    total_products = cursor.fetchone()["total"]
    cursor.execute("SELECT SUM(stock) as total_stock FROM products WHERE supplier_id = %s", (supplier_id,))
    overall_stock = cursor.fetchone()["total_stock"] or 0
    cursor.execute("SELECT COUNT(*) as pending FROM orders WHERE supplier_id = %s AND status = 'Pending'", (supplier_id,))
    pending_requests = cursor.fetchone()["pending"]
    cursor.execute("""
        SELECT name, created_at FROM products 
        WHERE supplier_id = %s 
        ORDER BY created_at DESC LIMIT 5
    """, (supplier_id,))
    recent = cursor.fetchall()
    cursor.close()
    conn.close()
    return {
        "success": True,
        "message": "Dashboard stats fetched successfully",
        "data": {
            "total_products": total_products,
            "overall_stock": overall_stock,
            "pending_requests": pending_requests,
            "recent_activity": recent
        }
    }

# ─── Supplier Product Routes ───────────────────────────────
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
    cursor.execute("SELECT * FROM products WHERE supplier_id = %s ORDER BY created_at DESC", (supplier_id,))
    products = cursor.fetchall()
    cursor.close()
    conn.close()
    return {
        "success": True,
        "message": "Products fetched successfully",
        "data": products
    }

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
    """, (product_id, supplier_id, product.name, product.category, product.stock, product.price, product.status, product.image))
    conn.commit()
    cursor.close()
    conn.close()
    return {
        "success": True,
        "message": "Product added successfully",
        "data": {"product_id": product_id}
    }

@app.put("/supplier/products/{product_id}")
def update_product(product_id: str, product: ProductModel, current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE products 
        SET name=%s, category=%s, stock=%s, price=%s, status=%s, image=%s
        WHERE product_id=%s
    """, (product.name, product.category, product.stock, product.price, product.status, product.image, product_id))
    conn.commit()
    cursor.close()
    conn.close()
    return {
        "success": True,
        "message": "Product updated successfully",
        "data": {"product_id": product_id}
    }

@app.delete("/supplier/products/{product_id}")
def delete_product(product_id: str, current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM products WHERE product_id = %s", (product_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {
        "success": True,
        "message": "Product deleted successfully",
        "data": {"product_id": product_id}
    }

# ─── Supplier Vendor Requests ──────────────────────────────
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
        SELECT o.*, u.name as vendor_name, p.name as product_name
        FROM orders o
        JOIN users u ON o.vendor_id = u.user_id
        JOIN products p ON o.product_id = p.product_id
        WHERE o.supplier_id = %s
        ORDER BY o.created_at DESC
    """, (supplier_id,))
    requests = cursor.fetchall()
    cursor.close()
    conn.close()
    return {
        "success": True,
        "message": "Vendor requests fetched successfully",
        "data": requests
    }

# ─── Supplier Approve/Reject Vendor Request ────────────────
@app.put("/supplier/vendor-requests/{order_id}/approve")
def approve_vendor_request(order_id: str, current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE orders SET status = 'Approved' WHERE order_id = %s", (order_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {
        "success": True,
        "message": "Request approved successfully",
        "data": {"order_id": order_id}
    }

@app.put("/supplier/vendor-requests/{order_id}/reject")
def reject_vendor_request(order_id: str, current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE orders SET status = 'Rejected' WHERE order_id = %s", (order_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {
        "success": True,
        "message": "Request rejected successfully",
        "data": {"order_id": order_id}
    }

# ─── Vendor Dashboard Summary ──────────────────────────────
@app.get("/vendor/dashboard/summary")
def get_vendor_summary(current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    mobile = current_user["mobile"]
    cursor.execute("SELECT user_id FROM users WHERE mobile = %s", (mobile,))
    vendor = cursor.fetchone()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    vendor_id = vendor["user_id"]
    cursor.execute("SELECT COUNT(*) as total FROM products WHERE status = 'Active'")
    total_products = cursor.fetchone()["total"]
    cursor.execute("SELECT COUNT(*) as total FROM orders WHERE vendor_id = %s", (vendor_id,))
    my_orders = cursor.fetchone()["total"]
    cursor.execute("SELECT COUNT(*) as total FROM orders WHERE vendor_id = %s AND status = 'Pending'", (vendor_id,))
    pending_requests = cursor.fetchone()["total"]
    cursor.execute("""
        SELECT o.*, p.name as product_name 
        FROM orders o
        JOIN products p ON o.product_id = p.product_id
        WHERE o.vendor_id = %s
        ORDER BY o.created_at DESC LIMIT 5
    """, (vendor_id,))
    recent_activity = cursor.fetchall()
    cursor.close()
    conn.close()
    return {
        "success": True,
        "message": "Dashboard summary fetched successfully",
        "data": {
            "total_products": total_products,
            "my_orders": my_orders,
            "pending_requests": pending_requests,
            "recent_activity": recent_activity
        }
    }

# ─── Vendor Browse Products ────────────────────────────────
@app.get("/vendor/products")
def get_vendor_products(current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT p.*, u.name as supplier_name 
        FROM products p
        JOIN users u ON p.supplier_id = u.user_id
        WHERE p.status = 'Active'
        ORDER BY p.created_at DESC
    """)
    products = cursor.fetchall()
    cursor.close()
    conn.close()
    return {
        "success": True,
        "message": "Products fetched successfully",
        "data": products
    }

# ─── Vendor Send Request ───────────────────────────────────
@app.post("/vendor/request")
def send_request(order: OrderModel, current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    mobile = current_user["mobile"]
    cursor.execute("SELECT user_id FROM users WHERE mobile = %s", (mobile,))
    vendor = cursor.fetchone()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    vendor_id = vendor["user_id"]
    order_id = "ORD" + str(uuid.uuid4())[:5].upper()
    cursor.execute("""
        INSERT INTO orders (order_id, vendor_id, supplier_id, product_id, quantity, message)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (order_id, vendor_id, order.supplier_id, order.product_id, order.quantity, order.message))
    conn.commit()
    cursor.close()
    conn.close()
    return {
        "success": True,
        "message": "Request sent successfully",
        "data": {"order_id": order_id}
    }

# ─── Vendor My Orders ──────────────────────────────────────
@app.get("/vendor/orders")
def get_vendor_orders(current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    mobile = current_user["mobile"]
    cursor.execute("SELECT user_id FROM users WHERE mobile = %s", (mobile,))
    vendor = cursor.fetchone()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    vendor_id = vendor["user_id"]
    cursor.execute("""
        SELECT o.*, p.name as product_name, u.name as supplier_name
        FROM orders o
        JOIN products p ON o.product_id = p.product_id
        JOIN users u ON o.supplier_id = u.user_id
        WHERE o.vendor_id = %s
        ORDER BY o.created_at DESC
    """, (vendor_id,))
    orders = cursor.fetchall()
    cursor.close()
    conn.close()
    return {
        "success": True,
        "message": "Orders fetched successfully",
        "data": orders
    }

# ─── Vendor Profile ────────────────────────────────────────
@app.get("/vendor/profile")
def get_vendor_profile(current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    mobile = current_user["mobile"]
    cursor.execute("SELECT * FROM users WHERE mobile = %s", (mobile,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "success": True,
        "message": "Profile fetched successfully",
        "data": user
    }

# ─── Admin Dashboard Stats ─────────────────────────────────
@app.get("/admin/dashboard/stats")
def get_admin_dashboard_stats(current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT COUNT(*) as total FROM users WHERE role = 'supplier'")
    total_suppliers = cursor.fetchone()["total"]
    cursor.execute("SELECT COUNT(*) as total FROM users WHERE role = 'vendor'")
    total_vendors = cursor.fetchone()["total"]
    cursor.execute("SELECT COUNT(*) as total FROM products")
    total_products = cursor.fetchone()["total"]
    cursor.execute("SELECT COUNT(*) as total FROM orders WHERE status = 'Pending'")
    pending_orders = cursor.fetchone()["total"]
    cursor.execute("SELECT SUM(stock) as total FROM products")
    total_stock = cursor.fetchone()["total"] or 0
    cursor.execute("""
        SELECT 'New product added' as action, created_at as time 
        FROM products ORDER BY created_at DESC LIMIT 5
    """)
    recent_activity = cursor.fetchall()
    cursor.close()
    conn.close()
    return {
        "success": True,
        "message": "Admin dashboard stats fetched successfully",
        "data": {
            "total_suppliers": total_suppliers,
            "total_vendors": total_vendors,
            "total_products": total_products,
            "pending_orders": pending_orders,
            "total_stock": total_stock,
            "recent_activity": recent_activity
        }
    }

# ─── Admin Get Suppliers ───────────────────────────────────
@app.get("/admin/suppliers")
def get_admin_suppliers(current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE role = 'supplier' ORDER BY created_at DESC")
    suppliers = cursor.fetchall()
    cursor.close()
    conn.close()
    return {
        "success": True,
        "message": "Suppliers fetched successfully",
        "data": suppliers
    }

# ─── Admin Get Vendors ─────────────────────────────────────
@app.get("/admin/vendors")
def get_admin_vendors(current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE role = 'vendor' ORDER BY created_at DESC")
    vendors = cursor.fetchall()
    cursor.close()
    conn.close()
    return {
        "success": True,
        "message": "Vendors fetched successfully",
        "data": vendors
    }

# ─── Admin Get Products ────────────────────────────────────
@app.get("/admin/products")
def get_admin_products(current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT p.*, u.name as supplier_name 
        FROM products p
        JOIN users u ON p.supplier_id = u.user_id
        ORDER BY p.created_at DESC
    """)
    products = cursor.fetchall()
    cursor.close()
    conn.close()
    return {
        "success": True,
        "message": "Products fetched successfully",
        "data": products
    }

# ─── Admin Get Orders ──────────────────────────────────────
@app.get("/admin/orders")
def get_admin_orders(current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT o.*, 
               v.name as vendor_name, 
               s.name as supplier_name,
               p.name as product_name
        FROM orders o
        JOIN users v ON o.vendor_id = v.user_id
        JOIN users s ON o.supplier_id = s.user_id
        JOIN products p ON o.product_id = p.product_id
        ORDER BY o.created_at DESC
    """)
    orders = cursor.fetchall()
    cursor.close()
    conn.close()
    return {
        "success": True,
        "message": "Orders fetched successfully",
        "data": orders
    }

# ─── Admin Approve Product ─────────────────────────────────
@app.put("/admin/products/{product_id}/approve")
def approve_product(product_id: str, current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE products SET status = 'Active' WHERE product_id = %s", (product_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {
        "success": True,
        "message": "Product approved successfully",
        "data": {"product_id": product_id}
    }

# ─── Admin Reject Product ──────────────────────────────────
@app.put("/admin/products/{product_id}/reject")
def reject_product(product_id: str, current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE products SET status = 'Rejected' WHERE product_id = %s", (product_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {
        "success": True,
        "message": "Product rejected successfully",
        "data": {"product_id": product_id}
    }

# ─── Admin Delete Product ──────────────────────────────────
@app.delete("/admin/products/{product_id}")
def admin_delete_product(product_id: str, current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM products WHERE product_id = %s", (product_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {
        "success": True,
        "message": "Product deleted successfully",
        "data": {"product_id": product_id}
    }

# ─── Admin Block/Unblock User ──────────────────────────────
@app.put("/admin/users/{user_id}/block")
def block_user(user_id: str, current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT status FROM users WHERE user_id = %s", (user_id,))
    user = cursor.fetchone()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    new_status = "Blocked" if user["status"] == "Active" else "Active"
    cursor.execute("UPDATE users SET status = %s WHERE user_id = %s", (new_status, user_id))
    conn.commit()
    cursor.close()
    conn.close()
    return {
        "success": True,
        "message": f"User {new_status} successfully",
        "data": {"user_id": user_id, "status": new_status}
    }

# ─── Admin Approve User ────────────────────────────────────
@app.put("/admin/users/{user_id}/approve")
def approve_user(user_id: str, current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET status = 'Active' WHERE user_id = %s", (user_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {
        "success": True,
        "message": "User approved successfully",
        "data": {"user_id": user_id}
    }