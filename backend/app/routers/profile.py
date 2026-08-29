from fastapi import APIRouter, Depends, HTTPException
from app.core.database import supabase_admin
from app.dependencies.auth import CurrentUser, get_current_user
from app.schemas.profile import ProfileUpdate
router = APIRouter(prefix="/me", tags=["profile"])
@router.get("")
def get_me(current_user: CurrentUser = Depends(get_current_user)):
    response = (supabase_admin.table("profiles")
        .select("id,full_name,email,avatar_url,city,area,constituency,phone")
        .eq("id", current_user.id).maybe_single().execute())
    if not response.data:
        raise HTTPException(status_code=404, detail="Profile not found")
    return response.data
@router.patch("")
def update_me(changes: ProfileUpdate, current_user: CurrentUser = Depends(get_current_user)):
    payload = changes.model_dump(exclude_none=True); payload["id"] = current_user.id
    response = supabase_admin.table("profiles").upsert(payload, on_conflict="id").execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Could not update profile")
    return response.data[0]
