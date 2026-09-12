import re

with open('src/utils/databaseScripts.ts', 'r') as f:
    content = f.read()

# Add import for db
if "import { db as defaultDb }" not in content:
    content = content.replace(
        "import { collection, getDocs, doc, deleteDoc, writeBatch } from 'firebase/firestore';",
        "import { collection, getDocs, doc, deleteDoc, writeBatch } from 'firebase/firestore';\nimport { db as defaultDb } from '../firebase';"
    )

# Modify executeMockDirectoryPurge signature
content = re.sub(
    r"export const executeMockDirectoryPurge = async \(db: any, force = false\)",
    r"export const executeMockDirectoryPurge = async (db: any = defaultDb, force = false)",
    content
)

# Modify purgeMockDirectoryData signature
content = re.sub(
    r"export const purgeMockDirectoryData = async \(db: any\)",
    r"export const purgeMockDirectoryData = async (db: any = defaultDb)",
    content
)

with open('src/utils/databaseScripts.ts', 'w') as f:
    f.write(content)
