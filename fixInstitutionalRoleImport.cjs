const fs = require('fs');
let content = fs.readFileSync('src/utils/institutionalOrderUtils.ts', 'utf8');

if (!content.includes('normalizeAccountType')) {
  content = content.replace(
    /import \{ ensureCorporateAccountExists \} from '\.\/accountContactUtils';/,
    "import { ensureCorporateAccountExists } from './accountContactUtils';\nimport { normalizeAccountType } from './constants';"
  );
}

content = content.replace(
  /corporateAccount\.clientType === 'Universidad \/ Instituto'/g,
  "normalizeAccountType(corporateAccount.clientType) === 'Universidad / Instituto'"
);

content = content.replace(
  /corporateAccount\.clientType === 'Particular \/ Individuo'/g,
  "normalizeAccountType(corporateAccount.clientType) === 'Particular / Individuo'"
);

fs.writeFileSync('src/utils/institutionalOrderUtils.ts', content);
