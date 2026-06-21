from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict, Field


class CustomerBase(BaseModel):
    full_name: str = Field(
        ...,
        min_length=1,
        max_length=100
    )

    email: EmailStr

    phone_number: str = Field(
        ...,
        min_length=5,
        max_length=20
    )


class CustomerCreate(CustomerBase):
    pass


class CustomerResponse(CustomerBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )