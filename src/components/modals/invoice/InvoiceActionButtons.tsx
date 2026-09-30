import React from 'react';
import { X, FileText, Download } from 'lucide-react';

interface InvoiceActionButtonsProps {
  order: any;
  showWhatsappFormatId: string | null;
  setShowWhatsappFormatId: (val: string | null) => void;
  setViewingInvoiceId: (val: string | null) => void;
  downloadOrderImage: (elementId: string, customerName: string, format: 'png' | 'pdf', wpText?: string) => void;
  getWhatsAppText: (order: any, isOrder: boolean) => string;
}

export const InvoiceActionButtons: React.FC<InvoiceActionButtonsProps> = ({
  order,
  showWhatsappFormatId,
  setShowWhatsappFormatId,
  setViewingInvoiceId,
  downloadOrderImage,
  getWhatsAppText,
}) => {
  return (
    <div className="mt-8 pt-8 border-t border-stone-100 flex gap-4 no-print" style={{ borderColor: '#f5f5f4' }}>
      {showWhatsappFormatId !== order.id && (
        <button
          onClick={() => downloadOrderImage(`invoice-${order.id}`, order.customer, 'pdf')}
          className="flex-1 bg-stone-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-stone-800 transition"
        >
          <FileText size={16} /> Imprimir / Guardar PDF
        </button>
      )}
      <div className="flex gap-2">
        {showWhatsappFormatId === order.id ? (
          <div className="flex-1 flex gap-2 animate-in slide-in-from-bottom-2">
            <button
              onClick={() => {
                downloadOrderImage(`invoice-${order.id}`, order.customer, 'pdf', getWhatsAppText(order, order.status !== 'Estimado'));
                setShowWhatsappFormatId(null);
              }}
              className="flex-1 bg-[#25D366] text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-[#20b858] transition"
            >
              <FileText size={16} /> PDF
            </button>
            <button
              onClick={() => {
                downloadOrderImage(`invoice-${order.id}`, order.customer, 'png', getWhatsAppText(order, order.status !== 'Estimado'));
                setShowWhatsappFormatId(null);
              }}
              className="flex-1 bg-[#25D366] text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-[#20b858] transition"
            >
              <Download size={16} /> PNG
            </button>
            <button
              onClick={() => setShowWhatsappFormatId(null)}
              className="px-6 bg-stone-200 text-stone-600 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-stone-300 transition"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowWhatsappFormatId(order.id)}
            className="flex-1 bg-[#25D366] text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-[#20b858] transition"
          >
            Enviar por WhatsApp
          </button>
        )}

        {showWhatsappFormatId !== order.id && (
          <button
            onClick={() => {
              setViewingInvoiceId(null);
              setShowWhatsappFormatId(null);
            }}
            className="px-6 bg-stone-200 text-stone-600 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-stone-300 transition"
          >
            Cerrar
          </button>
        )}
      </div>
    </div>
  );
};
