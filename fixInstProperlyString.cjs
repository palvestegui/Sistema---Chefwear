const fs = require('fs');
let content = fs.readFileSync('src/utils/institutionalOrderUtils.ts', 'utf8');

const s1 = "role: emp.role || existing?.role || (normalizeAccountType(corporateAccount.clientType) === 'Universidad / Instituto' ? 'ESTUDIANTE' : (normalizeAccountType(corporateAccount.clientType) === 'Particular / Individuo' ? 'PARTICULAR' : 'EMPLEADO')),";
content = content.replace(s1, "role: normalizeRole(emp.role || existing?.role, corporateAccount.clientType),");

const s2 = "role: emp.role || (normalizeAccountType(corporateAccount.clientType) === 'Universidad / Instituto' ? 'ESTUDIANTE' : (normalizeAccountType(corporateAccount.clientType) === 'Particular / Individuo' ? 'PARTICULAR' : 'EMPLEADO')),";
content = content.replace(s2, "role: normalizeRole(emp.role, corporateAccount.clientType),");

fs.writeFileSync('src/utils/institutionalOrderUtils.ts', content);
