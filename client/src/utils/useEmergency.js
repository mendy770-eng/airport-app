import { useContext } from 'react';
import { EmergencyContext } from './EmergencyContext';

export const useEmergency = () => {
    const context = useContext(EmergencyContext);
    if (context === undefined) {
        throw new Error('useEmergency must be used within an EmergencyProvider');
    }
    return context;
};