import re

with open('src/contexts/DataContext.tsx', 'r') as f:
    content = f.read()

# Fix imports
content = content.replace("import { db } from '../firebase';",
                          "import { db } from '../firebase';\nimport { useAuth } from './AuthContext';\nimport { Order, PricingData, FirebaseUserSubset } from '../types';\nimport { ClientAccount, MasterContact } from '../types/crm';")
content = content.replace("import { collection, onSnapshot, query, orderBy, doc } from 'firebase/firestore';",
                          "import { collection, onSnapshot, query, orderBy, doc, Unsubscribe } from 'firebase/firestore';")

# Fix interface
new_interface = """export interface DataContextType {
  clientAccounts: ClientAccount[];
  masterContacts: MasterContact[];
  orders: Order[];
  accountContacts: Array<{ id: string; accountId?: string; contactId?: string }>;
  sizeTables: Record<string, any> | null;
  usersList: FirebaseUserSubset[];
  pricing: PricingData | null;
  isLoading: boolean;
  error: string | null;
}"""
content = re.sub(r"export interface DataContextType \{.*?\n\}", new_interface, content, flags=re.DOTALL)

# Fix useState types
content = content.replace("useState<any[]>([])", "useState<any[]>([])") # Just to match what's there before we replace specific ones
content = content.replace("const [clientAccounts, setClientAccounts] = useState<any[]>([]);", "const [clientAccounts, setClientAccounts] = useState<ClientAccount[]>([]);")
content = content.replace("const [masterContacts, setMasterContacts] = useState<any[]>([]);", "const [masterContacts, setMasterContacts] = useState<MasterContact[]>([]);")
content = content.replace("const [orders, setOrders] = useState<any[]>([]);", "const [orders, setOrders] = useState<Order[]>([]);")
content = content.replace("const [accountContacts, setAccountContacts] = useState<any[]>([]);", "const [accountContacts, setAccountContacts] = useState<Array<{ id: string; accountId?: string; contactId?: string }>>([]);")
content = content.replace("const [sizeTables, setSizeTables] = useState<any | null>(null);", "const [sizeTables, setSizeTables] = useState<Record<string, any> | null>(null);")
content = content.replace("const [usersList, setUsersList] = useState<any[]>([]);", "const [usersList, setUsersList] = useState<FirebaseUserSubset[]>([]);")
content = content.replace("const [pricing, setPricing] = useState<any | null>(null);", "const [pricing, setPricing] = useState<PricingData | null>(null);")

# Add useAuth to DataProvider
content = content.replace("const [error, setError] = useState<string | null>(null);", "const [error, setError] = useState<string | null>(null);\n  const { user, isLoading: authLoading } = useAuth();")

# Guard the useEffect
old_use_effect = """  useEffect(() => {
    let unsubs: any[] = [];
    try {
      unsubs.push(onSnapshot(collection(db, 'clientAccounts'), (snapshot) => {
        setClientAccounts(snapshot.docs.map(doc => ({ id: doc.id, accountId: doc.data().accountId || doc.id, ...doc.data() })));
      }));

      unsubs.push(onSnapshot(collection(db, 'masterContacts'), (snapshot) => {
        setMasterContacts(snapshot.docs.map(doc => ({ id: doc.id, contactId: doc.data().contactId || doc.id, ...doc.data() })));
      }));
      
      unsubs.push(onSnapshot(collection(db, 'account_contacts'), (snapshot) => {
        setAccountContacts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }));

      unsubs.push(onSnapshot(query(collection(db, 'orders'), orderBy('createdAt', 'desc')), (snapshot) => {
        setOrders(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      }));
      
      unsubs.push(onSnapshot(doc(db, 'settings', 'sizeTables'), (snap) => {
        if (snap.exists()) {
           setSizeTables(snap.data());
        }
      }));

      unsubs.push(onSnapshot(collection(db, 'users'), (snapshot) => {
        setUsersList(snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id })));
      }));

      
      unsubs.push(onSnapshot(doc(db, 'pricing', 'global'), (docSnap) => {
        if (docSnap.exists()) {
          setPricing(docSnap.data());
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
  }, [db]);"""

new_use_effect = """  useEffect(() => {
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
  }, [db, user, authLoading]);"""

content = content.replace(old_use_effect, new_use_effect)

with open('src/contexts/DataContext.tsx', 'w') as f:
    f.write(content)
