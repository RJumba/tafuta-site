from pydantic import BaseModel, Field
class HousingListingCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=160)
    description: str | None = Field(default=None, max_length=3000)
    price: float = Field(..., gt=0)
    location_name: str = Field(..., min_length=2, max_length=200)
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    housing_id: int | None = None
    is_available: bool = True
class HousingListingUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=160)
    description: str | None = Field(default=None, max_length=3000)
    price: float | None = Field(default=None, gt=0)
    location_name: str | None = Field(default=None, min_length=2, max_length=200)
    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)
    housing_id: int | None = None
    is_available: bool | None = None
