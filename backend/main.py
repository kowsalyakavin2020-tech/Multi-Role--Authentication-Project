from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional
from auth import generate_otp, verify_otp, check_user, create_token, register_user, verify_token
from database import get_connection
import uuid
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload


def check_and_notify_low_stock(cursor, product_id: str, supplier_id: str):
    cursor.execute("SELECT name, stock FROM products WHERE product_id = %s", (product_id,))
    product = cursor.fetchone()
    if product and product["stock"] <= 10:
        cursor.execute("""
            INSERT INTO notifications (user_id, title, message, type)
            VALUES (%s, %s, %s, %s)
        """, (
            supplier_id,
            "Low Stock Alert",
            f"Product '{product['name']}' is low on stock! Only {product['stock']} units left.",
            "low_stock"
        ))
        cursor.execute("""
            INSERT INTO notifications (user_id, title, message, type)
            VALUES (%s, %s, %s, %s)
        """, (
            "ADMIN",
            "Low Stock Alert",
            f"Product '{product['name']}' has only {product['stock']} units remaining.",
            "low_stock"
        ))


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

class OrderStatusModel(BaseModel):
    status: str


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
    """, (product_id, supplier_id, product.name, product.category,
          product.stock, product.price, product.status, product.image))
    check_and_notify_low_stock(cursor, product_id, supplier_id)
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
    cursor = conn.cursor(dictionary=True)
    mobile = current_user["mobile"]
    cursor.execute("SELECT user_id FROM users WHERE mobile = %s", (mobile,))
    supplier = cursor.fetchone()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    supplier_id = supplier["user_id"]
    cursor.execute("""
        UPDATE products
        SET name=%s, category=%s, stock=%s, price=%s, status=%s, image=%s
        WHERE product_id=%s
    """, (product.name, product.category, product.stock,
          product.price, product.status, product.image, product_id))
    check_and_notify_low_stock(cursor, product_id, supplier_id)
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


@app.post("/vendor/request")
def send_request(order: OrderModel, current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    mobile = current_user["mobile"]
    cursor.execute("SELECT user_id, name FROM users WHERE mobile = %s", (mobile,))
    vendor = cursor.fetchone()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    vendor_id = vendor["user_id"]
    vendor_name = vendor["name"]
    order_id = "ORD" + str(uuid.uuid4())[:5].upper()
    cursor.execute("""
        INSERT INTO orders (order_id, vendor_id, supplier_id, product_id, quantity, message)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (order_id, vendor_id, order.supplier_id, order.product_id,
          order.quantity, order.message))
    cursor.execute("SELECT name FROM products WHERE product_id = %s", (order.product_id,))
    product = cursor.fetchone()
    product_name = product["name"] if product else "Unknown Product"
    cursor.execute("""
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (%s, %s, %s, %s)
    """, (
        order.supplier_id,
        "New Vendor Request",
        f"Vendor '{vendor_name}' requested {order.quantity} units of '{product_name}'.",
        "request"
    ))
    cursor.execute("""
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (%s, %s, %s, %s)
    """, (
        "ADMIN",
        "New Vendor Request",
        f"New order {order_id}: Vendor '{vendor_name}' requested '{product_name}'.",
        "request"
    ))
    conn.commit()
    cursor.close()
    conn.close()
    return {
        "success": True,
        "message": "Request sent successfully",
        "data": {"order_id": order_id}
    }


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


@app.put("/orders/{order_id}/status")
def update_order_status(order_id: str, body: OrderStatusModel, current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("UPDATE orders SET status = %s WHERE order_id = %s", (body.status, order_id))
    cursor.execute("SELECT vendor_id, supplier_id FROM orders WHERE order_id = %s", (order_id,))
    order = cursor.fetchone()
    if order:
        cursor.execute("""
            INSERT INTO notifications (user_id, title, message, type)
            VALUES (%s, %s, %s, %s)
        """, (order["vendor_id"], "Order Status Updated",
              f"Your order {order_id} is now {body.status}", "order_status"))
        cursor.execute("""
            INSERT INTO notifications (user_id, title, message, type)
            VALUES (%s, %s, %s, %s)
        """, (order["supplier_id"], "Order Status Updated",
              f"Order {order_id} status changed to {body.status}", "order_status"))
        cursor.execute("""
            INSERT INTO notifications (user_id, title, message, type)
            VALUES (%s, %s, %s, %s)
        """, ("ADMIN", "Order Status Updated",
              f"Order {order_id} status changed to {body.status}", "order_status"))
    conn.commit()
    cursor.close()
    conn.close()
    return {
        "success": True,
        "message": "Order status updated successfully",
        "data": {"order_id": order_id, "status": body.status}
    }


@app.get("/notifications")
def get_notifications(current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    mobile = current_user["mobile"]
    role = current_user.get("role")
    if role == "admin":
        user_id = "ADMIN"
    else:
        cursor.execute("SELECT user_id FROM users WHERE mobile = %s", (mobile,))
        user = cursor.fetchone()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        user_id = user["user_id"]
    cursor.execute("""
        SELECT * FROM notifications
        WHERE user_id = %s
        ORDER BY created_at DESC
        LIMIT 20
    """, (user_id,))
    notifications = cursor.fetchall()
    cursor.execute("""
        SELECT COUNT(*) as count FROM notifications
        WHERE user_id = %s AND is_read = FALSE
    """, (user_id,))
    unread_count = cursor.fetchone()["count"]
    cursor.close()
    conn.close()
    return {
        "success": True,
        "message": "Notifications fetched successfully",
        "data": {
            "notifications": notifications,
            "unread_count": unread_count
        }
    }


@app.put("/notifications/{notif_id}/read")
def mark_notification_read(notif_id: int, current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE notifications SET is_read = TRUE WHERE id = %s", (notif_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {
        "success": True,
        "message": "Notification marked as read",
        "data": {"id": notif_id}
    }


@app.put("/notifications/read-all")
def mark_all_read(current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    mobile = current_user["mobile"]
    role = current_user.get("role")
    if role == "admin":
        user_id = "ADMIN"
    else:
        cursor.execute("SELECT user_id FROM users WHERE mobile = %s", (mobile,))
        user = cursor.fetchone()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        user_id = user["user_id"]
    cursor.execute("UPDATE notifications SET is_read = TRUE WHERE user_id = %s", (user_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {
        "success": True,
        "message": "All notifications marked as read",
        "data": {}
    }


@app.get("/admin/reports")
def get_reports(
    current_user: dict = Depends(get_current_user),
    from_date: Optional[str] = Query(None),
    to_date: Optional[str] = Query(None)
):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    def build_date_conditions(alias=""):
        col = f"{alias}created_at" if alias else "created_at"
        conditions = []
        params = []
        if from_date and to_date:
            conditions.append(f"DATE({col}) BETWEEN %s AND %s")
            params += [from_date, to_date]
        elif from_date:
            conditions.append(f"DATE({col}) >= %s")
            params += [from_date]
        elif to_date:
            conditions.append(f"DATE({col}) <= %s")
            params += [to_date]
        return conditions, params

    def count_status(status):
        conds, params = build_date_conditions()
        conds.append("status = %s")
        params.append(status)
        q = "SELECT COUNT(*) as total FROM orders WHERE " + " AND ".join(conds)
        cursor.execute(q, params)
        return cursor.fetchone()["total"]

    def count_total():
        conds, params = build_date_conditions()
        q = "SELECT COUNT(*) as total FROM orders"
        if conds:
            q += " WHERE " + " AND ".join(conds)
        cursor.execute(q, params)
        return cursor.fetchone()["total"]

    total_orders = count_total()
    completed_orders = count_status("Completed")
    pending_orders = count_status("Pending")
    approved_orders = count_status("Approved")
    rejected_orders = count_status("Rejected")

    top_conds, top_params = build_date_conditions("o.")
    top_q = """
        SELECT p.name, COUNT(o.order_id) as order_count, SUM(o.quantity) as total_qty
        FROM orders o
        JOIN products p ON o.product_id = p.product_id
    """
    if top_conds:
        top_q += " WHERE " + " AND ".join(top_conds)
    top_q += " GROUP BY p.product_id, p.name ORDER BY total_qty DESC LIMIT 5"
    cursor.execute(top_q, top_params)
    top_products = cursor.fetchall()

    if from_date and to_date:
        sales_q = """
            SELECT DATE(created_at) as date, COUNT(*) as count
            FROM orders WHERE DATE(created_at) BETWEEN %s AND %s
            GROUP BY DATE(created_at) ORDER BY date ASC
        """
        cursor.execute(sales_q, [from_date, to_date])
    else:
        sales_q = """
            SELECT DATE(created_at) as date, COUNT(*) as count
            FROM orders WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            GROUP BY DATE(created_at) ORDER BY date ASC
        """
        cursor.execute(sales_q)
    sales_summary = cursor.fetchall()

    cursor.close()
    conn.close()
    return {
        "success": True,
        "message": "Reports fetched successfully",
        "data": {
            "total_orders": total_orders,
            "completed_orders": completed_orders,
            "pending_orders": pending_orders,
            "approved_orders": approved_orders,
            "rejected_orders": rejected_orders,
            "top_products": top_products,
            "sales_summary": sales_summary
        }
    }