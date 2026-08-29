from fastapi import APIRouter, Depends, HTTPException
from app.core.database import supabase_admin
from app.dependencies.auth import CurrentUser, get_current_user
from app.schemas.settings import NotificationSettingsUpdate, PrivacySettingsUpdate
router = APIRouter(prefix="/me", tags=["settings"])
@router.get("/settings")
def get_settings(current_user: CurrentUser = Depends(get_current_user)):
    notifications = (supabase_admin.table("notification_settings").select("new_listings,price_drop,reminders").eq("user_id", current_user.id).maybe_single().execute()).data
    privacy = (supabase_admin.table("privacy_settings").select("show_profile,save_search").eq("user_id", current_user.id).maybe_single().execute()).data
    return {"notifications": notifications or {"new_listings": True,"price_drop": True,"reminders": False},"privacy": privacy or {"show_profile": True,"save_search": True}}
@router.put("/notification-settings")
def save_notification_settings(payload: NotificationSettingsUpdate, current_user: CurrentUser = Depends(get_current_user)):
    data=payload.model_dump(); data["user_id"]=current_user.id
    response=supabase_admin.table("notification_settings").upsert(data,on_conflict="user_id").execute()
    if not response.data: raise HTTPException(status_code=400,detail="Could not save notification settings")
    return response.data[0]
@router.put("/privacy-settings")
def save_privacy_settings(payload: PrivacySettingsUpdate, current_user: CurrentUser = Depends(get_current_user)):
    data=payload.model_dump(); data["user_id"]=current_user.id
    response=supabase_admin.table("privacy_settings").upsert(data,on_conflict="user_id").execute()
    if not response.data: raise HTTPException(status_code=400,detail="Could not save privacy settings")
    return response.data[0]
