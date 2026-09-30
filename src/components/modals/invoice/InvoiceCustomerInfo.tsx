import React from 'react';
import { getOrderSellerName } from '../../../utils/sellerUtils';

interface InvoiceCustomerInfoProps {
  order: any;
  displayId: string;
  isQuote: boolean;
  formatDate: (ts: string | number) => string;
}

export const InvoiceCustomerInfo: React.FC<InvoiceCustomerInfoProps> = ({
  order,
  displayId,
  isQuote,
  formatDate,
}) => {
  return (
    <>
      <div className="flex justify-between items-start border-b-2 border-stone-100 pb-8 mb-8" style={{ borderColor: '#f5f5f4' }}>
        <div className="flex flex-col items-center text-center">
          <h2 className="text-4xl font-black tracking-tighter uppercase leading-none" style={{ color: '#1c1917' }}>Azafrán</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mt-1" style={{ color: '#57534e' }}>Chefwear</p>
          <p className="text-xs font-mono font-bold text-amber-400 tracking-wider">#{displayId}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-black uppercase tracking-widest text-stone-500" style={{ color: '#44403c' }}>
            {isQuote ? 'Cotización / Resumen' : 'Invoice / Resumen'}
          </p>
          <p className="text-sm font-mono font-bold mt-1">#{displayId}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
        <div>
          <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2" style={{ color: '#57534e' }}>Cliente</h4>
          <p className="text-2xl font-black uppercase tracking-tight" style={{ color: '#000000' }}>{order.customer}</p>
          <p className="text-[11px] font-bold text-stone-600 uppercase tracking-widest mt-1.5" style={{ color: '#57534e' }}>
            {order.clientType || order.pricingTier || order.category}
            {order.parentAccountName ? ` - ${order.parentAccountName}` : (order.companyName ? ` - ${order.companyName}` : '')}
          </p>
          {order.phone && <p className="text-[11px] font-bold text-stone-600 uppercase tracking-widest mt-1" style={{ color: '#57534e' }}>Tel: {order.phone}</p>}
          {order.email && <p className="text-[11px] font-bold text-stone-600 uppercase tracking-widest mt-1" style={{ color: '#57534e' }}>Email: {order.email}</p>}
          {order.address && <p className="text-[11px] font-bold text-stone-600 uppercase tracking-widest mt-1" style={{ color: '#57534e' }}>Dir: {order.address}</p>}
        </div>
        <div className="sm:text-right text-left sm:mt-0 mt-4">
          <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2" style={{ color: '#57534e' }}>Fecha y Hora</h4>
          <p className="text-sm font-mono font-bold" style={{ color: '#1c1917' }}>{formatDate(order.createdAt || Date.now())}</p>
          
          <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mt-6 mb-2" style={{ color: '#57534e' }}>Estado</h4>
          <p className={`text-sm font-black uppercase tracking-widest ${order.status === 'Estimado' ? 'text-stone-400' : 'text-amber-500'}`} style={{ color: order.status === 'Estimado' ? '#78716c' : '#f59e0b' }}>
            {order.status}
          </p>
          
          <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mt-6 mb-2" style={{ color: '#57534e' }}>Vendedor</h4>
          <p className="text-xs font-bold uppercase" style={{ color: '#57534e' }}>{getOrderSellerName(order)}</p>
        </div>
      </div>
    </>
  );
};
