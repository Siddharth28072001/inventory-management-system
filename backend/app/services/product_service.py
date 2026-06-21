from sqlalchemy.orm import Session
from fastapi import status

from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate
from app.utils.api_response import success_response, error_response


# CREATE
def create_product(db: Session, product: ProductCreate):
    existing_product = (
        db.query(Product)
        .filter(Product.sku == product.sku)
        .first()
    )

    if existing_product:
        return error_response("Product SKU already exists")

    new_product = Product(
        name=product.name,
        sku=product.sku,
        price=product.price,
        quantity=product.quantity
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return success_response(
        "Product created successfully",
        new_product
    )


# GET ALL
def get_products(db: Session):
    products = db.query(Product).order_by(Product.id.desc()).all()

    return success_response(
        "Products fetched successfully",
        products
    )


# GET ONE
def get_product(db: Session, id: int):
    product = db.get(Product, id)

    if not product:
        return error_response("Product not found")

    return success_response(
        "Product fetched successfully",
        product
    )


# UPDATE
def update_product(db: Session, id: int, product_update: ProductUpdate):
    product = db.get(Product, id)

    if not product:
        return error_response("Product not found")

    if product_update.sku:
        existing_product = (
            db.query(Product)
            .filter(
                Product.sku == product_update.sku,
                Product.id != id
            )
            .first()
        )

        if existing_product:
            return error_response("Product SKU already exists")

    update_data = product_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)

    return success_response(
        "Product updated successfully",
        product
    )


# DELETE
def delete_product(db: Session, id: int):
    product = db.get(Product, id)

    if not product:
        return error_response("Product not found")

    db.delete(product)
    db.commit()

    return success_response(
        "Product deleted successfully",
        None
    )