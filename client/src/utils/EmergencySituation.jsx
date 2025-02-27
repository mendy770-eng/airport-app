import { useState, useEffect } from 'react';
import { EmergencyContext } from './EmergencyContext';

export const EmergencyProvider = ({ children }) => {
    const [isEmergency, setIsEmergency] = useState(false);
    const [emergencyTime, setEmergencyTime] = useState(null);

    useEffect(() => {
        let timer;
        if (isEmergency) {
            timer = setTimeout(() => {
                setIsEmergency(false);
                setEmergencyTime(null);
            }, 10000);
        }
        return () => timer && clearTimeout(timer);
    }, [isEmergency]);

    const value = {
        isEmergency,
        emergencyTime,
        declareEmergency: () => {
            setIsEmergency(true);
            setEmergencyTime(new Date());
        },
        clearEmergency: () => {
            setIsEmergency(false);
            setEmergencyTime(null);
        }
    };

    return (
        <EmergencyContext.Provider value={value}>
            {children}
        </EmergencyContext.Provider>
    );
};
