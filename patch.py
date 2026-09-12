import sys

with open('src/hooks/useOrderSubmission.ts', 'r') as f:
    content = f.read()

header = """import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getNextSequentialQuoteId, getNextSequentialOrderId } from '../utils/sequenceUtils';
import { compressImage } from '../utils/imageUtils';
import { determineNewOrderProductionStatus } from '../utils/orderUtils';
import { resolveSellerInfo } from '../utils/sellerUtils';
import { provisionInstitutionalContacts } from '../utils/institutionalOrderUtils';
import { ensureCorporateAccountExists, ensureContactExists } from '../utils/accountContactMutations';
import { normalizeRole } from '../utils/constants';
import { Order, OrderItem, AuthUserProfile, FirebaseUserSubset } from '../types';

export interface OrderSubmissionState {
  newOrder: Order;
  orderHeaderMode: 'Cotización' | 'Orden Activa';
  editingQuoteId: string | null;
  userProfile: AuthUserProfile | null;
  user: FirebaseUserSubset | null;
  setIsSubmitting: (val: boolean) => void;
  resetForm: () => void;
}

export interface OrderSubmissionActions {
  setShowNewOrder: (val: boolean) => void;
  setOrderToCollect: (val: Order | null) => void;
  setManualAmount: (val: string) => void;
  setManualReceipt: (val: string | null) => void;
}

export interface OrderBreakdown {
  total: number;
  subtotal: number;
  lines: Array<{ label: string; amount: number }>;
}

export interface OrderPricingEngine {
  getOrderBreakdown: (
    items: OrderItem[],
    category?: string,
    paymentMethod?: string,
    manualDiscount?: number,
    clientType?: string,
    accountId?: string,
    migrationFlatDiscount?: number
  ) => OrderBreakdown;
}

export interface PaymentOptions {
  note?: string;
  method?: string;
  tendered?: number;
  change?: number;
}

export const useOrderSubmission = (
  state: OrderSubmissionState,
  actions: OrderSubmissionActions,
  pricingEngine: OrderPricingEngine
) => {
  const { newOrder, orderHeaderMode, editingQuoteId, userProfile, user, setIsSubmitting, resetForm } = state;
  const { setShowNewOrder, setOrderToCollect, setManualAmount, setManualReceipt } = actions;
  const { getOrderBreakdown } = pricingEngine;

  const handleCreateOrder = async (
    e?: { preventDefault: () => void }, 
    paymentAmt?: string, 
    receiptBase64?: string | null, 
    paymentOptions?: PaymentOptions
  ) => {"""

target_start = "export const useOrderSubmission ="
target_end = "if (e && e.preventDefault) e.preventDefault();"

start_idx = content.find(target_start)
end_idx = content.find(target_end, start_idx)

new_content = header + "\n    " + content[end_idx:]

with open('src/hooks/useOrderSubmission.ts', 'w') as f:
    f.write(new_content)
