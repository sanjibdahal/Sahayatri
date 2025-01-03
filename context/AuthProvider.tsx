import React, { createContext, useState, useEffect, PropsWithChildren } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

type AuthProps = {
    user: User | null
    session: Session | null
    initialized?: boolean
    signOut?: () => void
    loading?: boolean
}

export const AuthContext = createContext<AuthProps>({
    user: null,
    session: null,
    initialized: false,
    signOut: () => {},
})

// Custom hook to read the context values

export default function AuthProvider ({ children }: PropsWithChildren)  {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [initialized, setInitialized] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchSession = async () => {
            const { data } = await supabase.auth.getSession()
            setSession(data.session)
            setUser(session?.user ?? null)
            setInitialized(true)
            setLoading(false)
        }
        fetchSession()
        // Listen for changes to authentication state
        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUser(session ? session.user : null)
            setInitialized(true)
        })
        
    }, [])

    // Log out the user
    const signOut = async () => {
        await supabase.auth.signOut()
    }

    const value = {
        user,
        session,
        initialized,
        signOut,
        loading,
    }

    return (<AuthContext.Provider value={value}>{children}</AuthContext.Provider>);
}

export function useAuth() {
    return React.useContext(AuthContext)
}

