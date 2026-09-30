import React from 'react';

interface InvoiceFinancialLedgerProps {
  order: any;
  subtotal: number;
  totalPrice: number;
  totalPaid: number;
  balance: number;
  credit: number;
  breakdown: any;
  getOrderBreakdown: (
    items: any[],
    category: string,
    paymentMethod: string,
    manualDiscount: number,
    clientType: string,
    accountId?: string,
    migrationFlatDiscount?: number
  ) => any;
}

export const InvoiceFinancialLedger: React.FC<InvoiceFinancialLedgerProps> = ({
  order,
  subtotal,
  totalPrice,
  totalPaid,
  balance,
  credit,
  breakdown,
  getOrderBreakdown,
}) => {
  const rawDiscount = Math.max(0, subtotal - totalPrice);

  return (
    <div className="bg-stone-50 p-6 rounded-2xl flex flex-col gap-3" style={{ backgroundColor: '#fafaf9' }}>
      <div className="flex justify-between items-center text-stone-500" style={{ color: '#57534e' }}>
        <span className="text-xs font-bold uppercase tracking-widest">Subtotal</span>
        <span className="font-mono text-sm font-bold"><span className="normal-case">Bs</span>{subtotal.toFixed(2)}</span>
      </div>

      {/* Display discount line item before Total General if discounts exist */}
      {breakdown.lines && breakdown.lines.length > 0 ? (
        breakdown.lines.map((line: any, idx: number) => (
          <div key={idx} className="flex justify-between items-center" style={{ color: '#d97706' }}>
            <span className="text-xs font-black uppercase tracking-widest">{line.label}</span>
            <span className="font-bold">-<span className="normal-case">Bs</span>{Number(line.amount).toFixed(2)}</span>
          </div>
        ))
      ) : (rawDiscount > 0.001 || (order.manualDiscount && order.manualDiscount > 0)) ? (
        <div className="flex justify-between items-center" style={{ color: '#d97706' }}>
          <span className="text-xs font-black uppercase tracking-widest">
            {order.manualDiscount ? `Descuento Manual (${order.manualDiscount}%)` : 'Descuento'}
          </span>
          <span className="font-bold">-<span className="normal-case">Bs</span>{(rawDiscount > 0 ? rawDiscount : (order.totalDiscount || 0)).toFixed(2)}</span>
        </div>
      ) : null}

      <div className="flex justify-between items-center text-stone-500" style={{ color: '#1c1917' }}>
        <span className="text-sm font-black uppercase tracking-widest">Total General</span>
        <span className="font-mono text-2xl font-black"><span className="normal-case">Bs</span>{totalPrice.toFixed(2)}</span>
      </div>

      {order.status === 'Estimado' && totalPaid === 0 ? (
        <React.Fragment>
          <div className="flex justify-between items-center text-amber-600" style={{ color: '#d97706' }}>
            <span className="text-xs font-black uppercase tracking-widest">Abono Mínimo (50%)</span>
            <span className="font-bold text-base">Bs{order.paymentMethod === '100% Contado' ? totalPrice.toFixed(2) : (totalPrice * 0.5).toFixed(2)}</span>
          </div>

          {(() => {
            const breakdownCash = getOrderBreakdown(
              order.items || [],
              order.pricingTier || order.category || order.clientType,
              '100% Contado',
              order.manualDiscount || 0,
              order.clientType,
              order.accountId,
              order.migrationFlatDiscount || 0
            );
            const cashPct = breakdownCash.cashDiscountPct || 10;
            const cashTotal = breakdownCash.total;
            const currentTotal = totalPrice || breakdownCash.subtotal;
            const savings = Math.max(0, currentTotal - cashTotal);

            if (cashPct > 0 && savings > 0.01 && (order.paymentMethod || '50/50 - Adelantado/Entrega') !== '100% Contado') {
              return (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center mt-3" style={{ backgroundColor: '#fffbeb', borderColor: '#fde68a' }}>
                  <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest leading-normal">
                    💡 ¡Ahorre {cashPct}% pagando todo al contado!
                    <br />
                    El total queda en <span className="font-mono font-black" style={{ color: '#1c1917' }}><span className="normal-case">Bs</span>{cashTotal.toFixed(2)}</span> (Ahorro: <span className="font-mono font-black text-amber-700" style={{ color: '#b45309' }}><span className="normal-case">Bs</span>{savings.toFixed(2)}</span>).
                  </p>
                </div>
              );
            }
            return null;
          })()}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="flex justify-between items-center text-green-600" style={{ color: '#16a34a' }}>
            <span className="text-xs font-black uppercase tracking-widest">Monto Pagado</span>
            <span className="font-bold text-base"><span className="normal-case">Bs</span>{totalPaid.toFixed(2)}</span>
          </div>

          {credit > 0 ? (
            <div className="flex justify-between items-center text-emerald-600 border-t border-stone-200 pt-3" style={{ color: '#059669', borderColor: '#e5e5e5' }}>
              <span className="text-xs font-black uppercase tracking-widest">Saldo a Favor</span>
              <span className="font-bold text-base font-mono"><span className="normal-case">Bs</span>{credit.toFixed(2)}</span>
            </div>
          ) : (
            <div className="flex justify-between items-center text-red-600 border-t border-stone-200 pt-3" style={{ color: '#dc2626', borderColor: '#e5e5e5' }}>
              <span className="text-xs font-black uppercase tracking-widest">Saldo Pendiente</span>
              <span className="font-bold text-base font-mono"><span className="normal-case">Bs</span>{balance.toFixed(2)}</span>
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
};
