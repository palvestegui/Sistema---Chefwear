const fs = require('fs');
let content = fs.readFileSync('src/components/views/CRMView.tsx', 'utf8');

const target = /const hasRunRoleFix = React\.useRef\(false\);\s*useEffect\(\(\) => \{[\s\S]*?\}, \[db, masterContacts\]\);/;

const replacement = `const hasRunRoleFix = React.useRef(false);
  useEffect(() => {
    if (!db || !masterContacts || masterContacts.length === 0 || hasRunRoleFix.current) return;
    hasRunRoleFix.current = true;
    
    const accountTypeMap = new Map();
    clientAccounts.forEach(acc => {
       if (acc.accountId) {
          accountTypeMap.set(acc.accountId, acc.accountType || 'Universidad / Instituto');
       }
    });

    masterContacts.forEach(contact => {
      let needsUpdate = false;
      let newRole = contact.role;

      const accType = accountTypeMap.get(contact.accountId) || accountTypeMap.get(contact.parentAccountId);
      if (accType && normalizeAccountType(accType) !== 'Particular / Individuo' && contact.role === 'PARTICULAR') {
         const expectedRole = normalizeRole('PARTICULAR', accType);
         if (expectedRole !== 'PARTICULAR') {
            newRole = expectedRole;
            needsUpdate = true;
         }
      }
      
      const isUdi = (contact.accountId === 'ACC-001' || (contact.companyName && contact.companyName.toUpperCase().includes('UDI')));
      if (isUdi && (contact.role === 'PARTICULAR' || newRole === 'PARTICULAR')) {
        newRole = 'ESTUDIANTE';
        needsUpdate = true;
      }

      if (needsUpdate && newRole) {
        const contactId = contact.id || contact.contactId;
        if (contactId) {
           setDoc(doc(db, 'masterContacts', contactId), { role: newRole }, { merge: true }).catch(e => console.warn(e));
        }
      }
    });
  }, [db, masterContacts, clientAccounts]);`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/views/CRMView.tsx', content);
