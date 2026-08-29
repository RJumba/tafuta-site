from fastapi import APIRouter
from app.core.database import supabase_admin
router = APIRouter(prefix="/housing-options", tags=["housing-options"])
@router.get("")
def list_housing_options():
    response = supabase_admin.table("housing_options").select("id,name").order("id", desc=False).execute()
    return response.data or []
