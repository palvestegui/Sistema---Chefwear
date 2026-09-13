const fs = require('fs');
const content = `
import { initializeApp, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

let config: any = {
  projectId: 'mystic-return-81b2m'
};
try {
  const raw = fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf8');
  config = { ...config, ...JSON.parse(raw) };
} catch(e) {}

// The user states: "if chefwear-db is a named database: const db = admin.firestore({ databaseId: 'chefwear-db' })"
// AND explicitly asked to use "projectId: 'mystic-return-81b2m'".
// BUT earlier we hit PERMISSION_DENIED because we were using the AI Studio config JSON values. 
// We will follow the EXACT user request now.
const app = getApps().length === 0 ? initializeApp({ projectId: 'mystic-return-81b2m' }) : getApp();

// Use 'chefwear-db' as named database if provided, or default
export const db = getFirestore(app, 'chefwear-db');
`;

fs.writeFileSync('src/server/adminDb.ts', content);
