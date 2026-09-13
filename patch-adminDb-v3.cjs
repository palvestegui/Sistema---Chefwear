const fs = require('fs');
const content = `
import { initializeApp, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

let config: any = {};
try {
  const raw = fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf8');
  config = { ...config, ...JSON.parse(raw) };
} catch(e) {}

const app = getApps().length === 0 ? initializeApp({ projectId: config.projectId }) : getApp();

export const db = getFirestore(app);
`;

fs.writeFileSync('src/server/adminDb.ts', content);
