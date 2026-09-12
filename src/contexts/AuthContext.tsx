import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut, GoogleAuthProvider, signInWithRedirect, getRedirectResult, User, Auth } from 'firebase/auth';
import { doc, onSnapshot, getDoc, setDoc, serverTimestamp, Firestore } from 'firebase/firestore';
import { auth as defaultAuth, db as defaultDb } from '../firebase';
import { DEFAULT_USER_CONFIGS } from '../utils/constants';
import { AuthUserProfile } from '../types'; // Need to export these properly from firebase.ts

export interface AuthContextType {
  user: User | null;
  userProfile: AuthUserProfile | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserRole?: (role: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  isAdmin: false,
  isSuperAdmin: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode, auth?: Auth, db?: Firestore }> = ({ children, auth = defaultAuth, db = defaultDb }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<AuthUserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  };
  
  const logout = async () => {
    await firebaseSignOut(auth);
  };

  useEffect(() => {
    let unsubProfile: (() => void) | null = null;
    
    getRedirectResult(auth).catch(err => {
      console.error("Auth Redirect Error:", err);
    });

    const unsubAuth = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);
      if (authUser) {
        const userDocRef = doc(db, 'users', authUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (!userDocSnap.exists()) {
          const emailLower = (authUser.email || '').toLowerCase().trim();
          const defaultConfig = DEFAULT_USER_CONFIGS[emailLower];
          
          await setDoc(userDocRef, {
            email: authUser.email,
            displayName: authUser.displayName,
            photoURL: authUser.photoURL,
            role: defaultConfig ? defaultConfig.role : 'SALES',
            status: defaultConfig ? defaultConfig.status : 'PENDING',
            canExport: defaultConfig ? defaultConfig.canExport : false,
            canEditPrices: defaultConfig ? defaultConfig.canEditPrices : false,
            canManageRoles: defaultConfig ? defaultConfig.canManageRoles : false,
            canAccessDangerZone: defaultConfig ? defaultConfig.canAccessDangerZone : false,
            createdAt: serverTimestamp()
          });
        }
        
        if (unsubProfile) unsubProfile();
        unsubProfile = onSnapshot(userDocRef, (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            const emailLower = (authUser.email || '').toLowerCase().trim();
            const defaultConfig = DEFAULT_USER_CONFIGS[emailLower];
            
            const profile: AuthUserProfile = {
              uid: authUser.uid,
              id: authUser.uid,
              role: data.role || (defaultConfig ? defaultConfig.role : 'SALES'),
              name: data.name || data.displayName || authUser.displayName || (defaultConfig ? defaultConfig.name : (authUser.email ? authUser.email.split('@')[0] : 'Vendedor')),
              status: data.status || (defaultConfig ? defaultConfig.status : 'PENDING'),
              canExport: data.canExport ?? (defaultConfig ? defaultConfig.canExport : false),
              canEditPrices: data.canEditPrices ?? (defaultConfig ? defaultConfig.canEditPrices : false),
              canManageRoles: data.canManageRoles ?? (defaultConfig ? defaultConfig.canManageRoles : false),
              canAccessDangerZone: data.canAccessDangerZone ?? (defaultConfig ? defaultConfig.canAccessDangerZone : false),
              email: authUser.email || ''
            };
            
            setUserProfile(profile);
            setIsAdmin(profile.role === 'SUPERADMIN' || profile.role === 'ADMIN' || profile.role === 'SUPER_ADMIN');
          } else {
            setUserProfile(null);
            setIsAdmin(false);
          }
          setIsLoading(false);
        });
      } else {
        if (unsubProfile) {
          unsubProfile();
          unsubProfile = null;
        }
        setUserProfile(null);
        setIsAdmin(false);
        setIsLoading(false);
      }
    });

    return () => {
      unsubAuth();
      if (unsubProfile) unsubProfile();
    };
  }, [auth, db]);

  const isSuperAdmin = Boolean(
    userProfile?.role === 'SUPER_ADMIN' ||
    userProfile?.role === 'SUPERADMIN' ||
    (user?.email && user.email.toLowerCase() === 'palvestegui@gmail.com') ||
    (userProfile?.email && userProfile.email.toLowerCase() === 'palvestegui@gmail.com')
  );

  return (
    <AuthContext.Provider value={{ user, userProfile, isAdmin, isSuperAdmin, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
