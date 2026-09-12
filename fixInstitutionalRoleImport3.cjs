const fs = require('fs');
let content = fs.readFileSync('src/utils/institutionalOrderUtils.ts', 'utf8');

if (!content.includes('import { normalizeAccountType }')) {
  content = content.replace(
    /import \{ normalizeName \} from '\.\/contactUtils';/,
    "import { normalizeName } from './contactUtils';\nimport { normalizeAccountType } from './constants';"
  );
}

fs.writeFileSync('src/utils/institutionalOrderUtils.ts', content);
