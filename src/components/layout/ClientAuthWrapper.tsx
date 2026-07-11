"use client";

import React, { useEffect, useState, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const AuthContext = createContext<{ user: SupabaseUser | null, loading: boolean }>({ user: null, loading: true });

export const useClientAuth = () => useContext(AuthContext);

export default function ClientAuthWrapper({ 
  children, 
  requireAuth = false,
  requireGuest = false,
  fallback = null 
}: { 
  children: React.ReactNode,
  requireAuth?: boolean,
  requireGuest?: boolean,
  fallback?: React.ReactNode 
}) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;
    const checkUser = async () => {
      const { createClient } = await import('@/utils/supabase/client');
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!mounted) return;
      
      setUser(user);
      setLoading(false);

      if (requireAuth && !user) {
        router.push(`${pathname.split('/')[1] ? '/' + pathname.split('/')[1] : '/en'}/login?next=${pathname}`);
      } else if (requireGuest && user) {
        router.push(`${pathname.split('/')[1] ? '/' + pathname.split('/')[1] : '/en'}`);
      }
    };
    checkUser();
    return () => { mounted = false; };
  }, [requireAuth, requireGuest, router, pathname]);

  if (loading && (requireAuth || requireGuest)) return <>{fallback}</>;
  
  if (requireAuth && !user) return null;
  if (requireGuest && user) return null;

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {loading ? fallback : children}
    </AuthContext.Provider>
  );
}
