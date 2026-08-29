from supabase import Client, create_client
from app.core.config import get_settings
settings = get_settings()
supabase_admin: Client = create_client(settings.supabase_url, settings.supabase_service_role_key)
