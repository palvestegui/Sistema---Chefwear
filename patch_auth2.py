import re

with open('src/contexts/AuthContext.tsx', 'r') as f:
    content = f.read()

new_use_effect = """  useEffect(() => {
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
  }, [auth, db]);"""

content = re.sub(r"  useEffect\(\(\) => \{.*?\}, \[auth, db\]\);", new_use_effect, content, flags=re.DOTALL)

with open('src/contexts/AuthContext.tsx', 'w') as f:
    f.write(content)
