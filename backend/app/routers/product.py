from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.product import ProductCreate, ProductUpdate
from app.services import product_service

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


@router.post("/")
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    return product_service.create_product(db, product)


@router.get("/")
def get_products(db: Session = Depends(get_db)):
    return product_service.get_products(db)


@router.get("/{id}")
def get_product(id: int, db: Session = Depends(get_db)):
    return product_service.get_product(db, id)


@router.put("/{id}")
def update_product(id: int, product_update: ProductUpdate, db: Session = Depends(get_db)):
    return product_service.update_product(db, id, product_update)


@router.delete("/{id}")
def delete_product(id: int, db: Session = Depends(get_db)):
    return product_service.delete_product(db, id)