import { useContext } from "react";
import { NetworkStatusContext } from "../../contexts/NetworkStatusProvider";

const OfflineBanner = () => {
  const isOnline = useContext(NetworkStatusContext);

  if (isOnline) return null;

  return (
    <div className="absolute m-0 z-10 top-2 left-1/2 -translate-x-1/2 bg-red-600 text-white p-4 rounded-lg shadow-lg flex items-center justify-center">
      <p className="text-sm md:text-base font-medium">
        🚨 You are offline. Check your network and try again.
      </p>
    </div>
  );
};

export default OfflineBanner;
