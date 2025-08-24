import { createContext, useContext, useState, ReactNode } from 'react';

interface ConnectionConfig {
    ip: string;
    port: string;
    path: string;
    setIp: (ip: string) => void;
    setPort: (port: string) => void;
    setPath: (path: string) => void;
};

const ConnectionContext = createContext<ConnectionConfig | undefined>(undefined);

export const ConnectionProvider = ({ children }: { children: ReactNode }) => {
    const [ip, setIp] = useState('');
    const [port, setPort] = useState('');
    const [path, setPath] = useState('');

    return (
        <ConnectionContext.Provider value={{ ip, port, path, setIp, setPort, setPath }}>
            {children}
        </ConnectionContext.Provider>
    );
};

export const useConnection = () => {
    const context = useContext(ConnectionContext);
    if (!context) {
        throw new Error('useConnection must be used within a ConnectionProvider');
    }
    return context;
};