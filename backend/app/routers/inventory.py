from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.product import Product
from app.models.order import Order
from app.models.customer import Customer
from app.utils.api_response import success_response

router = APIRouter(prefix="/inventory", tags=["Inventory"])


@router.get("/dashboard")
def get_dashboard_data(db: Session = Depends(get_db)):

    products_count = db.query(func.count(Product.id)).scalar()
    orders_count = db.query(func.count(Order.id)).scalar()
    customers_count = db.query(func.count(Customer.id)).scalar()

    low_stock_count = (
        db.query(func.count(Product.id))
        .filter(Product.quantity <= 5)
        .scalar()
    )

    return success_response(
        "Dashboard data fetched successfully",
        {
            "products": products_count,
            "orders": orders_count,
            "customers": customers_count,
            "low_stock": low_stock_count
        }
    )