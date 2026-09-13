const fs = require('fs');

let content = fs.readFileSync('src/server/mcp.ts', 'utf8');

content = content.replace(
  "import { getFirestore } from 'firebase-admin/firestore';",
  "import { getFirestore } from 'firebase/firestore';\nimport { app as firebaseApp } from '../firebase';"
);

content = content.replace(
  /const db = getFirestore\('chefwear-db'\);/g,
  "const db = getFirestore(firebaseApp, 'chefwear-db');"
);

fs.writeFileSync('src/server/mcp.ts', content);
