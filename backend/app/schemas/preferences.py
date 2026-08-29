from pydantic import BaseModel, Field, model_validator
class PreferencesUpdate(BaseModel):
    min_rent: float | None = Field(default=None, ge=0)
    max_rent: float | None = Field(default=None, ge=0)
    preferred_loc_1: str | None = Field(default=None, max_length=120)
    preferred_loc_2: str | None = Field(default=None, max_length=120)
    preferred_loc_3: str | None = Field(default=None, max_length=120)
    housing_id: int | None = None
    @model_validator(mode="after")
    def validate_budget(self):
        if self.min_rent is not None and self.max_rent is not None and self.min_rent > self.max_rent:
            raise ValueError("Minimum rent cannot be greater than maximum rent")
        return self
