import re

with open('src/types/index.ts', 'r') as f:
    content = f.read()

new_auth_user = """export interface AuthUserProfile {
  name?: string;
  email?: string;
  uid?: string;
  id?: string;
  role?: string;
  status?: string;
  canExport?: boolean;
  canEditPrices?: boolean;
  canManageRoles?: boolean;
  canAccessDangerZone?: boolean;
}"""

content = re.sub(r"export interface AuthUserProfile \{.*?\n\}", new_auth_user, content, flags=re.DOTALL)

with open('src/types/index.ts', 'w') as f:
    f.write(content)
