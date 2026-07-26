import os
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from supabase import create_client, Client


load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise RuntimeError("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in backend/.env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

app = FastAPI(title="Tafuta Backend API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class HousingListingCreate(BaseModel):
    title: str = Field(..., min_length=2)
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    location_name: str = Field(..., min_length=2)
    latitude: float
    longitude: float
    housing_id: Optional[int] = None
    is_available: bool = True


@app.get("/")
def home():
    return {
        "message": "Tafuta FastAPI backend is running"
    }


@app.get("/housing-listings")
def get_available_housing_listings():
    response = (
        supabase
        .table("housing_listings")
        .select(
            """
            id,
            title,
            description,
            price,
            location_name,
            latitude,
            longitude,
            is_available,
            housing_options (
                id,
                name
            )
            """
        )
        .eq("is_available", True)
        .order("id", desc=False)
        .execute()
    )

    return {
        "count": len(response.data or []),
        "listings": response.data or []
    }


@app.post("/housing-listings")
def create_housing_listing(listing: HousingListingCreate):
    payload = listing.model_dump()

    response = (
        supabase
        .table("housing_listings")
        .insert(payload)
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=400,
            detail="Could not create housing listing"
        )

    return {
        "message": "Housing listing created successfully",
        "listing": response.data[0]
    }


@app.delete("/housing-listings/{listing_id}")
def delete_housing_listing(listing_id: int):
    response = (
        supabase
        .table("housing_listings")
        .delete()
        .eq("id", listing_id)
        .execute()
    )

    return {
        "message": "Housing listing deleted successfully",
        "deleted": response.data
    }

@app.get("/api/v1/me")
def get_current_user():
    return {
        "id": "8797f47d-...",
        "full_name": "Ian Muhavi",
        "email": "ian@example.com",
        "city": "Eldoret",
  "area": "Pioneer"
}