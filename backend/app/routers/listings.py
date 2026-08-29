from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.core.database import supabase_admin
from app.dependencies.auth import CurrentUser, get_current_user
from app.schemas.listings import HousingListingCreate, HousingListingUpdate
router = APIRouter(prefix="/housing-listings", tags=["housing-listings"])
@router.get("")
def list_housing_listings(location: str | None = Query(default=None), housing_id: int | None = Query(default=None), min_price: float | None = Query(default=None, ge=0), max_price: float | None = Query(default=None, ge=0), page: int = Query(default=1, ge=1), page_size: int = Query(default=20, ge=1, le=100)):
    query=(supabase_admin.table("housing_listings").select("id,title,description,price,location_name,latitude,longitude,housing_id,is_available,housing_options(id,name)", count="exact").eq("is_available",True))
    if location: query=query.ilike("location_name",f"%{location.strip()}%")
    if housing_id is not None: query=query.eq("housing_id",housing_id)
    if min_price is not None: query=query.gte("price",min_price)
    if max_price is not None: query=query.lte("price",max_price)
    start=(page-1)*page_size; end=start+page_size-1
    response=query.order("id",desc=False).range(start,end).execute()
    return {"count":response.count or 0,"page":page,"page_size":page_size,"listings":response.data or []}
@router.get("/{listing_id}")
def get_listing(listing_id:int):
    response=(supabase_admin.table("housing_listings").select("id,title,description,price,location_name,latitude,longitude,housing_id,is_available,housing_options(id,name)").eq("id",listing_id).maybe_single().execute())
    if not response.data: raise HTTPException(status_code=404,detail="Housing listing not found")
    return response.data
@router.post("",status_code=status.HTTP_201_CREATED)
def create_listing(listing:HousingListingCreate,current_user:CurrentUser=Depends(get_current_user)):
    response=supabase_admin.table("housing_listings").insert(listing.model_dump()).execute()
    if not response.data: raise HTTPException(status_code=400,detail="Could not create listing")
    return {"message":"Housing listing created successfully","listing":response.data[0]}
@router.patch("/{listing_id}")
def update_listing(listing_id:int,changes:HousingListingUpdate,current_user:CurrentUser=Depends(get_current_user)):
    payload=changes.model_dump(exclude_none=True)
    if not payload: raise HTTPException(status_code=400,detail="No changes supplied")
    response=supabase_admin.table("housing_listings").update(payload).eq("id",listing_id).execute()
    if not response.data: raise HTTPException(status_code=404,detail="Housing listing not found")
    return response.data[0]
@router.delete("/{listing_id}")
def delete_listing(listing_id:int,current_user:CurrentUser=Depends(get_current_user)):
    response=supabase_admin.table("housing_listings").delete().eq("id",listing_id).execute()
    if not response.data: raise HTTPException(status_code=404,detail="Housing listing not found")
    return {"message":"Housing listing deleted successfully","deleted":response.data[0]}
