from fastapi import FastAPI
from sqlalchemy import text
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
import app.models

from app.routers import product, customer, order, inventory

app = FastAPI(
    title="Inventory Management API",
    version="1.0.0"
)

# ✅ ADD THIS HERE (IMPORTANT)
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://inventory-frontend-iota-ashen.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(product.router)
app.include_router(customer.router)
app.include_router(order.router)
app.include_router(inventory.router)


@app.get("/")
def root():
    return {
        "message": "Inventory Management API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.get("/db-check")
def db_check():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))

    return {
        "message": "Database connection successful"
    }