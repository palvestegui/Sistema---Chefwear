const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(
  "import { initializeApp, getApps } from 'firebase-admin/app';",
  "import { app as firebaseApp } from './src/firebase';"
);

content = content.replace(
  "import { getFirestore, DocumentData } from 'firebase-admin/firestore';",
  "import { getFirestore } from 'firebase/firestore';"
);

content = content.replace(
  /if \(!getApps\(\)\.length && firebaseConfig[\s\S]+?\}\n/,
  ""
);

content = content.replace(
  /const db = getFirestore\('chefwear-db'\);/g,
  "const db = getFirestore(firebaseApp, 'chefwear-db');"
);

// Add global error handler
const globalError = `
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
`;

content = globalError + '\n' + content;

fs.writeFileSync('server.ts', content);
