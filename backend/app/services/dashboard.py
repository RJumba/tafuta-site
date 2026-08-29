from collections import Counter
from datetime import datetime, timedelta, timezone
from app.core.database import supabase_admin

def _safe_rows(response):
    return response.data or []

def _week_start_utc():
    now = datetime.now(timezone.utc)
    start = now - timedelta(days=now.weekday(), hours=now.hour, minutes=now.minute, seconds=now.second, microseconds=now.microsecond)
    return start.isoformat()

def get_preferences(user_id: str):
    response = (supabase_admin.table("preferences")
        .select("min_rent,max_rent,preferred_loc_1,preferred_loc_2,preferred_loc_3,housing_id")
        .eq("user_id", user_id).maybe_single().execute())
    return response.data

def get_matching_listings(user_id: str):
    preferences = get_preferences(user_id)
    if not preferences:
        return {"count": 0, "matches": [], "reason": "No housing preferences have been saved yet."}
    query = (supabase_admin.table("housing_listings")
        .select("id,title,description,price,location_name,latitude,longitude,housing_id,is_available,housing_options(id,name)")
        .eq("is_available", True))
    if preferences.get("min_rent") is not None:
        query = query.gte("price", preferences["min_rent"])
    if preferences.get("max_rent") is not None:
        query = query.lte("price", preferences["max_rent"])
    if preferences.get("housing_id") is not None:
        query = query.eq("housing_id", preferences["housing_id"])
    response = query.order("price", desc=False).execute()
    matches = _safe_rows(response)
    preferred_locations = {str(v).strip().lower() for v in [preferences.get("preferred_loc_1"), preferences.get("preferred_loc_2"), preferences.get("preferred_loc_3")] if v}
    for listing in matches:
        listing["preferred_location_match"] = str(listing.get("location_name", "")).strip().lower() in preferred_locations
    matches.sort(key=lambda item: (not item.get("preferred_location_match", False), float(item.get("price") or 0)))
    return {"count": len(matches), "matches": matches, "reason": None}

def get_search_history_summary(user_id: str):
    response = (supabase_admin.table("search_history")
        .select("id,search_title,search_text,housing_id,bedrooms,location_name,min_price,max_price,result_count,filters,searched_at")
        .eq("user_id", user_id).order("searched_at", desc=True).limit(100).execute())
    rows = _safe_rows(response)
    week_start = _week_start_utc()
    this_week = [r for r in rows if r.get("searched_at") and r["searched_at"] >= week_start]
    location_counter = Counter(str(r.get("location_name", "")).strip() for r in rows if r.get("location_name"))
    top_locations = [{"location_name": loc, "search_count": count} for loc,count in location_counter.most_common(10)]
    return {
        "total_searches": len(rows),
        "total_searches_this_week": len(this_week),
        "most_searched_area": top_locations[0]["location_name"] if top_locations else None,
        "last_search": rows[0] if rows else None,
        "recent_searches": rows[:10],
        "top_locations": top_locations,
    }

def get_saved_homes(user_id: str):
    response = (supabase_admin.table("saved_homes")
        .select("id,created_at,housing_listings(id,title,price,location_name,is_available,housing_id,housing_options(id,name))")
        .eq("user_id", user_id).order("created_at", desc=True).limit(10).execute())
    rows = _safe_rows(response)
    return {"count": len(rows), "items": rows}

def get_recently_viewed(user_id: str):
    response = (supabase_admin.table("recently_viewed")
        .select("id,viewed_at,housing_listings(id,title,price,location_name,is_available,housing_id,housing_options(id,name))")
        .eq("user_id", user_id).order("viewed_at", desc=True).limit(10).execute())
    rows = _safe_rows(response)
    return {"count": len(rows), "items": rows}

def get_dashboard_summary(user_id: str):
    search_summary = get_search_history_summary(user_id)
    matches = get_matching_listings(user_id)
    saved = get_saved_homes(user_id)
    recent = get_recently_viewed(user_id)
    preferences = get_preferences(user_id)
    return {
        "search_activity": {"this_week": search_summary["total_searches_this_week"], "total": search_summary["total_searches"]},
        "popular_locations": search_summary["top_locations"][:3],
        "new_matches": matches["count"],
        "matches": matches["matches"][:10],
        "match_reason": matches["reason"],
        "saved_homes": saved,
        "recently_viewed": recent,
        "budget_overview": {
            "min_rent": preferences.get("min_rent") if preferences else None,
            "max_rent": preferences.get("max_rent") if preferences else None,
            "housing_id": preferences.get("housing_id") if preferences else None,
        },
    }
