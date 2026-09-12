const fs = require('fs');
let content = fs.readFileSync('src/utils/institutionalOrderUtils.ts', 'utf8');

content = content.replace(
  /role: emp\.role \|\| 'Empleado'/g,
  "role: emp.role || (corporateAccount.clientType === 'Universidad / Instituto' ? 'ESTUDIANTE' : (corporateAccount.clientType === 'Particular / Individuo' ? 'PARTICULAR' : 'EMPLEADO'))"
);

fs.writeFileSync('src/utils/institutionalOrderUtils.ts', content);
