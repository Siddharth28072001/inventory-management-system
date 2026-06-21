from sqlalchemy.orm import Session,joinedload

from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.models.customer import Customer

from app.schemas.order import OrderCreate
from app.utils.api_response import success_response, error_response


# CREATE ORDER
def create_order(db: Session, order_data: OrderCreate):

    try:
        # Validate customer
        customer = db.get(Customer, order_data.customer_id)

        if not customer:
            return error_response("Customer not found")

        order_items = []
        total_amount = 0

        # STEP 1: Validate stock first
        for item in order_data.items:

            product = db.get(Product, item.product_id)

            if not product:
                return error_response(f"Product {item.product_id} not found")

            if product.quantity < item.quantity:
                return error_response(
                    f"Insufficient stock for product {product.name}"
                )

        # STEP 2: Process order items
        for item in order_data.items:

            product = db.get(Product, item.product_id)

            item_total = product.price * item.quantity
            total_amount += item_total

            # Reduce stock
            product.quantity -= item.quantity

            order_items.append(
                OrderItem(
                    product_id=product.id,
                    quantity=item.quantity,
                    price_at_purchase=product.price
                )
            )

        # STEP 3: Create order
        new_order = Order(
            customer_id=order_data.customer_id,
            total_amount=total_amount,
            items=order_items
        )

        db.add(new_order)
        db.commit()
        db.refresh(new_order)

        return success_response(
            "Order created successfully",
            new_order
        )

    except Exception:
        db.rollback()
        return error_response("Something went wrong while creating order")


# GET ALL ORDERS
def get_orders(db: Session):
    orders = (
        db.query(Order)
        .options(
            joinedload(Order.customer),
            joinedload(Order.items).joinedload(OrderItem.product)
        )
        .order_by(Order.id.desc())
        .all()
    )

    return success_response(
        "Orders fetched successfully",
        orders
    )


# GET ORDER BY ID
def get_order(db: Session, id: int):
    order = db.get(Order, id)

    if not order:
        return error_response("Order not found")

    return success_response(
        "Order fetched successfully",
        order
    )

def delete_order(db: Session, id: int):

    try:
        # ================= FETCH ORDER =================
        order = db.get(Order, id)

        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )

        # ================= RESTORE STOCK =================
        for item in order.items:
            product = db.get(Product, item.product_id)

            if product:
                product.quantity += item.quantity

        # ================= DELETE ORDER ITEMS =================
        db.query(OrderItem).filter(
            OrderItem.order_id == id
        ).delete()

        # ================= DELETE ORDER =================
        db.delete(order)

        # ================= COMMIT =================
        db.commit()

        return {
            "status": True,
            "message": "Order deleted successfully and inventory restored",
            "data": None
        }

    except Exception as e:
        db.rollback()
        return {
            "status": False,
            "message": "Failed to delete order",
            "error": str(e)
        }