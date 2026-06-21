from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.order import OrderCreate
from app.services import order_service

router = APIRouter(prefix="/orders", tags=["Orders"])


# CREATE ORDER
@router.post("/")
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    return order_service.create_order(db, order)


# GET ALL ORDERS
@router.get("/")
def get_orders(db: Session = Depends(get_db)):
    return order_service.get_orders(db)


# GET ORDER BY ID
@router.get("/{id}")
def get_order(id: int, db: Session = Depends(get_db)):
    return order_service.get_order(db, id)


@router.delete("/{id}")
def delete_order(id: int, db: Session = Depends(get_db)):
    return order_service.delete_order(db, id)
