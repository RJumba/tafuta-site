from fastapi import APIRouter, Depends, HTTPException
from app.core.database import supabase_admin
from app.dependencies.auth import CurrentUser, get_current_user
from app.schemas.preferences import PreferencesUpdate
router = APIRouter(prefix="/me/preferences", tags=["preferences"])
@router.get("")
def get_preferences(current_user: CurrentUser = Depends(get_current_user)):
    response = (supabase_admin.table("preferences")
        .select("min_rent,max_rent,preferred_loc_1,preferred_loc_2,preferred_loc_3,housing_id")
        .eq("user_id", current_user.id).maybe_single().execute())
    return response.data or {"min_rent": None,"max_rent": None,"preferred_loc_1": None,"preferred_loc_2": None,"preferred_loc_3": None,"housing_id": None}
@router.put("")
def save_preferences(preferences: PreferencesUpdate, current_user: CurrentUser = Depends(get_current_user)):
    payload = preferences.model_dump(); payload["user_id"] = current_user.id
    response = supabase_admin.table("preferences").upsert(payload, on_conflict="user_id").execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Could not save preferences")
    return response.data[0]
