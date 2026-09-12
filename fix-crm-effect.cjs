const fs = require('fs');
let content = fs.readFileSync('src/components/views/CRMView.tsx', 'utf8');

const target = "  // Local CRM Search & Filter State";
const insertion = `  const hasRunRoleFix = React.useRef(false);
  useEffect(() => {
    if (!db || !masterContacts || masterContacts.length === 0 || hasRunRoleFix.current) return;
    hasRunRoleFix.current = true;
    
    masterContacts.forEach(contact => {
      const isUdi = (contact.accountId === 'ACC-001' || (contact.companyName && contact.companyName.toUpperCase().includes('UDI')));
      if (isUdi && contact.role === 'PARTICULAR') {
        const contactId = contact.id || contact.contactId;
        if (contactId) {
           setDoc(doc(db, 'masterContacts', contactId), { role: 'ESTUDIANTE' }, { merge: true }).catch(e => console.warn(e));
        }
      }
    });
  }, [db, masterContacts]);

  // Local CRM Search & Filter State`;

content = content.replace(target, insertion);
fs.writeFileSync('src/components/views/CRMView.tsx', content);
