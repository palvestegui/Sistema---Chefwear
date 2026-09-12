import re

with open('src/utils/databaseScripts.ts', 'r') as f:
    content = f.read()

# Replace deleteDoc with batch deletions
if "batch.delete(" not in content:
    # 1. Initialize batch
    content = content.replace("try {", "try {\n    const batch = writeBatch(db);")
    
    # 2. Replace deleteDocs
    content = content.replace("await deleteDoc(doc(db, 'clientAccounts', accDoc.id));", "batch.delete(doc(db, 'clientAccounts', accDoc.id));")
    content = content.replace("await deleteDoc(doc(db, 'masterContacts', cDoc.id));", "batch.delete(doc(db, 'masterContacts', cDoc.id));")
    content = content.replace("await deleteDoc(doc(db, 'contacts', cDoc.id));", "batch.delete(doc(db, 'contacts', cDoc.id));")
    content = content.replace("await deleteDoc(doc(db, 'account_contacts', lDoc.id));", "batch.delete(doc(db, 'account_contacts', lDoc.id));")
    
    # 3. Commit batch
    content = content.replace("result.success = true;", "await batch.commit();\n    result.success = true;")

with open('src/utils/databaseScripts.ts', 'w') as f:
    f.write(content)

