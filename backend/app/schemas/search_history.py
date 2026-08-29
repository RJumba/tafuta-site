from typing import Any
from pydantic import BaseModel, Field, model_validator
class SearchHistoryCreate(BaseModel):
    search_title: str = Field(..., min_length=2, max_length=200)
    search_text: str | None = Field(default=None, max_length=500)
    housing_id: int | None = None
    bedrooms: int | None = Field(default=None, ge=0, le=20)
    location_name: str = Field(..., min_length=2, max_length=200)
    min_price: float | None = Field(default=None, ge=0)
    max_price: float | None = Field(default=None, ge=0)
    result_count: int = Field(default=0, ge=0)
    filters: dict[str, Any] = Field(default_factory=dict)
    @model_validator(mode="after")
    def validate_budget(self):
        if self.min_price is not None and self.max_price is not None and self.min_price > self.max_price:
            raise ValueError("Minimum price cannot exceed maximum price")
        return self
