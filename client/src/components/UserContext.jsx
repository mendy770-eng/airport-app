import { createContext, useState, useEffect, useMemo, useCallback } from 'react';

export const UserContext = createContext();

export function UserContextProvider(props) {
    const [user, setUser] = useState(null);

    const logUser = useCallback((userData, token) => {
        try {
            localStorage.setItem('user-data', JSON.stringify(userData));
            localStorage.setItem('user-token', token);
            const expiresAt = new Date().getTime() + (60 * 60 * 1000);
            localStorage.setItem('user-expires', expiresAt.toString());
            setUser(userData);
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    }, []);

    const unlogUser = useCallback(() => {
        try {
            localStorage.removeItem('user-data');
            localStorage.removeItem('user-token');
            localStorage.removeItem('user-expires');
            setUser(null);
        } catch (error) {
            console.error('Error removing user data:', error);
        }
    }, []);

    useEffect(() => {
        const checkAuth = () => {
            try {
                const token = localStorage.getItem('user-token');
                const userData = localStorage.getItem('user-data');
                const expiresAt = localStorage.getItem('user-expires');

                if (expiresAt && new Date().getTime() > parseInt(expiresAt)) {
                    unlogUser();
                    return;
                }

                if (token && !userData) {
                    localStorage.removeItem('user-token');
                } else if (!token && userData) {
                    localStorage.removeItem('user-data');
                } else if (token && userData) {
                    setUser(JSON.parse(userData));
                }
            } catch (error) {
                console.error('Error checking auth:', error);
                unlogUser();
            }
        };

        checkAuth();

        const interval = setInterval(checkAuth, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [unlogUser]);

    const value = useMemo(() => ({ 
        user, 
        logUser, 
        unlogUser 
    }), [user, logUser, unlogUser]);

    return (
        <UserContext.Provider value={value}>
            {props.children}
        </UserContext.Provider>
    );
}