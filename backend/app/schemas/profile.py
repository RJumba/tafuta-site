from pydantic import BaseModel, EmailStr, Field
class ProfileUpdate(BaseModel):
    full_name: str | None = Field(default=None, min_length=2, max_length=120)
    email: EmailStr | None = None
    city: str | None = Field(default=None, max_length=100)
    area: str | None = Field(default=None, max_length=120)
    constituency: str | None = Field(default=None, max_length=120)
    phone: str | None = Field(default=None, max_length=40)
