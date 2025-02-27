import { createContext, useState, useContext } from 'react';

const EmergencyContext = createContext();

export const EmergencyProvider = ({ children }) => {
    const [isEmergency, setIsEmergency] = useState(false);

    return (
        <EmergencyContext.Provider value={{ isEmergency, setIsEmergency }}>
            {children}
        </EmergencyContext.Provider>
    );
};

export const useEmergency = () => useContext(EmergencyContext); 