import React from 'react';
import { Shield, Check } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../../firebase';

export interface UsersManagementSectionProps {
  allUsers: any[];
  db: any;
}

export const UsersManagementSection: React.FC<UsersManagementSectionProps> = ({
  allUsers,
  db
}) => {
  return (
    <div className="bg-stone-900 p-8 rounded-[2.5rem] border border-stone-800 shadow-xl space-y-6">
      <div className="flex items-center gap-3 border-b border-stone-800 pb-4 mb-2 text-amber-500">
        <Shield size={28}/> <h2 className="text-2xl font-black uppercase tracking-tighter">Asignación de Roles y Permisos</h2>
      </div>
      <p className="text-xs text-stone-400 font-bold leading-relaxed">
        Configure los roles, apruebe nuevos usuarios y gestione los permisos granulares (exportar CSV, editar precios, gestionar roles y zona de peligro).
      </p>
      <div className="space-y-4">
        {allUsers.length === 0 ? (
          <div className="text-stone-500 text-xs italic font-bold text-center py-4 bg-stone-950 rounded-xl border border-stone-800">
            Aún no se han registrado usuarios en la base de datos. Se verán a medida que ingresen.
          </div>
        ) : (
          allUsers.map((u: any) => {
            const userStatus = u.status || 'APPROVED';
            const isPending = userStatus === 'PENDING';
            
            return (
              <div key={u.uid || u.email || u.id} className={`p-5 rounded-2xl border transition space-y-4 ${
                isPending ? 'bg-amber-950/20 border-amber-500/50' : 'bg-stone-950 border-stone-800'
              }`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-extrabold text-stone-200 text-sm">{u.displayName || u.name || 'Miembro de Equipo'}</p>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                        isPending ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}>
                        {isPending ? 'PENDIENTE DE APROBACIÓN' : 'APROBADO'}
                      </span>
                    </div>
                    <p className="font-mono text-[10px] text-stone-400 mt-0.5">{u.email}</p>
                    <p className="font-mono text-[9px] text-stone-600">UID: {u.id}</p>
                    {u.lastLoginAt && (
                      <p className="text-[10px] text-amber-400/80 font-mono font-bold mt-1">
                        Último acceso: {u.lastLoginAt?.toDate ? u.lastLoginAt.toDate().toLocaleString('es-BO') : u.lastLoginAt?.seconds ? new Date(u.lastLoginAt.seconds * 1000).toLocaleString('es-BO') : String(u.lastLoginAt)}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    {isPending && (
                      <button
                        onClick={async () => {
                          try {
                            const roleUpper = (u.role || 'SALES').toUpperCase();
                            let defaultPerms = {
                              canExport: false,
                              canEditPrices: false,
                              canManageRoles: false,
                              canAccessDangerZone: false
                            };
                            if (roleUpper === 'SUPER_ADMIN' || roleUpper === 'ADMIN') {
                              defaultPerms = { canExport: true, canEditPrices: true, canManageRoles: true, canAccessDangerZone: true };
                            } else if (roleUpper === 'ADMIN_PROD' || roleUpper === 'PRODUCCION') {
                              defaultPerms = { canExport: true, canEditPrices: true, canManageRoles: false, canAccessDangerZone: false };
                            } else if (roleUpper === 'OPS_LEON' || roleUpper === 'OPERACIONES') {
                              defaultPerms = { canExport: true, canEditPrices: false, canManageRoles: false, canAccessDangerZone: false };
                            }

                            await updateDoc(doc(db, 'users', u.id), {
                              status: 'APPROVED',
                              ...defaultPerms
                            });
                            alert(`¡Usuario ${u.displayName || u.email} APROBADO exitosamente!`);
                          } catch (err) {
                            handleFirestoreError(err, OperationType.UPDATE, `users/${u.id}`);
                          }
                        }}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 shadow-md shadow-emerald-900/20"
                      >
                        <Check size={14} /> Aprobar Usuario
                      </button>
                    )}

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-stone-500 uppercase tracking-wider">Rol:</span>
                      <select
                        value={(u.role || '').toUpperCase()}
                        onChange={async (e) => {
                          const newRoleVal = e.target.value;
                          try {
                            let defaultPerms = {
                              canExport: false,
                              canEditPrices: false,
                              canManageRoles: false,
                              canAccessDangerZone: false
                            };
                            if (newRoleVal === 'SUPER_ADMIN' || newRoleVal === 'ADMIN') {
                              defaultPerms = { canExport: true, canEditPrices: true, canManageRoles: true, canAccessDangerZone: true };
                            } else if (newRoleVal === 'ADMIN_PROD' || newRoleVal === 'PRODUCCION') {
                              defaultPerms = { canExport: true, canEditPrices: true, canManageRoles: false, canAccessDangerZone: false };
                            } else if (newRoleVal === 'OPS_LEON' || newRoleVal === 'OPERACIONES') {
                              defaultPerms = { canExport: true, canEditPrices: false, canManageRoles: false, canAccessDangerZone: false };
                            }

                            await updateDoc(doc(db, 'users', u.id), { 
                              role: newRoleVal,
                              status: 'APPROVED',
                              ...defaultPerms
                            });
                            alert(`¡Rol y permisos de ${u.displayName || u.email} actualizados a ${newRoleVal}!`);
                          } catch (err) {
                            handleFirestoreError(err, OperationType.UPDATE, `users/${u.id}`);
                          }
                        }}
                        className="bg-stone-900 border border-stone-800 px-3 py-2 rounded-lg font-black text-xs text-amber-500 outline-none cursor-pointer focus:border-amber-500 uppercase tracking-wide"
                      >
                        <option value="SUPER_ADMIN">Super Admin (Pablo)</option>
                        <option value="ADMIN_PROD">Admin Prod (Doris)</option>
                        <option value="OPS_LEON">Operaciones (León)</option>
                        <option value="SALES">Ventas (Matias / Equipo)</option>
                        <option value="PRODUCCION">Producción (Taller)</option>
                        <option value="LOGISTICA">Logística</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Granular Permission Flags Toggle Panel */}
                <div className="pt-3 border-t border-stone-900 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await updateDoc(doc(db, 'users', u.id), { canExport: !u.canExport });
                      } catch (e) { handleFirestoreError(e, OperationType.UPDATE, `users/${u.id}`); }
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition flex items-center justify-between ${
                      u.canExport ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' : 'bg-stone-900 border-stone-800 text-stone-600'
                    }`}
                  >
                    <span>Exportar CSV</span>
                    <span className="font-mono">{u.canExport ? 'SI' : 'NO'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await updateDoc(doc(db, 'users', u.id), { canEditPrices: !u.canEditPrices });
                      } catch (e) { handleFirestoreError(e, OperationType.UPDATE, `users/${u.id}`); }
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition flex items-center justify-between ${
                      u.canEditPrices ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' : 'bg-stone-900 border-stone-800 text-stone-600'
                    }`}
                  >
                    <span>Editar Precios</span>
                    <span className="font-mono">{u.canEditPrices ? 'SI' : 'NO'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await updateDoc(doc(db, 'users', u.id), { canManageRoles: !u.canManageRoles });
                      } catch (e) { handleFirestoreError(e, OperationType.UPDATE, `users/${u.id}`); }
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition flex items-center justify-between ${
                      u.canManageRoles ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' : 'bg-stone-900 border-stone-800 text-stone-600'
                    }`}
                  >
                    <span>Gestionar Roles</span>
                    <span className="font-mono">{u.canManageRoles ? 'SI' : 'NO'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await updateDoc(doc(db, 'users', u.id), { canAccessDangerZone: !u.canAccessDangerZone });
                      } catch (e) { handleFirestoreError(e, OperationType.UPDATE, `users/${u.id}`); }
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition flex items-center justify-between ${
                      u.canAccessDangerZone ? 'bg-rose-500/10 border-rose-500/40 text-rose-400' : 'bg-stone-900 border-stone-800 text-stone-600'
                    }`}
                  >
                    <span>Zona Peligro</span>
                    <span className="font-mono">{u.canAccessDangerZone ? 'SI' : 'NO'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
