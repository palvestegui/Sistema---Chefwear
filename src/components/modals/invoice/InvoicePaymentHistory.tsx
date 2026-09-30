import React from 'react';

interface InvoicePaymentHistoryProps {
  paymentHistory: any[];
  formatDate: (ts: string | number) => string;
}

export const InvoicePaymentHistory: React.FC<InvoicePaymentHistoryProps> = ({
  paymentHistory,
  formatDate,
}) => {
  if (!paymentHistory || paymentHistory.length === 0) return null;

  return (
    <div className="mb-10">
      <h4
        className="text-xs font-black uppercase tracking-widest mb-4 border-b-2 pb-3"
        style={{ borderColor: '#f5f5f4', color: '#1c1917' }}
      >
        Historial de Pagos y Movimientos
      </h4>
      <div className="flex flex-col gap-3 text-xs font-bold">
        {paymentHistory.map((p: any, idx: number) => {
          const isNegative = Number(p.amount || 0) < 0;
          let tendered = p.tendered !== undefined && p.tendered !== null ? Number(p.tendered) : null;
          let change = p.change !== undefined && p.change !== null ? Number(p.change) : null;
          const note = (p.note || '').trim();

          if (tendered === null && note) {
            const matchRecibido = note.match(
              /(?:Recibido|Entregado|Pag[oó] con)\s*(?:Bs\.?|BOB)?\s*([0-9]+(?:[.,][0-9]+)?)/i
            );
            if (matchRecibido) tendered = parseFloat(matchRecibido[1].replace(',', '.'));
          }
          if (change === null && note) {
            const matchVuelto = note.match(
              /(?:Vuelto|Cambio)(?: entregado)?:\s*(?:Bs\.?|BOB)?\s*([0-9]+(?:[.,][0-9]+)?)/i
            );
            if (matchVuelto) change = parseFloat(matchVuelto[1].replace(',', '.'));
          }

          return (
            <div
              key={idx}
              className="flex flex-col border-b pb-3 last:border-0 last:pb-0"
              style={{ borderColor: '#f5f5f4' }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="uppercase font-black" style={{ color: isNegative ? '#059669' : '#1c1917' }}>
                    {isNegative ? 'Devolución / Vuelto' : `Abono ${idx + 1}`} · {formatDate(p.date)}
                  </span>
                  {p.method && (
                    <span
                      className="text-[9px] font-bold px-2 py-0.5 rounded uppercase font-sans"
                      style={{ backgroundColor: '#f5f5f4', color: '#44403c' }}
                    >
                      {p.method}
                    </span>
                  )}
                </div>
                <span
                  className="font-mono text-sm font-black"
                  style={{ color: isNegative ? '#059669' : '#16a34a' }}
                >
                  {isNegative ? '-' : ''}Bs{Math.abs(Number(p.amount || 0)).toFixed(2)}
                </span>
              </div>

              {/* Breakdown of Cash / Tendered & Change */}
              {(tendered !== null || change !== null) && (
                <div
                  className="mt-1.5 px-3 py-1.5 rounded-lg flex items-center justify-between text-[10px] font-mono"
                  style={{ backgroundColor: '#f5f5f4', color: '#44403c' }}
                >
                  <div className="flex items-center gap-3">
                    {tendered !== null && (
                      <span>
                        <strong style={{ color: '#1c1917' }}>Cliente pagó:</strong> Bs{tendered.toFixed(2)}
                      </span>
                    )}
                    {change !== null && change > 0.001 && (
                      <span style={{ color: '#059669' }}>
                        • <strong style={{ color: '#047857' }}>Vuelto entregado:</strong> Bs{change.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] font-sans font-bold uppercase tracking-wider" style={{ color: '#44403c' }}>
                    {p.method || 'Efectivo'}
                  </span>
                </div>
              )}

              {/* Note if informative and not duplicate */}
              {note &&
                !note.startsWith('Abono/Saldo - Pago') &&
                !note.startsWith('Cobro Inicial') &&
                !note.startsWith('Confirmación (Abono 50%)') &&
                !note.startsWith('Abono Registrado') && (
                  <p className="text-[10px] font-normal mt-1 italic" style={{ color: '#44403c' }}>
                    Nota: {note}
                  </p>
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
