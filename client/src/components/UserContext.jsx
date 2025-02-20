import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export function UserContextProvider(props) {
    const [user, setUser] = useState(null);
    const logUser = (userData, token) => {
        localStorage.setItem('user-data', JSON.stringify(userData));
        localStorage.setItem('user-token', token);
        setUser(userData);
    }
    const unlogUser = () => {
        localStorage.removeItem('user-data');
        localStorage.removeItem('user-token');
        setUser(null);
    }
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user-data');
        if (token && !userData) {
            localStorage.removeItem('user-token');
        } else if (!token && userData) {
            localStorage.removeItem('user-data');
        } else if (token && userData) {
            setUser(JSON.parse(userData));
        }
    }, []);
    const value = { user, logUser, unlogUser };
    return <UserContext.Provider value={value}>
        {props.children}
    </UserContext.Provider>
}