import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, doc, Unsubscribe } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import { Order, PricingData, FirebaseUserSubset } from '../types';
import { ClientAccount, MasterContact } from '../types/crm'; // Need to check if firebase is exported from '../firebase'

export interface DataContextType {
  clientAccounts: ClientAccount[];
  masterContacts: MasterContact[];
  orders: Order[];
  accountContacts: Array<{ id: string; accountId?: string; contactId?: string }>;
  sizeTables: Record<string, any> | null;
  usersList: FirebaseUserSubset[];
  pricing: PricingData | null;
  isLoading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType>({
  clientAccounts: [],
  masterContacts: [],
  orders: [],
  accountContacts: [],
  sizeTables: null,
  usersList: [],
  pricing: null,
  isLoading: true,
  error: null
});

export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: React.ReactNode, db: any }> = ({ children, db }) => {
  const [clientAccounts, setClientAccounts] = useState<ClientAccount[]>([]);
  const [masterContacts, setMasterContacts] = useState<MasterContact[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [accountContacts, setAccountContacts] = useState<Array<{ id: string; accountId?: string; contactId?: string }>>([]);
  const [sizeTables, setSizeTables] = useState<Record<string, any> | null>(null);
  const [usersList, setUsersList] = useState<FirebaseUserSubset[]>([]);
  
  const [pricing, setPricing] = useState<PricingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      setClientAccounts([]);
      setMasterContacts([]);
      setOrders([]);
      setAccountContacts([]);
      setSizeTables(null);
      setUsersList([]);
      setPricing(null);
      setIsLoading(false);
      return;
    }

    let unsubs: Unsubscribe[] = [];
    setIsLoading(true);
    setError(null);
    try {
      unsubs.push(onSnapshot(collection(db, 'clientAccounts'), (snapshot) => {
        setClientAccounts(snapshot.docs.map(d => ({ id: d.id, accountId: d.data().accountId || d.id, ...d.data() } as ClientAccount)));
      }));

      unsubs.push(onSnapshot(collection(db, 'masterContacts'), (snapshot) => {
        setMasterContacts(snapshot.docs.map(d => ({ id: d.id, contactId: d.data().contactId || d.id, ...d.data() } as MasterContact)));
      }));
      
      unsubs.push(onSnapshot(collection(db, 'account_contacts'), (snapshot) => {
        setAccountContacts(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any)));
      }));

      unsubs.push(onSnapshot(query(collection(db, 'orders'), orderBy('createdAt', 'desc')), (snapshot) => {
        setOrders(snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Order)));
      }));
      
      unsubs.push(onSnapshot(doc(db, 'settings', 'sizeTables'), (snap) => {
        if (snap.exists()) {
           setSizeTables(snap.data() as Record<string, any>);
        }
      }));

      unsubs.push(onSnapshot(collection(db, 'users'), (snapshot) => {
        setUsersList(snapshot.docs.map(d => ({ ...d.data(), uid: d.id } as FirebaseUserSubset)));
      }));

      unsubs.push(onSnapshot(doc(db, 'pricing', 'global'), (docSnap) => {
        if (docSnap.exists()) {
          setPricing(docSnap.data() as PricingData);
        } else {
          setPricing(null);
        }
      }));

      setIsLoading(false);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
    
    return () => unsubs.forEach(unsub => unsub());
  }, [db, user, authLoading]);

  return (
    <DataContext.Provider value={{ clientAccounts, masterContacts, orders, accountContacts, sizeTables, usersList, pricing, isLoading, error }}>
      {children}
    </DataContext.Provider>
  );
};
