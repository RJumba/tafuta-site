from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
from app.routers import dashboard, health, housing_options, listings, preferences, profile, search_history, settings as settings_router
settings=get_settings()
app=FastAPI(title=settings.app_name,version="1.0.0",description="Production-style API for Tafuta.")
app.add_middleware(CORSMiddleware,allow_origins=[settings.frontend_origin],allow_credentials=True,allow_methods=["GET","POST","PUT","PATCH","DELETE","OPTIONS"],allow_headers=["Authorization","Content-Type"])
app.include_router(health.router)
app.include_router(profile.router,prefix=settings.api_v1_prefix)
app.include_router(preferences.router,prefix=settings.api_v1_prefix)
app.include_router(settings_router.router,prefix=settings.api_v1_prefix)
app.include_router(search_history.router,prefix=settings.api_v1_prefix)
app.include_router(dashboard.router,prefix=settings.api_v1_prefix)
app.include_router(listings.router,prefix=settings.api_v1_prefix)
app.include_router(housing_options.router,prefix=settings.api_v1_prefix)
@app.get("/")
def root():
    return {"message":"Tafuta FastAPI backend is running","docs":"/docs","health":"/health"}
