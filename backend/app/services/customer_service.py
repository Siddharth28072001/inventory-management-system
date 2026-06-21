from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.schemas.customer import CustomerCreate
from app.utils.api_response import success_response, error_response


# CREATE CUSTOMER
def create_customer(db: Session, customer: CustomerCreate):
    existing_customer = (
        db.query(Customer)
        .filter(Customer.email == customer.email)
        .first()
    )

    if existing_customer:
        return error_response("Customer email already exists")

    new_customer = Customer(
        full_name=customer.full_name,
        email=customer.email,
        phone_number=customer.phone_number
    )

    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)

    return success_response(
        "Customer created successfully",
        new_customer
    )


# GET ALL CUSTOMERS
def get_customers(db: Session):
    customers = db.query(Customer).order_by(Customer.id.desc()).all()

    return success_response(
        "Customers fetched successfully",
        customers
    )


# GET ONE CUSTOMER
def get_customer(db: Session, id: int):
    customer = db.get(Customer, id)

    if not customer:
        return error_response("Customer not found")

    return success_response(
        "Customer fetched successfully",
        customer
    )


# DELETE CUSTOMER
def delete_customer(db: Session, id: int):
    customer = db.get(Customer, id)

    if not customer:
        return error_response("Customer not found")

    db.delete(customer)
    db.commit()

    return success_response(
        "Customer deleted successfully",
        None
    )