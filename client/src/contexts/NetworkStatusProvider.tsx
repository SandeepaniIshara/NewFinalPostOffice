import { createContext, useState, useEffect, type ReactNode } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const NetworkStatusContext = createContext<boolean>(false);

export const NetworkStatusProvider = ({ children }:{children: ReactNode}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return (
    <NetworkStatusContext.Provider value={isOnline}>
      {children}
    </NetworkStatusContext.Provider>
  );
};
