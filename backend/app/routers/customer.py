from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.customer import CustomerCreate
from app.services import customer_service


router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)


# CREATE CUSTOMER
@router.post("/")
def create_customer(
    customer: CustomerCreate,
    db: Session = Depends(get_db)
):
    return customer_service.create_customer(db, customer)


# GET ALL CUSTOMERS
@router.get("/")
def get_customers(
    db: Session = Depends(get_db)
):
    return customer_service.get_customers(db)


# GET CUSTOMER BY ID
@router.get("/{id}")
def get_customer(
    id: int,
    db: Session = Depends(get_db)
):
    return customer_service.get_customer(db, id)


# DELETE CUSTOMER
@router.delete("/{id}")
def delete_customer(
    id: int,
    db: Session = Depends(get_db)
):
    return customer_service.delete_customer(db, id)