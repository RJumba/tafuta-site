from dataclasses import dataclass
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.core.database import supabase_admin

bearer_scheme = HTTPBearer(auto_error=False)

@dataclass
class CurrentUser:
    id: str
    email: str | None

def get_current_user(credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme)) -> CurrentUser:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing authentication token")
    token = credentials.credentials
    try:
        claims_response = supabase_admin.auth.get_claims(token)
        claims = claims_response.claims or {}
        user_id = claims.get("sub")
        email = claims.get("email")
        if not user_id:
            raise ValueError("Token does not contain a user id")
        return CurrentUser(id=user_id, email=email)
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired authentication token") from exc
