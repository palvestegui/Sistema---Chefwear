const fs = require('fs');
let content = fs.readFileSync('src/utils/constants.ts', 'utf8');

const oldFunc = `export function normalizeRole(rawRole: string | undefined | null, accountType?: string): string {
  const roles = getRolesForAccountType(accountType);
  if (!rawRole) return roles[0] || 'OTRO';
  const upper = rawRole.trim().toUpperCase();
  if (roles.includes(upper)) return upper;

  if (upper === 'ESTUDIANTE') return 'ESTUDIANTE';
  if (upper === 'CHEF') return 'CHEF';
  if (upper === 'GARZÓN' || upper === 'GARZON') return 'GARZÓN';
  if (upper === 'PERSONAL' || upper === 'PERSONAL (STAFF)' || upper === 'STAFF') return 'EMPLEADO';
  if (upper === 'DOCENTE') return 'DOCENTE';
  if (upper === 'PANADERO') return 'PANADERO';
  if (upper === 'SOUS-CHEF' || upper === 'SOUS CHEF') return 'SOUS-CHEF';
  if (upper === 'BARTENDER') return 'BARTENDER';
  if (upper === 'INDIVIDUO' || upper === 'INDEPENDIENTE' || upper === 'PARTICULAR') return 'PARTICULAR';

  return roles.includes('OTRO') ? 'OTRO' : roles[0] || 'OTRO';
}`;

const newFunc = `export function normalizeRole(rawRole: string | undefined | null, accountType?: string): string {
  const roles = getRolesForAccountType(accountType);
  if (!rawRole) return roles[0] || 'OTRO';
  const upper = rawRole.trim().toUpperCase();
  if (roles.includes(upper)) return upper;

  // Synonyms mapping
  let mapped = upper;
  if (upper === 'GARZON') mapped = 'GARZÓN';
  if (upper === 'PERSONAL' || upper === 'PERSONAL (STAFF)' || upper === 'STAFF') mapped = 'EMPLEADO';
  if (upper === 'SOUS CHEF') mapped = 'SOUS-CHEF';
  if (upper === 'INDIVIDUO' || upper === 'INDEPENDIENTE') mapped = 'PARTICULAR';

  if (roles.includes(mapped)) return mapped;

  // If the provided role (or mapped) is not valid for this account type, fallback to default for that account type
  return roles[0] || 'OTRO';
}`;

content = content.replace(oldFunc, newFunc);
fs.writeFileSync('src/utils/constants.ts', content);
