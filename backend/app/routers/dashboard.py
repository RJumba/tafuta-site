from fastapi import APIRouter, Depends
from app.dependencies.auth import CurrentUser, get_current_user
from app.services.dashboard import get_dashboard_summary, get_matching_listings
router = APIRouter(prefix="/me", tags=["dashboard"])
@router.get("/dashboard")
def dashboard(current_user: CurrentUser = Depends(get_current_user)):
    return get_dashboard_summary(current_user.id)
@router.get("/matches")
def matches(current_user: CurrentUser = Depends(get_current_user)):
    return get_matching_listings(current_user.id)
