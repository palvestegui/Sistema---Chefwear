const fs = require('fs');

let code = fs.readFileSync('src/components/modals/EditContactModal.tsx', 'utf8');

const oldSubmit = `                const splitName = (editingMasterContact.fullName || '').trim().split(' ');
                const nombre = editingMasterContact.contactNombre || splitName[0] || '';
                const apellido = editingMasterContact.contactApellido || splitName.slice(1).join(' ') || '';

                const sizing = editingMasterContact.sizingMatrix || editingMasterContact.sizingMatrix12PtCM || editingMasterContact.measurements || {};
                const contactData = {
                  contactId: editingMasterContact.contactId,
                  accountId: editingMasterContact.accountId || '',
                  contactNombre: nombre,
                  contactApellido: apellido,
                  fullName: editingMasterContact.fullName,
                  role: editingMasterContact.role || '',
                  phone: editingMasterContact.phone || '',`;

const newSubmit = `                const splitName = (editingMasterContact.fullName || '').trim().split(' ');
                const nombre = editingMasterContact.contactNombre || splitName[0] || '';
                const apellido = editingMasterContact.contactApellido || splitName.slice(1).join(' ') || '';

                // Calculate the true displayed role to ensure we save exactly what the UI shows
                const selectedAcc = clientAccounts.find((a) => a.accountId === editingMasterContact.accountId);
                const roles = getRolesForAccountType(selectedAcc?.accountType);
                let finalRole = editingMasterContact.role || 'OTRO';
                if (!roles.includes(finalRole)) {
                  finalRole = normalizeRole(finalRole, selectedAcc?.accountType);
                }
                const actualRoleToSave = roles.includes(finalRole) ? finalRole : (roles[0] || 'OTRO');

                const sizing = editingMasterContact.sizingMatrix || editingMasterContact.sizingMatrix12PtCM || editingMasterContact.measurements || {};
                const contactData = {
                  contactId: editingMasterContact.contactId,
                  accountId: editingMasterContact.accountId || '',
                  contactNombre: nombre,
                  contactApellido: apellido,
                  fullName: editingMasterContact.fullName,
                  role: actualRoleToSave,
                  phone: editingMasterContact.phone || '',`;

if (code.includes(oldSubmit)) {
  code = code.replace(oldSubmit, newSubmit);
  fs.writeFileSync('src/components/modals/EditContactModal.tsx', code);
  console.log("Replaced submit logic in EditContactModal.tsx");
} else {
  console.log("Could not find submit block in EditContactModal.tsx");
}
