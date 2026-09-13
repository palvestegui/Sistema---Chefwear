const fs = require('fs');

let code = fs.readFileSync('src/utils/contactUtils.ts', 'utf8');

const oldStr = `      role: c.role || 'PARTICULAR',
      accountId: c.accountId || 'ACC-000',`;

const newStr = `      role: c.role ? c.role : (c.accountId === 'ACC-001' || (c.companyName && String(c.companyName).toUpperCase().includes('UDI'))) ? 'ESTUDIANTE' : (c.accountId === 'ACC-000' || !c.accountId) ? 'PARTICULAR' : 'OTRO',
      accountId: c.accountId || 'ACC-000',`;

if (code.includes(oldStr)) {
  code = code.replace(oldStr, newStr);
  fs.writeFileSync('src/utils/contactUtils.ts', code);
  console.log("Replaced role assignment");
} else {
  console.log("Could not find old string");
}
