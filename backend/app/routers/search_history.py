from fastapi import APIRouter, Depends, HTTPException
from app.core.database import supabase_admin
from app.dependencies.auth import CurrentUser, get_current_user
from app.schemas.search_history import SearchHistoryCreate
from app.services.dashboard import get_search_history_summary
router = APIRouter(prefix="/me/search-history", tags=["search-history"])
@router.get("")
def read_search_history(current_user: CurrentUser = Depends(get_current_user)):
    return get_search_history_summary(current_user.id)
@router.post("", status_code=201)
def record_search(search: SearchHistoryCreate, current_user: CurrentUser = Depends(get_current_user)):
    privacy=(supabase_admin.table("privacy_settings").select("save_search").eq("user_id",current_user.id).maybe_single().execute()).data
    if privacy and privacy.get("save_search") is False:
        return {"saved": False,"message": "Search history is disabled.","search": None}
    payload=search.model_dump(); payload["user_id"]=current_user.id
    response=supabase_admin.table("search_history").insert(payload).execute()
    if not response.data: raise HTTPException(status_code=400,detail="Could not save search")
    return {"saved": True,"search": response.data[0]}
@router.delete("")
def clear_search_history(current_user: CurrentUser = Depends(get_current_user)):
    response=supabase_admin.table("search_history").delete().eq("user_id",current_user.id).execute()
    return {"message":"Search history cleared","deleted_count":len(response.data or [])}
