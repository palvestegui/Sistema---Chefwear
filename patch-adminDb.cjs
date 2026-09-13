const fs = require('fs');
const content = `
import { initializeApp, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

let config: any = {
  projectId: 'mystic-return-81b2m',
  firestoreDatabaseId: 'ai-studio-0dba6e4d-b474-410e-b078-6e631bf1a01a'
};
try {
  const raw = fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf8');
  config = { ...config, ...JSON.parse(raw) };
} catch(e) {}

// Since the prompt explicitly instructed to use \`projectId: 'mystic-return-81b2m'\`
// We will initialize exactly as requested. 
const app = getApps().length === 0 ? initializeApp({ projectId: config.projectId }) : getApp();

// Use the Web SDK database ID config because otherwise it defaults to (default) which does not exist
export const db = getFirestore(app, config.firestoreDatabaseId);
`;

fs.writeFileSync('src/server/adminDb.ts', content);
