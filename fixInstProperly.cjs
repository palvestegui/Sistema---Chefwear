const fs = require('fs');
let content = fs.readFileSync('src/utils/institutionalOrderUtils.ts', 'utf8');

// Using simple replace because there's only 2 matches
content = content.replace(
  /role: emp\.role \|\| existing\?\.role \|\| \(normalizeAccountType[^)]+\) === 'Universidad \/ Instituto' \? 'ESTUDIANTE' : \(normalizeAccountType[^)]+\) === 'Particular \/ Individuo' \? 'PARTICULAR' : 'EMPLEADO'\),/g,
  "role: normalizeRole(emp.role || existing?.role, corporateAccount.clientType),"
);

content = content.replace(
  /role: emp\.role \|\| \(normalizeAccountType[^)]+\) === 'Universidad \/ Instituto' \? 'ESTUDIANTE' : \(normalizeAccountType[^)]+\) === 'Particular \/ Individuo' \? 'PARTICULAR' : 'EMPLEADO'\),/g,
  "role: normalizeRole(emp.role, corporateAccount.clientType),"
);

fs.writeFileSync('src/utils/institutionalOrderUtils.ts', content);
