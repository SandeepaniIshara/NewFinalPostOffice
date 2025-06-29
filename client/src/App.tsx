import "./App.css";
import OfflineBanner from "./components/networkStatus/offlineBanner";
import { NetworkStatusProvider } from "./contexts/NetworkStatusProvider";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <NetworkStatusProvider>
        <OfflineBanner />
        <AppRoutes />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          aria-label={undefined}
        />
      </NetworkStatusProvider>
    </>
  );
}

export default App;
