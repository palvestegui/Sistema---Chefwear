import React from 'react';
import { Users, Receipt, UserPlus } from 'lucide-react';

interface InvoiceTabBarProps {
  activeTab: 'invoice' | 'packing_slip';
  setActiveTab: (tab: 'invoice' | 'packing_slip') => void;
  isInstitutional: boolean;
  rosterCount: number;
  order: any;
  onOpenEditRoster?: (order: any) => void;
}

export const InvoiceTabBar: React.FC<InvoiceTabBarProps> = ({
  activeTab,
  setActiveTab,
  isInstitutional,
  rosterCount,
  order,
  onOpenEditRoster,
}) => {
  return (
    <div className="bg-stone-100 p-2 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2 no-print px-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('invoice')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 ${
            activeTab === 'invoice' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Receipt size={14} /> Factura / Resumen
        </button>
        {isInstitutional && (
          <button
            type="button"
            onClick={() => setActiveTab('packing_slip')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 ${
              activeTab === 'packing_slip' ? 'bg-white text-amber-700 shadow-sm' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Users size={14} /> Planilla de Entrega ({rosterCount})
          </button>
        )}
      </div>

      {onOpenEditRoster && (
        <button
          type="button"
          onClick={() => onOpenEditRoster(order)}
          className="px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 bg-amber-500/10 text-amber-800 border border-amber-500/30 hover:bg-amber-500/20 cursor-pointer ml-auto"
          title="Cargar o editar la lista de empleados y tallas"
        >
          <UserPlus size={14} /> {isInstitutional ? 'Editar Nómina' : 'Cargar Nómina Institucional'}
        </button>
      )}
    </div>
  );
};
