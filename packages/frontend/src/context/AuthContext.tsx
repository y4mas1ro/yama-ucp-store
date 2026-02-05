'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '@/lib/api';
import { useRouter, usePathname } from 'next/navigation';

type AuthContextType = {
    user: any | null;
    token: string | null;
    login: (credentials: any) => Promise<void>;
    logout: () => void;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PROTECTED_ROUTES = ['/cart', '/checkout', '/history', '/mypage'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const storedToken = localStorage.getItem('yama_token');
        if (storedToken) {
            setToken(storedToken);
            verifySession();
        } else {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!loading) {
            const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
            if (isProtected && !token) {
                router.push('/login');
            }
        }
    }, [pathname, token, loading, router]);

    const verifySession = async () => {
        try {
            const data = await authApi.getSession();
            setUser(data);
        } catch (error) {
            console.error('Session verification failed:', error);
            handleLogout();
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (credentials: any) => {
        const data = await authApi.login(credentials);
        localStorage.setItem('yama_token', data.token);
        setToken(data.token);
        setUser({ username: data.username });
        router.push('/products');
    };

    const handleLogout = () => {
        localStorage.removeItem('yama_token');
        setToken(null);
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, login: handleLogin, logout: handleLogout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
