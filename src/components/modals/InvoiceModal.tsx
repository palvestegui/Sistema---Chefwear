import React, { useState } from 'react';
import { resolveItemPrice } from '../../utils/pricingResolver';
import { usePricingEngine } from '../../hooks/usePricingEngine';
import { InstitutionalPackingSlip } from './invoice/InstitutionalPackingSlip';
import { InvoiceTabBar } from './invoice/InvoiceTabBar';
import { InvoiceCustomerInfo } from './invoice/InvoiceCustomerInfo';
import { InvoicePaymentHistory } from './invoice/InvoicePaymentHistory';
import { InvoiceFinancialLedger } from './invoice/InvoiceFinancialLedger';
import { InvoiceActionButtons } from './invoice/InvoiceActionButtons';
import { consolidateCommercialItems } from '../../utils/orderItemConsolidation';

interface InvoiceModalProps {
  viewingInvoice: any;
  setViewingInvoiceId: (val: string | null) => void;
  showWhatsappFormatId: string | null;
  setShowWhatsappFormatId: (val: string | null) => void;
  getDocType: (order: any) => string;
  formatDate: (ts: string | number) => string;
  collapseUdiItems?: (items: any[]) => any[];
  pricing: any;
  getItemUnitPrice?: (it: any, category: string, accountId?: string) => number;
  getOrderBreakdown: (
    items: any[],
    category: string,
    paymentMethod: string,
    manualDiscount: number,
    clientType: string,
    accountId?: string,
    migrationFlatDiscount?: number
  ) => any;
  downloadOrderImage: (elementId: string, customerName: string, format: 'png' | 'pdf', wpText?: string) => void;
  getWhatsAppText: (order: any, isOrder: boolean) => string;
  onOpenEditRoster?: (order: any) => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  viewingInvoice,
  setViewingInvoiceId,
  showWhatsappFormatId,
  setShowWhatsappFormatId,
  getDocType,
  formatDate,
  pricing,
  getOrderBreakdown,
  downloadOrderImage,
  getWhatsAppText,
  onOpenEditRoster,
}) => {
  const [activeTab, setActiveTab] = useState<'invoice' | 'packing_slip'>('invoice');

  if (!viewingInvoice) return null;
  const order = viewingInvoice;
  const { getServiceUnitPrice } = usePricingEngine(pricing);

  const breakdown = getOrderBreakdown(
    order.items || [],
    order.pricingTier || order.category || order.clientType,
    order.paymentMethod,
    order.manualDiscount,
    order.clientType,
    order.accountId,
    order.migrationFlatDiscount || 0
  );

  const isQuote = getDocType(order) === 'COTIZACION';
  const displayId =
    isQuote && !order.id.toLowerCase().startsWith('cot') ? order.id.replace(/^ord-/i, 'cot-') : order.id;
  const isInstitutional = Boolean(
    order.isInstitutional ||
      (order.institutionalRoster && order.institutionalRoster.length > 0) ||
      (order.items || []).some((it: any) => Boolean(it.recipientName))
  );

  // Financial Ledger Formatting & Defensive Payment Resolution
  const subtotal = Number(order.subtotal ?? order.totalPrice ?? 0);
  const totalPrice = Number(order.totalPrice ?? 0);
  const totalPaid = (order.paymentHistory && order.paymentHistory.length > 0)
    ? order.paymentHistory.reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0)
    : (Number(order.amountCollected) || 0);
  const balance = Math.max(0, totalPrice - totalPaid);
  const credit = totalPaid > totalPrice ? totalPaid - totalPrice : 0;

  return (
    <div className="fixed inset-0 bg-stone-950/90 backdrop-blur-xl z-[100] flex justify-center items-start p-4 overflow-y-auto py-12">
      <div className={`bg-white text-stone-950 w-full ${isInstitutional && activeTab === 'packing_slip' ? 'max-w-3xl' : 'max-w-xl'} rounded-[3rem] overflow-hidden shadow-2xl relative my-auto transition-all`}>
        <InvoiceTabBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isInstitutional={isInstitutional}
          rosterCount={order.institutionalRoster?.length || 0}
          order={order}
          onOpenEditRoster={onOpenEditRoster}
        />

        <div id={`invoice-${order.id}`} className="p-10 bg-white" style={{ color: '#1c1917', backgroundColor: '#ffffff' }}>
          {activeTab === 'packing_slip' ? (
            <InstitutionalPackingSlip order={order} formatDate={formatDate} />
          ) : (
            <>
              <InvoiceCustomerInfo
                order={order}
                displayId={displayId}
                isQuote={isQuote}
                formatDate={formatDate}
              />

              <div className="mb-10">
                <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-4 border-b-2 border-stone-100 pb-3" style={{ borderColor: '#f5f5f4', color: '#1c1917' }}>Detalle de Prendas</h4>
                <div className="space-y-0">
                  {consolidateCommercialItems(order.items || [], isInstitutional).map((it: any, idx: number) => {
                    const unitPrice = resolveItemPrice(it, order.pricingTier || 'Minorista (PVP)', pricing);
                    const lineTotal = unitPrice * (it.qty || 1);

                    return (
                      <div key={idx} className="flex flex-col gap-1 text-sm border-b border-stone-100 pb-3 mb-3 last:border-0" style={{ borderColor: '#f5f5f4' }}>
                        <div className="flex justify-between items-start">
                          <div className="flex gap-4 items-start">
                            <span className="font-black w-6 pt-[2px]" style={{ color: '#1c1917' }}>{it.qty}</span>
                            <div className="flex flex-col">
                              <span className="font-black uppercase tracking-tight" style={{ color: '#1c1917' }}>
                                {it.name}{' '}
                                <span className="font-mono text-stone-400 font-bold" style={{ color: '#57534e' }}>
                                  <span className="normal-case">Bs</span>{unitPrice.toFixed(2)}
                                </span>
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#57534e' }}>
                                {it.fabric}{it.fabricColor ? ` - COLOR - ${it.fabricColor}` : ''}
                              </span>
                            </div>
                          </div>
                          <span className="font-mono font-bold" style={{ color: '#1c1917' }}>
                            <span className="normal-case">Bs</span>{lineTotal.toFixed(2)}
                          </span>
                        </div>

                        {it.services?.length > 0 && (
                          <div className="flex flex-col gap-1 pl-10">
                            {it.services.filter((s: string) => {
                              const srv = pricing?.services?.find((x: any) => x.name === s && x.garment === it.name) ||
                                pricing?.services?.find((x: any) => x.name === s && x.garment === 'Global') ||
                                pricing?.services?.find((x: any) => x.name === s);
                              const hasCustomPrice = Boolean(it.customServicePrices && Number(it.customServicePrices[s]) > 0);
                              if (hasCustomPrice) return false;
                              return !srv || srv.type === 'Opción de Confección' || srv.type === 'Variante Base';
                            }).map((s: string) => {
                              let lbl = s;
                              if (s.toLowerCase().includes('bolsillo') && it.pocketName) lbl = `${s}: ${it.pocketName}`;
                              if (s === 'Bolsillos personalizados' && it.customPocketDetails) lbl = `${s}: ${it.customPocketDetails}`;
                              return (
                                <div key={s} className="flex justify-between items-center">
                                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#44403c' }}>· {lbl}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {it.services?.length > 0 && (
                          <div className="flex flex-col gap-1 pl-10 mt-1">
                            {it.services.filter((s: string) => {
                              const srv = pricing?.services?.find((x: any) => x.name === s && x.garment === it.name) ||
                                pricing?.services?.find((x: any) => x.name === s && x.garment === 'Global') ||
                                pricing?.services?.find((x: any) => x.name === s);
                              const hasCustomPrice = Boolean(it.customServicePrices && Number(it.customServicePrices[s]) > 0);
                              if (hasCustomPrice) return true;
                              return (!srv && s.toUpperCase().includes('LOGO')) ||
                                (srv && (srv.type === 'Costo Adicional' || srv.type === 'Costo Adicional Editable' || srv.type === 'Escala de Volumen (Logos)'));
                            }).map((s: string) => {
                              let lbl = s;
                              if (s.toLowerCase().includes('bolsillo') && it.pocketName) lbl = `${s}: ${it.pocketName}`;
                              if (s === 'Bolsillos personalizados' && it.customPocketDetails) lbl = `${s}: ${it.customPocketDetails}`;
                              const customPrice = (it.customServicePrices && it.customServicePrices[s] !== undefined && Number(it.customServicePrices[s]) > 0)
                                ? Number(it.customServicePrices[s])
                                : getServiceUnitPrice(s, it, order.items);
                              return (
                                <div key={s} className="flex justify-between items-center">
                                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#44403c' }}>
                                    · {lbl} <span className="font-mono text-stone-400 font-bold ml-1" style={{ color: '#57534e' }}><span className="normal-case">Bs</span>{customPrice.toFixed(2)}</span>
                                  </span>
                                  <span className="font-mono text-[10px] font-bold" style={{ color: '#1c1917' }}>
                                    <span className="normal-case">Bs</span>{(customPrice * (it.qty || 1)).toFixed(2)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {it.embroideries && it.embroideries.length > 0 && (
                          <div className="flex flex-col gap-1 pl-10 mt-1">
                            {it.embroideries.map((emb: string, eIdx: number) => {
                              let embName = emb;
                              let embPrice = 0;
                              if (emb.startsWith('Otro:')) {
                                const parts = emb.split('|');
                                embName = parts[0].replace('Otro:', '').trim();
                                if (parts.length === 2) embPrice = parseFloat(parts[1]) || 0;
                              }
                              return (
                                <div key={`emb-${eIdx}`} className="flex justify-between items-center">
                                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#44403c' }}>
                                    · {embName} {embPrice > 0 && <span className="font-mono text-stone-400 font-bold ml-1" style={{ color: '#57534e' }}><span className="normal-case">Bs</span>{embPrice.toFixed(2)}</span>}
                                  </span>
                                  {embPrice > 0 && (
                                    <span className="font-mono text-[10px] font-bold" style={{ color: '#1c1917' }}>
                                      <span className="normal-case">Bs</span>{(embPrice * (it.qty || 1)).toFixed(2)}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {breakdown.lines && breakdown.lines.length > 0 && (
                    <div className="border-t border-stone-200 my-4 pt-3 flex flex-col gap-2" style={{ borderColor: '#e5e5e5' }}>
                      {breakdown.lines.map((line: any, lIdx: number) => (
                        <div key={lIdx} className="flex justify-between items-center">
                          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#dc2626' }}>{line.label}</span>
                          <span className="font-mono text-[10px] font-bold" style={{ color: '#dc2626' }}>-<span className="normal-case">Bs</span>{line.amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Payment History Section */}
              <InvoicePaymentHistory
                paymentHistory={order.paymentHistory || []}
                formatDate={formatDate}
              />

              {/* Financial Ledger Section */}
              <InvoiceFinancialLedger
                order={order}
                subtotal={subtotal}
                totalPrice={totalPrice}
                totalPaid={totalPaid}
                balance={balance}
                credit={credit}
                breakdown={breakdown}
                getOrderBreakdown={getOrderBreakdown}
              />

              <InvoiceActionButtons
                order={order}
                showWhatsappFormatId={showWhatsappFormatId}
                setShowWhatsappFormatId={setShowWhatsappFormatId}
                setViewingInvoiceId={setViewingInvoiceId}
                downloadOrderImage={downloadOrderImage}
                getWhatsAppText={getWhatsAppText}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
