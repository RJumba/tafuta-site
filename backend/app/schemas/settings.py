from pydantic import BaseModel
class NotificationSettingsUpdate(BaseModel):
    new_listings: bool = True
    price_drop: bool = True
    reminders: bool = False
class PrivacySettingsUpdate(BaseModel):
    show_profile: bool = True
    save_search: bool = True
